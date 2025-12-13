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

  useEffect(() => {
    if (initialPosition) {
      setPos([initialPosition.lat, initialPosition.lng]);
    }
  }, [initialPosition]);

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPos([lat, lng]);

      // Reverse geocode
      const address = await reverseGeocode(lat, lng);

      onSelect({ lat, lng, address });
    },
  });

  return pos ? <Marker position={pos} /> : null;
}

async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

  const res = await fetch(url);
  const data = await res.json();

  return data.display_name || "Unknown location";
}

function MapSearch({ onSearch }) {
  const [query, setQuery] = useState("");
  const map = useMapEvents({});

  const handleSearch = async () => {
    if (!query.trim()) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.length > 0) {
      const { lat, lon, display_name } = data[0];

      // Move map to searched location
      map.setView([lat, lon], 15);

      // Send lat/lng + address to parent
      onSearch({
        lat: Number(lat),
        lng: Number(lon),
        address: display_name,
      });
    }
  };

  return (
    <div className="p-2 bg-white shadow-sm d-flex mb-2 rounded">
      <input
        className="form-control"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search location..."
      />
      <button className="btn btn-primary ms-2" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}

export default function MapPicker({ onSelect, initialPosition, height = 300 }) {
  const [markerPos, setMarkerPos] = useState(initialPosition || null);

  const center = markerPos
    ? [markerPos.lat, markerPos.lng]
    : [28.6139, 77.2090]; // Default Delhi

  return (
    <div style={{ borderRadius: 8, overflow: "hidden" }}>
      
      {/* Search input above map */}
      <MapContainer
        key={center.toString()}
        center={center}
        zoom={13}
        style={{ height, width: "100%" }}
      >
        <MapSearch
          onSearch={({ lat, lng, address }) => {
            // Update marker inside map
            setMarkerPos({ lat, lng });

            // Pass back to parent
            onSelect({ lat, lng, address });
          }}
        />

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Marker */}
        {markerPos && <Marker position={[markerPos.lat, markerPos.lng]} />}

      <ClickMarker
  onSelect={({ lat, lng, address }) => {
    setMarkerPos({ lat, lng });
    onSelect({ lat, lng, address }); 
  }}
  initialPosition={initialPosition}
/>

      </MapContainer>
    </div>
  );
}
