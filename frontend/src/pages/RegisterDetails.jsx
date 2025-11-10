import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function RegisterDetails() {
  const location = useLocation();
  const { name, email, eventId, registered_at } = location.state || {};

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-12">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-primary text-white text-center py-4">
              <h2 className="fw-bold mb-0">Registration Summary</h2>
              <p className="text-light opacity-75 mb-0">
                Your registration details and event overview
              </p>
            </div>

            <div className="card-body p-5 bg-light">
              {/* ✅ Registration Details Section */}
              <div className="card border-0 shadow-sm mb-5 rounded-3">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
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

                  <hr />

                  <p className="mb-2">
                    <i className="bi bi-envelope text-primary me-2"></i>
                    <strong>Email:</strong> {email}
                  </p>
                  <p className="mb-0">
                    <i className="bi bi-calendar-check text-success me-2"></i>
                    <strong>Registered On:</strong>{" "}
                    {registered_at
                      ? new Date(registered_at).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>
              </div>

              {/* ✅ Event Details Section */}
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : event ? (
                <div className="card border-0 shadow-sm rounded-3">
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="card-img-top"
                      style={{
                        height: "300px",
                        objectFit: "cover",
                        borderTopLeftRadius: "0.5rem",
                        borderTopRightRadius: "0.5rem",
                      }}
                    />
                  )}
                  <div className="card-body p-4">
                    <h3 className="fw-bold text-primary mb-3">
                      <i className="bi bi-star-fill me-2 text-warning"></i>
                      {event.title}
                    </h3>

                    <div className="row mb-3">
                      <div className="col-md-6 mb-2">
                        <i className="bi bi-calendar-event text-primary me-2"></i>
                        <strong>Date:</strong> {event.date || "Not specified"}
                      </div>
                      <div className="col-md-6 mb-2">
                        <i className="bi bi-geo-alt text-danger me-2"></i>
                        <strong>Venue:</strong> {event.venue || "Not available"}
                      </div>
                      <div className="col-md-6 mb-2">
                        <i className="bi bi-person-circle text-info me-2"></i>
                        <strong>Author:</strong> {event.author || "Not available"}
                      </div>
                      <div className="col-md-6 mb-2">
                        <i className="bi bi-cash-coin text-success me-2"></i>
                        <strong>Fees:</strong> {event.fees || "Free"}
                      </div>
                      <div className="col-md-6 mb-2">
                        <i className="bi bi-telephone text-secondary me-2"></i>
                        <strong>Contact:</strong> {event.contact || "Not available"}
                      </div>
                    </div>

                    <p className="text-secondary mb-4">
                      {event.description || "No description provided."}
                    </p>

                    {event.required_documents &&
                      event.required_documents.length > 0 && (
                        <div className="mt-3">
                          <h6 className="fw-bold text-dark mb-2">
                            <i className="bi bi-folder2-open text-primary me-2"></i>
                            Required Documents
                          </h6>
                          <ul className="list-group list-group-flush">
                            {event.required_documents.map((doc, index) => (
                              <li
                                key={index}
                                className="list-group-item bg-transparent border-0 ps-0"
                              >
                                📄 {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
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
        </div>
      </div>
    </div>
  );
}

export default RegisterDetails;
