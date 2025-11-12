import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DocumentUploadModal from "../components/DocumentUploadModal";

function RegisterDetails() {
  const location = useLocation();
  const { name, email, eventId, registered_at } = location.state || {};

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
 const [showUploadModal, setShowUploadModal] = useState(false);



  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/register/event/${eventId}`);
        const data = await res.json();

        if (data.status === "success") {
          setEvent(data.event);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchEventDetails();
  }, [eventId]);

  return (
   <div className="container py-5">
  <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
    <div className="card-header bg-primary text-white text-center py-4">
      <h2 className="fw-bold mb-1">Registration Summary</h2>
      <p className="text-light mb-0 small">Your registration details & event overview</p>
    </div>

    <div className="card-body bg-light p-4">
      {/* Registration Info */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <div
                className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center"
                style={{ width: "50px", height: "50px", fontSize: "1.5rem" }}
              >
                🎉
              </div>
              <div className="ms-3">
                <h5 className="fw-bold mb-0 text-success">Welcome, {name}!</h5>
                <small className="text-muted">Your registration is confirmed</small>
              </div>
            </div>

            <button
              className="btn btn-primary fw-semibold px-4 py-2"
              onClick={() => setShowUploadModal(true)}
            >
              Upload Documents
            </button>
          </div>

          <hr />

          <div className="row text-muted">
            <div className="col-md-6 mb-2">
              <i className="bi bi-envelope text-primary me-2"></i>
              <strong>Email:</strong> {email}
            </div>
            <div className="col-md-6 mb-2">
              <i className="bi bi-calendar-check text-success me-2"></i>
              <strong>Registered On:</strong>{" "}
              {registered_at
                ? new Date(registered_at).toLocaleDateString()
                : "Not available"}
            </div>
          </div>
        </div>
      </div>

      {/* Event Info */}
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : event ? (
        <div className="card border-0 shadow-sm rounded-3">
          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="card-img-top img-fluid"
              style={{
                height: "250px",
                objectFit: "cover",
                borderRadius: "0.5rem 0.5rem 0 0",
              }}
            />
          )}
          <div className="card-body p-4">
            <h3 className="fw-bold text-primary mb-3">
              <i className="bi bi-star-fill me-2 text-warning"></i>
              {event.title}
            </h3>

            <div className="row mb-3 g-2">
              <div className="col-md-6">
                <i className="bi bi-calendar-event text-primary me-2"></i>
                <strong>Date:</strong> {event.date || "Not specified"}
              </div>
              <div className="col-md-6">
                <i className="bi bi-geo-alt text-danger me-2"></i>
                <strong>Venue:</strong> {event.venue || "Not available"}
              </div>
              <div className="col-md-6">
                <i className="bi bi-person-circle text-info me-2"></i>
                <strong>Author:</strong> {event.author || "Not available"}
              </div>
              <div className="col-md-6">
                <i className="bi bi-cash-coin text-success me-2"></i>
                <strong>Fees:</strong> {event.fees || "Free"}
              </div>
            </div>

            <p className="text-secondary mb-0">{event.description}</p>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning text-center mt-4">
          Event details not found.
        </div>
      )}
    </div>

    <div className="card-footer text-center bg-white py-3">
      <small className="text-muted">
        © {new Date().getFullYear()} Event Management Portal
      </small>
    </div>
  </div>

  {/* Upload Modal */}
  <DocumentUploadModal
    show={showUploadModal}
    handleClose={() => setShowUploadModal(false)}
    event={event}
    email={email}
    event_id={eventId}
  />
</div>

  );
}

export default RegisterDetails;
