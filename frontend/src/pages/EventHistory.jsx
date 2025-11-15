
import React from "react";
import { useLocation } from "react-router-dom";
function EventHistory() {
  const location = useLocation();
  const { event } = location.state || {};
  
  return (
    <div>
      <h2>Event History: {event?.title}</h2>
      <p>{event?.description}</p>
      {/* Add more details here */}
    </div>
  );
}
export default EventHistory;