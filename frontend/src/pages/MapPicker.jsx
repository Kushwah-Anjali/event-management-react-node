import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

export default function MapPicker({
  onSelect,
  initialPosition,
  height = 300,
}) {
  const [markerPos, setMarkerPos] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
  });

  const center =
    markerPos ||
    initialPosition || {
      lat: 28.6139,
      lng: 77.209,
    };

  useEffect(() => {
    if (initialPosition) {
      setMarkerPos({
        lat: Number(initialPosition.lat),
        lng: Number(initialPosition.lng),
      });
    }
  }, [initialPosition]);

  const reverseGeocode = async (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();

    return new Promise((resolve) => {
      geocoder.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === "OK" && results?.length) {
            resolve(results[0].formatted_address);
          } else {
            resolve(null);
          }
        }
      );
    });
  };

  const handleMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setMarkerPos({ lat, lng });

    const address = await reverseGeocode(lat, lng);
    onSelect({ lat, lng, address });
  };

  if (!isLoaded) {
    return <div style={{ height }}>Loading map…</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={{ height, width: "100%" }}
      center={center}
      zoom={13}
      onClick={handleMapClick}
    >
      {markerPos && <Marker position={markerPos} />}
    </GoogleMap>
  );
}
