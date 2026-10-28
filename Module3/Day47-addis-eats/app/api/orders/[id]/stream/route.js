import { getOrder, getOrderView, canAccess } from "@/lib/orders";
import { getSession } from "@/lib/session";
import { errorResponse } from "@/lib/http";
import { FINAL_STAGES } from "@/lib/stages";
import { trackStream } from "@/lib/streams";

// Day 47: server-sent events. GET /api/orders/ord_ab12cd/stream keeps ONE ordinary HTTP response open and
// writes a message whenever the order changes (the stage, or the courier's position while on the way).
// It is the Day 39 route handler returning a stream instead of a body, so it needs no new infrastructure.
//
// Same checks as GET /api/orders/[id], and they run BEFORE the stream starts:
//   401 not signed in, 404 unknown order, 403 not yours.
export const dynamic = "force-dynamic"; // never cached, never prerendered
export const runtime = "nodejs"; // the order store lives in this process's memory

const TICK_MS = 2000; // how often we look for a change
const HEARTBEAT_MS = 15_000; // a comment line, so proxies do not close a connection that looks idle

export async function GET(request, { params }) {
  const user = await getSession();
  if (!user) return errorResponse("Sign in required", 401);

  const { id } = await params;
  const order = getOrder(id);
  if (!order) return errorResponse("No such order", 404);
  if (!canAccess(order, user)) return errorResponse("That order is not yours", 403);

  const encoder = new TextEncoder(); // a Response body is bytes, not strings
  let stop = () => {};

  const stream = new ReadableStream({
    start(controller) {
      const done = trackStream(id);
      let tick;
      let beat;
      let closed = false;

      function close() {
        if (closed) return;
        closed = true;
        clearInterval(tick);
        clearInterval(beat);
        done();
        try { controller.close(); } catch { /* already closed by the client going away */ }
      }
      const write = (text) => {
        try { controller.enqueue(encoder.encode(text)); } catch { close(); }
      };

      let last = "";
      function push() {
        const view = getOrderView(id);
        if (!view) return close();
        const { checkedAt, ...state } = view; // checkedAt changes every tick; only a real change is worth sending
        const key = JSON.stringify(state);
        if (key !== last) {
          last = key;
          // THE FORMAT: "data: " + the payload + TWO newlines. With one newline the browser keeps waiting for the
          // end of a message that never completes. (Payload is one JSON line, so it cannot contain a newline.)
          write(`data: ${JSON.stringify({ ...state, checkedAt })}\n\n`);
        }
        if (FINAL_STAGES.includes(view.stage)) close(); // nothing more will ever change: end the stream deliberately
      }

      write("retry: 3000\n\n"); // if the connection drops, the browser reconnects after 3 s
      push(); // the current state at once, so a reconnect resyncs without the client doing anything
      if (!closed) {
        tick = setInterval(push, TICK_MS);
        beat = setInterval(() => write(": keep-alive\n\n"), HEARTBEAT_MS);
      }

      request.signal.addEventListener("abort", close); // the browser navigated away or closed the tab
      stop = close;
    },
    cancel() { stop(); }, // the consumer cancelled the stream
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // nginx: do not hold the messages back to batch them
    },
  });
}
