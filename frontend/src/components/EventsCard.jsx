import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import RegisterModal from "./RegisterModal";
import "../styles/Events.css";

export default function EventsCard({ event }) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleRegisterClick = () => setShowModal(true);
  const handleHistoryClick = () => navigate("/event-history", {  state: { eventId: event.id } });
  const handleCloseModal = () => setShowModal(false);
const handleMapClick = () => {
  navigate("/map", { state: { 
    lat: event.latitude,
    lng: event.longitude,
    venue: event.venue
  }});
};

  // Format date
  const formattedDate = (() => {
    if (!event.date) return "Date TBD";
    const parts = event.date.split(" ");
    return isNaN(parts[0]) ? `${parts[1]} ${parts[0]}` : `${parts[0]} ${parts[1]}`;
  })();

  // Check if event is past
  const isPastEvent = (() => {
    if (!event.date) return false;
    const [day, month, year] = (() => {
      const parts = event.date.split(" ");
      return !isNaN(parts[0])
        ? [parseInt(parts[0]), parts[1], parseInt(parts[2]) || new Date().getFullYear()]
        : [parseInt(parts[1]), parts[0], parseInt(parts[2]) || new Date().getFullYear()];
    })();
    const monthIndex = new Date(`${month} 1, 2000`).getMonth();
    const eventDate = new Date(year, monthIndex, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today;
  })();

  return (
    <div className={`card border-0 shadow-sm overflow-hidden position-relative event-card ${isPastEvent ? "past-event" : ""}`}>
      
      {/* Image Section */}
      <div className="position-relative overflow-hidden">
        {event.image ? (
          <img
            src={`http://localhost:5000/events/${event.image}`}
            alt={event.title || "Event"}
            className={`card-img-top img-fluid event-img ${isPastEvent ? "img-dim" : ""}`}
          />
        ) : (
          <div className="bg-light d-flex align-items-center justify-content-center event-placeholder">
            <span className="text-muted fw-semibold">Image Coming Soon</span>
          </div>
        )}

        {/* Overlay Title & Action Button */}
        <div className="position-absolute bottom-0 start-0 w-100 px-3 pb-3 d-flex justify-content-between align-items-center text-white z-3">
          <h5 className="fw-bold mb-0 text-shadow">{event.title || "Event Title"}</h5>

          {isPastEvent ? (
            <button
              className="btn btn-secondary border-0"
              onClick={handleHistoryClick}
              title="Event Ended"
            >
              <i className="bi bi-clock-history fs-5"></i>
            </button>
          ) : (
            <button
              className="btn btn-gradient-circle border-0"
              onClick={handleRegisterClick}
              title="Register"
            >
              <i className="bi bi-pencil-square fs-5"></i>
            </button>
          )}
          <button
              className="btn btn-gradient-circle border-0"
              onClick={handleMapClick}
              title="Location"
            >
              <i className="bi bi-geo-alt-fill fs-5"></i>

            </button>
        </div>

        {/* Date Badge */}
        <div className="event-date-badge d-flex justify-content-center align-items-center">
          <span>{formattedDate}</span>
        </div>

        {/* Hover Description */}
        <div className="event-hover position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-white text-center px-3">
          <small>{isPastEvent ? "Event Ended" : event.description || "No description available"}</small>
        </div>
      </div>

      {/* Modal */}
      <RegisterModal key={showModal} show={showModal} handleClose={handleCloseModal} eventId={event.id} />
    </div>
  );
}
