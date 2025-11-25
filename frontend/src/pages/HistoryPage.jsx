import React from "react";
import { useLocation } from "react-router-dom";

export default function HistoryPage() {
  const location = useLocation();
  const eventId = location.state?.eventId;

  console.log("Event ID:", eventId); // You can use this for backend API calls

  return (
    <h1>hiii</h1>
  );
}
