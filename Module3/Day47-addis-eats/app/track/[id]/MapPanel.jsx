"use client";

import dynamic from "next/dynamic";
import { MAP_HEIGHT_PX } from "@/lib/geo";

// Leaflet touches `window` the moment it is imported, so importing it in anything that renders on the server
// crashes the build. `ssr: false` is not an optimisation here: it is the only way the library can load at all.
// (next/dynamic with ssr:false must live in a client component, which is why this file exists.)
const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  // Exactly as tall as the map, so nothing below it jumps when the map arrives (the same CLS problem as an unsized image).
  loading: () => (
    <div
      role="status"
      aria-label="Loading map"
      style={{ height: MAP_HEIGHT_PX }}
      className="flex items-center justify-center rounded-2xl border border-injera bg-injera/30 text-sm text-muted motion-safe:animate-pulse"
    >
      Loading map...
    </div>
  ),
});

export default function MapPanel(props) {
  return <DeliveryMap {...props} />;
}
