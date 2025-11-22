import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DocumentUploadModal from "../components/DocumentUploadModal";
import { FaUpload ,FaCalendarAlt, FaMapMarkerAlt, FaUser, FaMoneyBill ,FaEnvelope } from "react-icons/fa";
import InfoBox from "../components/InfoBox";

function RegisterDetails() {
  const location = useLocation();
  const { name, email, eventId, registered_at } = location.state || {};

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/register/event/${eventId}`
        );
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
const formatEventDate = (dateString) => {
  if (!dateString) return "Not specified";

  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-GB", options);
};

  return (
    <div className="register-bg" style={{ background: "#0d0d4d" }}>
      <div className="container py-5">
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
          {/* Header */}
          <div
            className="card-header text-white text-center py-4"
            style={{
              background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
            }}
          >
            <h2 className="fw-bold mb-1">Registration Summary</h2>
            <p className="text-light mb-0 small">
              Your registration details & event overview
            </p>
          </div>

          <div className="card-body bg-light p-4">
            {/* Registration Section */}
            <div className="card border-0 shadow-sm mb-4 p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <div
                    className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      fontSize: "1.5rem",
                    }}
                  >
                    🎉
                  </div>
                  <div className="ms-3">
                    <h5 className="fw-bold mb-0 text-success">
                      Welcome, {name}!
                    </h5>
                    <small className="text-muted">
                      Your registration is confirmed
                    </small>
                  </div>
                </div>

                <button
                  className="btn btn-dark text-light px-3 py-2 d-flex align-items-center gap-2"
                  onClick={() => setShowUploadModal(true)}
                >
                  <FaUpload /> Upload Docs
                </button>
              </div>

              <hr />

              <div className="row">
                <InfoBox
                  title="Full Name"
                  value={name}
                icon={<FaUser />}
                />

                <InfoBox title="Email" value={email} icon={<FaEnvelope />} />

                <InfoBox
                  title="Registered On"
                  value={
                    registered_at
                      ? new Date(registered_at).toLocaleDateString()
                      : "Not available"
                  }
                  icon={<FaCalendarAlt />}
                />
              </div>
            </div>

            {/* Event Section */}
            {loading ? (
              <div className="text-center py-4">
                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>
              </div>
            ) : event ? (
              <div className="card border-0 shadow-sm rounded-3">
                {/* Event Image */}
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
                                      {event.title}
                  </h3>
                  <p className="text-secondary mt-3">{event.description}</p>

                  {/* Event InfoBoxes */}
                  <div className="row">
                    <InfoBox
                      title="Event Date"
                      value={formatEventDate(event.date)}
                      icon={<FaCalendarAlt />} 
                    />
                    <InfoBox
                      title="Venue"
                      value={event.venue}
                   icon={<FaMapMarkerAlt />} 
                    />
                    <InfoBox
                      title="Author"
                      value={event.author}
                     icon={<FaUser />}
                    />
                    <InfoBox
                      title="Fees"
                      value={event.fees || "Free"}
                       icon={<FaMoneyBill />}
                    />
                  </div>
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

        <DocumentUploadModal
          show={showUploadModal}
          handleClose={() => setShowUploadModal(false)}
          event={event}
          email={email}
          event_id={eventId}
          registered_at={registered_at}
        />
      </div>
    </div>
  );
}

export default RegisterDetails;
