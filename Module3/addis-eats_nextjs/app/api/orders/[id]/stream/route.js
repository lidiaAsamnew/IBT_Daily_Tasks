import { getSession } from "@/lib/session";
import { getOrderFor } from "@/lib/orders";
import { isTerminal } from "@/lib/order-status";
import { trackingSnapshot } from "@/lib/tracking";
import { failFrom, serverError } from "@/lib/http";

// Server-sent events (Day 47): a route handler that does not end straight away.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30; // serverless platforms cap request time; the browser reconnects by itself when we close

const TICK_MS = 2000;
const LIFETIME_MS = 25_000;
const encoder = new TextEncoder();

// The message format is strict: "data: " + payload + TWO newlines. One newline and the browser waits forever.
const message = (data) => encoder.encode(`data: ${JSON.stringify(data)}\n\n`);

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const session = await getSession();
    const first = await getOrderFor(session, id); // authentication + ownership BEFORE the stream opens
    if (!first.ok) return failFrom(first);

    let timer;
    let closed = false;
    const stream = new ReadableStream({
      async start(controller) {
        const close = () => {
          if (closed) return;
          closed = true;
          clearTimeout(timer);
          try { controller.close(); } catch { /* already closed */ }
        };
        request.signal.addEventListener("abort", close);

        controller.enqueue(encoder.encode("retry: 3000\n\n")); // how long the browser waits before reconnecting
        controller.enqueue(message(trackingSnapshot(first.order)));
        if (isTerminal(trackingSnapshot(first.order).status)) return close();

        const startedAt = Date.now();
        const tick = async () => {
          if (closed) return;
          try {
            // Re-read each time: the order may have been cancelled or advanced by staff meanwhile.
            const latest = await getOrderFor(session, id);
            if (!latest.ok) return close();
            const snapshot = trackingSnapshot(latest.order);
            controller.enqueue(message(snapshot));
            if (isTerminal(snapshot.status) || Date.now() - startedAt >= LIFETIME_MS) return close();
            timer = setTimeout(tick, TICK_MS);
          } catch {
            close();
          }
        };
        timer = setTimeout(tick, TICK_MS);
      },
      cancel() {
        closed = true;
        clearTimeout(timer);
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    return serverError(error);
  }
}
