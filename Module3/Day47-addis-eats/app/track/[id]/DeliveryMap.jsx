import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css"; // without it the map renders as scattered, broken tiles
import { KITCHEN, MAP_HEIGHT_PX, ZONE_RADIUS_M } from "@/lib/geo";
import { time } from "@/lib/format";

// Loaded only through MapPanel (next/dynamic, ssr:false), so touching `window` on import is safe here.
// Coordinates are [lat, lng] everywhere in this file.

// Our own pins, drawn with HTML: Leaflet's default marker images are looked up by a path that bundlers break,
// and an HTML pin needs no image file at all. Built once, at module level.
const pin = (emoji, color) =>
  divIcon({
    className: "", // drops Leaflet's default white square
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -18],
    html: `<div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:9999px;background:${color};border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);font-size:20px;line-height:1">${emoji}</div>`,
  });
const COURIER_ICON = pin("\u{1F6F5}", "#1d5c3f"); // scooter, forest
const HOME_ICON = pin("\u{1F3E0}", "#a8341f"); // house, berbere

// Fits the view to the courier AND the delivery point. Re-fits when the stage changes (the courier jumps from the
// kitchen to the road to the door), not on every tick: a person who panned the map is not dragged back every 2 seconds.
function FitToBoth({ points, stage }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 1) map.setView(points[0], 15);
    else map.fitBounds(points, { padding: [48, 48], maxZoom: 16 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, stage]);
  return null;
}

export default function DeliveryMap({ delivery, courier, customer, area, stage, etaAt }) {
  const home = [delivery.lat, delivery.lng];
  const bike = courier ? [courier.lat, courier.lng] : null;
  const points = bike ? [bike, home] : [home];
  const finished = stage === "delivered" || stage === "cancelled";

  return (
    <MapContainer center={home} zoom={14} scrollWheelZoom={false} style={{ height: MAP_HEIGHT_PX, width: "100%" }} className="rounded-2xl border border-injera">
      {/* The attribution is a licence condition of the OpenStreetMap tiles, not decoration. */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Circle center={home} radius={ZONE_RADIUS_M} pathOptions={{ color: "#1d5c3f", weight: 2, fillColor: "#1d5c3f", fillOpacity: 0.08 }} />
      <Marker position={home} icon={HOME_ICON} title={`Delivery: ${area}`}>
        <Popup>{customer} &middot; {area} &middot; {finished && stage === "delivered" ? "delivered" : `arriving ${time(etaAt)}`}</Popup>
      </Marker>
      {bike ? (
        <Marker position={bike} icon={COURIER_ICON} title="Courier">
          <Popup>Courier &middot; {stage === "on the way" ? "on the way" : stage === "delivered" ? "arrived" : `at ${KITCHEN.name}`}</Popup>
        </Marker>
      ) : null}
      <FitToBoth points={points} stage={stage} />
    </MapContainer>
  );
}
