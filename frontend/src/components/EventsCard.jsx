import React from "react";
import "../styles/Events.css";

export default function EventsCard({ event }) {
 console.log(`Full image URL: http://localhost:5000/events/${event.image}`);


  return (
    <div className="card card-event flex-fill h-100 animate-card">
      {/* Event Image */}
      <div className="event-img-wrapper">
        {event.image ? (
          <img
            src={`http://localhost:5000/events/${event.image}`} // ✅ only one uploads/events path
            alt={event.title || "Event image"}
            className="event-img"
          />
        ) : (
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
