import React from "react";
import "../styles/Events.css";

export default function EventsCard({ event }) {
  return (
    <div className="card card-event flex-fill h-100 animate-card">
      {/* Event Image */}
      <div className="event-img-wrapper">
        {event.image ? (
          <img src={event.image} className="event-img" />
        ) : (
          // Example for event image
          // const imageUrl = `http://localhost:5000/uploads/events/${event.image}`;

          <div className="no-img-text">Image Coming Soon</div>
        )}
      </div>

      {/* Event Details */}
      <div className="event-details">
        <div className="event-header">
          <h5 className="event-title">{event.title || "Event Title"}</h5>
          <div className="event-date">{event.date || "TBD"}</div>
        </div>
        <div className="event-footer">
          <button className="btn-register">
            <i className="bi bi-pencil-square"></i> Register
          </button>
        </div>
      </div>
    </div>
  );
}
