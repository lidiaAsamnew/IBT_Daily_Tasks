// Test helper only: lets plain Node import files that use the "@/..." alias and `server-only`, so the order
// logic can be tested without starting Next. Not used by the app.
import { pathToFileURL, fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function resolve(specifier, context, next) {
  if (specifier === "server-only") return { url: "data:text/javascript,export {}", shortCircuit: true };
  if (specifier.startsWith("@/")) {
    const base = path.join(root, specifier.slice(2));
    const file = [base, `${base}.js`].find((f) => existsSync(f) && f.endsWith(".js")) ?? `${base}.js`;
    return { url: pathToFileURL(file).href, shortCircuit: true };
  }
  if ((specifier.startsWith("./") || specifier.startsWith("../")) && !path.extname(specifier) && context.parentURL?.startsWith("file:")) {
    const file = path.resolve(path.dirname(fileURLToPath(context.parentURL)), `${specifier}.js`);
    if (existsSync(file)) return { url: pathToFileURL(file).href, shortCircuit: true };
  }
  return next(specifier, context);
}
