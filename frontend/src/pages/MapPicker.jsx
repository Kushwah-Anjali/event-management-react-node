// src/components/MapPicker.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ClickMarker({ onSelect, initialPosition }) {
  const [pos, setPos] = useState(initialPosition || null);

  // Update marker if initialPosition changes
  useEffect(() => {
    if (initialPosition) {
      setPos([initialPosition.lat, initialPosition.lng]);
    }
  }, [initialPosition]);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPos([lat, lng]);
      onSelect({ lat, lng });
    },
  });

  return pos ? <Marker position={pos} /> : null;
}

export default function MapPicker({ onSelect, initialPosition, height = 300 }) {
  const center = initialPosition
    ? [initialPosition.lat, initialPosition.lng]
    : [28.6139, 77.2090]; // Default: Delhi

  return (
    <div style={{ borderRadius: 8, overflow: "hidden" }}>
      <MapContainer
        key={center.toString()}   // 🔥 Forces rerender so marker ALWAYS appears
        center={center}
        zoom={13}
        style={{ height, width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickMarker
          onSelect={onSelect}
          initialPosition={initialPosition}
        />
      </MapContainer>
    </div>
  );
}
