import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DocumentUploadModal from "../components/DocumentUploadModal";
import {
  FaUpload,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaMoneyBill,
  FaEnvelope,
} from "react-icons/fa";
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
        {/* WRAPPER CARD */}
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
          {/* HEADER */}
          <div
            className="card-header text-white text-center py-4"
            style={{
              background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
            }}
          >
            <h2 className="fw-bold mb-1">Registration Summary</h2>
            <p className="text-light mb-0 small">
              Review your registration and event details
            </p>
          </div>

          {/* BODY */}
          <div className="card-body bg-light p-4">
            {/* REGISTRATION CARD */}
            <div className="card border-0 shadow-sm mb-4 p-4 rounded-4">
              <div className="d-flex justify-content-between flex-wrap align-items-center mb-3">
                {/* LEFT */}
                <div className="d-flex align-items-center gap-3">
                  <div
                    className=" text-white rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "55px",
                      height: "55px",
                      fontSize: "1.6rem",
                      background: "rgb(233 206 27 / 73%)",
                    }}
                  >
                    🎉
                  </div>

                  <div>
                    <h5 className="fw-bold mb-0" style={{ color: "#194abf" }}>
                      Welcome, {name}!
                    </h5>
                    <small className="text-muted">
                      Your registration is confirmed
                    </small>
                  </div>
                </div>

                {/* RIGHT BUTTON */}
                <button
                  className="btn btn-dark text-light px-3 py-2 d-flex align-items-center gap-2 mt-3 mt-md-0"
                  onClick={() => setShowUploadModal(true)}
                >
                  <FaUpload /> Upload Documents
                </button>
              </div>

              <hr />

              <div className="row gy-3">
                <InfoBox title="Full Name " value={name} icon={<FaUser   style={{ color: "#174bdaff" }}/>} />
                <InfoBox title="Email" value={email} icon={<FaEnvelope   style={{ color: "#174bdaff" }}/>} />

                <InfoBox
                  title="Registered On"
                  value={
                    registered_at
                      ? new Date(registered_at).toLocaleDateString()
                      : "Not available"
                  }
                  icon={<FaCalendarAlt   style={{ color: "#174bdaff" }}/>}
                />
              </div>
            </div>

            {/* EVENT DETAILS */}
            {loading ? (
              <div className="text-center py-4">
                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>
              </div>
            ) : event ? (
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="row g-0">
                  {/* LEFT IMAGE */}
                  <div className="col-md-4">
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="img-fluid w-100"
                        style={{
                          height: "100%",
                          maxHeight: "250px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>

                  {/* RIGHT CONTENT */}
                  <div className="col-md-8 d-flex align-items-center">
                    <div className="p-4 w-100">
                      {/* TITLE */}
                      <h4 className="fw-bold  mb-2" >
                        {event.title}
                      </h4>

                      {/* DESCRIPTION */}
                      <p
                        className="text-secondary lh-base mb-3"
                        style={{ fontSize: "0.95rem" }}
                      >
                        {event.description}
                      </p>

                      <hr className="my-3" />

                      {/* DETAILS GRID */}
                      <div className="row gy-3">
                        <div className="col-6 d-flex align-items-center gap-3">
                          <FaCalendarAlt />
                          <div>
                            <div className="text-muted small">Event Date</div>
                            <div className="fw-semibold">
                              {formatEventDate(event.date)}
                            </div>
                          </div>
                        </div>

                        <div className="col-6 d-flex align-items-center gap-3">
                          <FaMapMarkerAlt />
                          <div>
                            <div className="text-muted small">Location</div>
                            <div className="fw-semibold">{event.venue}</div>
                          </div>
                        </div>

                        <div className="col-6 d-flex align-items-center gap-3">
                          <FaUser />
                          <div>
                            <div className="text-muted small">Hosted By</div>
                            <div className="fw-semibold">{event.author}</div>
                          </div>
                        </div>

                        <div className="col-6 d-flex align-items-center gap-3">
                          <FaMoneyBill />
                          <div>
                            <div className="text-muted small">Entry Fee</div>
                            <div className="fw-semibold">
                              {event.fees || "Free"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-warning text-center mt-4">
                Event details not found.
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="card-footer text-center bg-white py-3">
            <small className="text-muted">
              © {new Date().getFullYear()} Eventify
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
