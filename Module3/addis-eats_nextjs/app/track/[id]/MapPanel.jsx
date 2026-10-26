"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window` the moment it is imported, so it cannot be rendered on the server at all.
// ssr:false is not an optimisation here — it is the only way the library can load (Day 47).
// The placeholder is exactly as tall as the map, so nothing jumps when it arrives (CLS).
const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => <div className="map-box map-box--loading" aria-hidden="true" />,
});

export default function MapPanel(props) {
  return <DeliveryMap {...props} />;
}
