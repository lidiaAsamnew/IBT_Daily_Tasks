"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // without it the tiles render as a broken jigsaw

// Leaflet's default pin images do not survive bundling, so the markers are simple HTML icons.
const pin = (emoji, label) =>
  L.divIcon({ className: "map-pin", html: `<span role="img" aria-label="${label}">${emoji}</span>`, iconSize: [36, 36], iconAnchor: [18, 18] });

const ICONS = {
  kitchen: pin("🍲", "Kitchen"),
  home: pin("📍", "Delivery address"),
  courier: pin("🛵", "Courier"),
};

// Fit all three points on screen once, on mount. [lat, lng] — Leaflet order (GeoJSON is [lng, lat]).
function FitAll({ points }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 15 });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fit once; later courier moves must not re-zoom the map
  }, [map]);
  return null;
}

export default function DeliveryMap({ kitchen, destination, courier, status }) {
  const showCourier = status === "on_the_way" || status === "delivered";
  return (
    <div className="map-box">
      <MapContainer center={destination.position} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <FitAll points={[kitchen.position, destination.position]} />
        <Marker position={kitchen.position} icon={ICONS.kitchen}><Popup>{kitchen.label}</Popup></Marker>
        <Marker position={destination.position} icon={ICONS.home}><Popup>{destination.label}</Popup></Marker>
        {showCourier && <Marker position={courier} icon={ICONS.courier}><Popup>Your courier</Popup></Marker>}
      </MapContainer>
    </div>
  );
}
