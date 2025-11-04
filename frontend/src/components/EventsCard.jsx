import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import RegisterModal from "./RegisterModal"; // 👈 Import the modal

export default function EventsCard({ event }) {
  // 🔹 Step 1: Create a state to control modal visibility
  const [showModal, setShowModal] = useState(false);

  // 🔹 Step 2: Function to open modal
  const handleRegisterClick = () => {
    setShowModal(true);
  };

  // 🔹 Step 3: Function to close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 🔹 Step 4: Handle form submit from modal
  const handleRegisterSubmit = (userData) => {
    console.log("User registered for event:", {
      event,
      userData,
    });

    // 🚀 Here later we’ll redirect to the event detail page
    // using React Router and pass event + user data
  };

  return (
    <>
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
            <p className="mb-0 small">
              {event.description || "No description available"}
            </p>
          </div>
        </div>

        {/* === Card Body === */}
        <div className="card-body d-flex flex-column justify-content-between">
          <h5 className="card-title fw-bold text-dark mb-3">
            {event.title || "Event Title"}
          </h5>

          <div className="d-flex justify-content-end">
            <button
              className="btn btn-gradient-circle position-relative"
              title="Register"
              onClick={handleRegisterClick} // 👈 Opens modal
            >
              <i className="bi bi-pencil-square fs-5"></i>
              <span className="register-text position-absolute">Register</span>
            </button>
          </div>
        </div>
      </div>

      {/* === Modal Component === */}
      <RegisterModal
        show={showModal}
        handleClose={handleCloseModal}
        eventId={event.id}
        onSubmit={handleRegisterSubmit}
      />
    </>
  );
}
