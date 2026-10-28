import "server-only";

// Day 47: counts the order streams that are open right now, and says so in the dev console:
//   [stream] opened ord_ab12cd (open: 1)  /  [stream] closed ord_ab12cd (open: 0)
// That is the "navigate away five times: how many connections are open?" check. Answer: zero.
// Lives on globalThis so the route handler's copy and everyone else's are one.
const state = (globalThis.__addisStreams ??= { open: 0 });
const log = (what, id) => {
  if (process.env.NODE_ENV !== "production") console.log(`[stream] ${what} ${id} (open: ${state.open})`);
};

/** Call when a stream opens. Returns the function to call, once, when it ends. */
export function trackStream(id) {
  state.open += 1;
  log("opened", id);
  let ended = false;
  return () => {
    if (ended) return;
    ended = true;
    state.open -= 1;
    log("closed", id);
  };
}
