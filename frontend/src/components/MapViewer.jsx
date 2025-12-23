// src/components/MapViewer.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
const Base_url=process.env.REACT_APP_API_URL;
export default function MapViewer({ lat, lng, height = 400 }) {
  const position = [lat, lng];
  const [address, setAddress] = useState("Loading address...");

  const formatAddress = (address) => {
  if (!address) return "Address not available";

  const parts = [
    address.neighbourhood,
    address.suburb,
    address.city_district,
    address.city,
    address.postcode,
    address.country
  ];

  // Filter out undefined or empty values, then join
  return parts.filter(Boolean).join(", ");
};


  useEffect(() => {
  const fetchAddress = async () => {
  try {
    console.log("Fetching address for:", lat, lng);

    const response = await fetch(
      `${Base_url}/api/reverse-geo?lat=${lat}&lon=${lng}`
    );

    const data = await response.json();

    console.log("Received address data:", data['address']);

    const formatted = formatAddress(data['address']);
    console.log("Formatted address:", formatted);

    if (data['address']) setAddress(formatted);
    else setAddress("Address not found");
  } catch (error) {
    setAddress("Error fetching address");
  }
};

    fetchAddress();
  }, [lat, lng]);

  return (
    <div
      style={{
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.05)",
        height,
        width: "100%",
        background: "#0a0a0a",
      }}
    >
      <MapContainer
        center={position}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Marker with bluish-gradient card above it */}
        <Marker position={position}>
          <Popup closeButton={false}>
            <div
              style={{
                width: 220,
                padding: "12px 14px",
                borderRadius: 12,
                background:
                  "linear-gradient(135deg, rgba(40,60,120,0.95), rgba(10,20,40,0.95))",
                color: "white",
                backdropFilter: "blur(6px)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.45)",
              }}
            >
              <h4
                style={{
                  margin: "0 0 6px 0",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: 0.3,
                }}
              >
                Event Location
              </h4>

              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.9)",
                  lineHeight: 1.3,
                }}
              >
                {address}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
