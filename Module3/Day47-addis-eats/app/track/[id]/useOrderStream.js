"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FINAL_STAGES } from "@/lib/stages";

const MAX_FAILURES = 3; // consecutive failed (re)connections before we give up on the stream and poll instead

/**
 * The live order. Seeded from the server render (`initial`), then kept current by server-sent events.
 *
 *   connection: "connecting" | "live" | "reconnecting" | "paused" | "polling" | "closed"
 *
 * - the EventSource is closed on unmount, when the order is final, and while the tab is hidden;
 * - EventSource reconnects by itself after a drop; the server sends the full current state on every connect,
 *   so a reconnect resyncs with nothing extra to write;
 * - if the stream cannot be kept up (3 failures in a row, or the server refuses it), fall back to polling the
 *   JSON endpoint every 5 s: the Day 41 mechanism, which still works when a proxy buffers or blocks streams.
 */
export function useOrderStream(id, initial) {
  const [order, setOrder] = useState(initial);
  const [open, setOpen] = useState("connecting"); // what the EventSource last told us
  const [fallback, setFallback] = useState(false);
  const [visible, setVisible] = useState(true);
  const finished = FINAL_STAGES.includes(order.stage);

  // The tab is hidden: nobody is looking, so hold no connection. It reconnects (and resyncs) when the tab returns.
  useEffect(() => {
    const sync = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  useEffect(() => {
    if (finished || fallback || !visible) return undefined;
    if (typeof EventSource === "undefined") { // very old browser: polling is all there is
      setFallback(true);
      return undefined;
    }
    const es = new EventSource(`/api/orders/${id}/stream`);
    let failures = 0;

    es.onopen = () => { failures = 0; setOpen("live"); };
    es.onmessage = (e) => {
      const next = JSON.parse(e.data); // JSON has no Date type: every time in the order is a number (ms), not a Date
      setOrder(next);
      if (FINAL_STAGES.includes(next.stage)) es.close(); // delivered or cancelled: close DELIBERATELY, before the browser tries to reconnect
    };
    es.onerror = () => {
      failures += 1;
      // CLOSED = the server said no (401/403/404) or the response was not an event stream: reconnecting cannot help.
      if (es.readyState === EventSource.CLOSED || failures >= MAX_FAILURES) {
        es.close();
        setFallback(true);
      } else {
        setOpen("reconnecting"); // the browser is already retrying
      }
    };

    return () => { // unmount, order finished, tab hidden or id changed: no connection is left behind
      es.close();
      setOpen("connecting");
    };
  }, [id, finished, fallback, visible]);

  const { error } = useSWR(fallback && !finished ? `/api/orders/${id}` : null, fetcher, {
    refreshInterval: 5000,
    onSuccess: setOrder,
  });

  let connection = open;
  if (finished) connection = "closed";
  else if (fallback) connection = "polling";
  else if (!visible) connection = "paused";

  return { order, connection, error };
}
