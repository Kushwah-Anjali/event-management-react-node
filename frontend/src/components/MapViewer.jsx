import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";

const Base_url = process.env.REACT_APP_API_URL;

export default function MapViewer({ lat, lng, venue, height = 400 }) {
  const [address, setAddress] = useState("Loading address...");
  const [showInfo, setShowInfo] = useState(true);
  const [markerRef, setMarkerRef] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
  });

  // Stable position object
  const position =
    typeof lat === "number" && typeof lng === "number"
      ? { lat, lng }
      : null;

  const formatAddress = (address) => {
    if (!address) return "Address not available";

    const parts = [
      address.neighbourhood,
      address.suburb,
      address.city_district,
      address.city,
      address.postcode,
      address.country,
    ];

    return parts.filter(Boolean).join(", ");
  };

  useEffect(() => {
    if (!position) return;

    const fetchAddress = async () => {
      try {
        const res = await fetch(
          `${Base_url}/api/reverse-geo?lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        setAddress(
          data.address ? formatAddress(data.address) : "Address not found"
        );
      } catch {
        setAddress("Error fetching address");
      }
    };

    fetchAddress();
  }, [lat, lng, position]);

  if (!isLoaded || !position) {
    return <div style={{ height }}>Loading map…</div>;
  }

  return (
    <div
      style={{
        height,
        width: "100%",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <GoogleMap
        mapContainerStyle={{ height: "100%", width: "100%" }}
        center={position}
        zoom={16}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        <Marker
          position={position}
          onLoad={(marker) => setMarkerRef(marker)}
          onClick={() => setShowInfo(true)}
        />

        {markerRef && showInfo && (
          <InfoWindow
            anchor={markerRef}
            onCloseClick={() => setShowInfo(false)}
          >
            <div
              style={{
                width: 220,
                padding: "12px 14px",
                borderRadius: 12,
                background:
                  "linear-gradient(135deg, rgba(40,60,120,0.95), rgba(10,20,40,0.95))",
                color: "white",
                boxShadow: "0 8px 20px rgba(0,0,0,0.45)",
              }}
            >
              <h4 style={{ margin: "0 0 6px", fontSize: 15 }}>
                {venue || "Event Location"}
              </h4>
              <p style={{ margin: 0, fontSize: 13 }}>{address}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
