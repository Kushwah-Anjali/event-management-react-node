import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Events.css";

export default function EventsCard({ event }) {
  return (
    <div className="card shadow-sm border-0 h-100 position-relative overflow-hidden animate-card">
      {/* === Image Section === */}
      <div className="position-relative">
        {event.image ? (
          <img
            src={`http://localhost:5000/events/${event.image}`}
            alt={event.title || "Event"}
            className="card-img-top"
          />
        ) : (
          <div
            className="bg-light d-flex align-items-center justify-content-center"
            style={{ height: "220px" }}
          >
            <span className="text-muted fw-semibold">Image Coming Soon</span>
          </div>
        )}

        {/* === Date Circle === */}
     <div className="event-date-badge d-flex flex-column justify-content-center align-items-center">
  <span className="day">{event.date?.split(" ")[0] || "??"}</span>
  <span className="month">{event.date?.split(" ")[1] || "TBD"}</span>
</div>


        {/* === Hover Description Overlay === */}
        <div className="event-hover position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-center text-white p-3">
          <p className="mb-0 small">{event.description || "No description available"}</p>
        </div>
      </div>

      {/* === Card Body === */}
      <div className="card-body d-flex flex-column justify-content-between">
        <h5 className="card-title fw-bold text-dark mb-3">{event.title || "Event Title"}</h5>

        <div className="d-flex justify-content-end">
          <button
            className="btn btn-gradient-circle position-relative"
            title="Register"
          >
            <i className="bi bi-pencil-square fs-5"></i>
            <span className="register-text position-absolute">Register</span>
          </button>
        </div>
      </div>
    </div>
  );
}
