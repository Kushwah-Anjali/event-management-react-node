// src/pages/MapPage.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import MapViewer from "../components/MapViewer";

export default function MapPage() {
  const location = useLocation();
  const { lat, lng, venue } = location.state || {};

  if (!lat || !lng) return <p>No location data available</p>;

  return (
    <div style={{ padding: 20 }}>
    
      <MapViewer lat={lat} lng={lng} height={420} />
    </div>
  );
}
