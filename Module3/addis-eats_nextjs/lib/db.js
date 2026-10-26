// A tiny key-value store with three interchangeable drivers, chosen by environment:
//   neon    DATABASE_URL is set            hosted Postgres (production / preview on Vercel)
//   file    local development              .data/db.json, survives restarts
//   memory  Vercel without DATABASE_URL    resets whenever the serverless function restarts (demo only!)
// Everything else in the app talks to `db` only, so swapping storage never touches a route.
// Values must be JSON-serialisable. `col` is a collection name, `id` a string key.

import { promises as fs } from "node:fs";
import path from "node:path";

const g = globalThis;
g.__addisEatsDb ??= { memory: new Map(), queue: Promise.resolve(), sqlPromise: null };
const state = g.__addisEatsDb;

export function driverName() {
  if (process.env.DB_DRIVER) return process.env.DB_DRIVER;
  if (process.env.DATABASE_URL) return "neon";
  if (process.env.VERCEL) return "memory";
  return "file";
}

/* ---------- memory ---------- */
const memKey = (col, id) => `${col}\u0000${id}`;
const memory = {
  async get(col, id) {
    const raw = state.memory.get(memKey(col, id));
    return raw === undefined ? null : JSON.parse(raw);
  },
  async set(col, id, value) {
    state.memory.set(memKey(col, id), JSON.stringify(value));
  },
  async setIfAbsent(col, id, value) {
    if (state.memory.has(memKey(col, id))) return false;
    state.memory.set(memKey(col, id), JSON.stringify(value));
    return true;
  },
  async delete(col, id) {
    state.memory.delete(memKey(col, id));
  },
  async list(col) {
    const prefix = `${col}\u0000`;
    return [...state.memory].filter(([k]) => k.startsWith(prefix)).map(([, v]) => JSON.parse(v));
  },
};

/* ---------- file ---------- */
const filePath = () => process.env.DB_FILE || path.join(process.cwd(), ".data", "db.json");

async function readAll() {
  try {
    return JSON.parse(await fs.readFile(filePath(), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}

// Writes are serialised through one promise chain and land via temp-file + rename, so two requests
// can never interleave a read-modify-write or leave a half-written file.
function mutate(fn) {
  const run = state.queue.then(async () => {
    const data = await readAll();
    const result = await fn(data);
    const file = filePath();
    await fs.mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data));
    await fs.rename(tmp, file);
    return result;
  });
  state.queue = run.catch(() => {});
  return run;
}

const file = {
  async get(col, id) {
    return (await readAll())[col]?.[id] ?? null;
  },
  set: (col, id, value) =>
    mutate((data) => {
      (data[col] ??= {})[id] = value;
    }),
  setIfAbsent: (col, id, value) =>
    mutate((data) => {
      data[col] ??= {};
      if (id in data[col]) return false;
      data[col][id] = value;
      return true;
    }),
  delete: (col, id) =>
    mutate((data) => {
      if (data[col]) delete data[col][id];
    }),
  async list(col) {
    return Object.values((await readAll())[col] ?? {});
  },
};

/* ---------- neon (hosted Postgres) ---------- */
function getSql() {
  state.sqlPromise ??= (async () => {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(process.env.DATABASE_URL);
    await sql`CREATE TABLE IF NOT EXISTS kv (
      col  text  NOT NULL,
      id   text  NOT NULL,
      data jsonb NOT NULL,
      PRIMARY KEY (col, id)
    )`;
    return sql;
  })().catch((error) => {
    state.sqlPromise = null; // allow a retry on the next request
    throw error;
  });
  return state.sqlPromise;
}

const neonDriver = {
  async get(col, id) {
    const sql = await getSql();
    const rows = await sql`SELECT data FROM kv WHERE col = ${col} AND id = ${id}`;
    return rows[0]?.data ?? null;
  },
  async set(col, id, value) {
    const sql = await getSql();
    await sql`INSERT INTO kv (col, id, data) VALUES (${col}, ${id}, ${JSON.stringify(value)}::jsonb)
              ON CONFLICT (col, id) DO UPDATE SET data = EXCLUDED.data`;
  },
  async setIfAbsent(col, id, value) {
    const sql = await getSql();
    const rows = await sql`INSERT INTO kv (col, id, data) VALUES (${col}, ${id}, ${JSON.stringify(value)}::jsonb)
                           ON CONFLICT (col, id) DO NOTHING RETURNING id`;
    return rows.length === 1;
  },
  async delete(col, id) {
    const sql = await getSql();
    await sql`DELETE FROM kv WHERE col = ${col} AND id = ${id}`;
  },
  async list(col) {
    const sql = await getSql();
    const rows = await sql`SELECT data FROM kv WHERE col = ${col}`;
    return rows.map((r) => r.data);
  },
};

const drivers = { memory, file, neon: neonDriver };
const pick = () => {
  const driver = drivers[driverName()];
  if (!driver) throw new Error(`Unknown DB_DRIVER "${driverName()}". Use neon, file or memory.`);
  return driver;
};

export const db = {
  get: (col, id) => pick().get(col, id),
  set: (col, id, value) => pick().set(col, id, value),
  /** Store only if the key is free. Returns true when this call created it (atomic). */
  setIfAbsent: (col, id, value) => pick().setIfAbsent(col, id, value),
  delete: (col, id) => pick().delete(col, id),
  list: (col) => pick().list(col),
};
