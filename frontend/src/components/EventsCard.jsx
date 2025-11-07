import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import RegisterModal from "./RegisterModal";
import "../styles/Events.css";

export default function EventsCard({ event }) {
  const [showModal, setShowModal] = useState(false);

  const handleRegisterClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

const formattedDate = (() => {
  if (!event.date) return "?? Nov";

  // Split by space
  const parts = event.date.split(" ");

  // If it's in "Nov 25" format -> reverse it
  if (isNaN(parts[0])) {
    return `${parts[1]} ${parts[0]}`;
  }

  // Otherwise, assume it's already "25 Nov"
  return `${parts[0]} ${parts[1]}`;
})();


  return (
    <>
      <div className="card border-0  shadow-sm overflow-hidden position-relative event-card">
        {/* === Image Section === */}
        <div className="position-relative overflow-hidden">
          {event.image ? (
            <img
              src={`http://localhost:5000/events/${event.image}`}
              alt={event.title || "Event"}
              className="card-img-top img-fluid event-img"
            />
          ) : (
            <div
              className="bg-light d-flex align-items-center justify-content-center"
              style={{ height: "300px" }}
            >
              <span className="text-muted fw-semibold">Image Coming Soon</span>
            </div>
          )}

          {/* === Title + Register Button Overlay === */}
          <div className="position-absolute bottom-0 start-0 w-100 px-3 pb-3 d-flex justify-content-between align-items-center text-white z-3">
            <h5 className="fw-bold mb-0 text-shadow">
              {event.title || "Event Title"}
            </h5>
            <button
              className="btn btn-gradient-circle border-0"
              onClick={handleRegisterClick}
              title="Register"
            >
              <i className="bi bi-pencil-square fs-5"></i>
            </button>
          </div>

          {/* === Date Badge (Inline Style) === */}
          <div className="event-date-badge d-flex justify-content-center align-items-center">
            <span className="fw-semibold">{formattedDate}</span>
          </div>

          {/* === Hover Overlay === */}
          <div className="event-hover position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-white text-center px-3">
            <small>{event.description || "No description available"}</small>
          </div>
        </div>

        {/* === Modal === */}
        <RegisterModal
          show={showModal}
          handleClose={handleCloseModal}
          eventId={event.id}
        />
      </div>
    </>
  );
}
