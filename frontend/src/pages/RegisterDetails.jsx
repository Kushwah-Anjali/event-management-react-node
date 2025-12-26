import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentUploadModal from "../components/DocumentUploadModal";
import {
  FaUpload,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaMoneyBill,
  FaEnvelope,
  FaArrowLeft,
} from "react-icons/fa";
import InfoBox from "../components/InfoBox";
import { fetchEvent } from "../services/fetchEventService";
function RegisterDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, email, eventId, registered_at } = location.state || {};

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
  const load = async () => {
    setLoading(true);
    const data = await fetchEvent(eventId);

    console.log(data); 

    setEvent(data);
    setLoading(false);
  };

  if (eventId) load();
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
          {/* BODY */}
          <div className="card-body bg-light p-4">
            {/* REGISTRATION CARD */}
            <div
              className="d-flex justify-content-between align-items-center dash-head section-header"
              onClick={() => setOpen((prev) => !prev)}
            >
              <h3 className="text-white d-flex align-items-center gap-2 mb-0 section-title">
                <FaUser />
                Registeration Summary
              </h3>

              <button
                className="btn btn-outline-light icon-btn d-flex align-items-center justify-content-center rounded-3 fw-semibold"
                style={{ width: "42px", height: "42px" }}
                onClick={(e) => {
                  e.stopPropagation(); // IMPORTANT
                  navigate(-1);
                }}
              >
                <FaArrowLeft size={18} />
              </button>
            </div>
            <div
              className={`info-section border rounded-4 mb-4 p-3 p-md-4 bg-white ${
                open ? "show" : ""
              }`}
            >
              <div className="row gy-3">
                <InfoBox title="Full Name " value={name} icon={<FaUser />} />
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

            {/* EVENT DETAILS */}
            {loading ? (
              <div className="text-center py-4">
                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>
              </div>
            ) : event ? (
              <div className="card shadow-lg border-0 bg-white rounded-4 overflow-hidden">
                <div className="row g-0 flex-column flex-md-row">
                  {/* IMAGE */}
                  <div className="col-md-4">
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="img-fluid w-100"
                        style={{
                          height: "100%",
                          minHeight: "180px",
                          maxHeight: "250px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="col-md-8 d-flex align-items-stretch">
                    <div className="p-3 p-md-4 w-100 d-flex flex-column justify-content-between">
                      {/* TOP CONTENT */}
                      <div>
                        <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                          <div>
                            <h4 className="fw-bold mb-2">{event.title}</h4>

                            <p
                              className="text-secondary lh-base mb-3"
                              style={{ fontSize: "0.95rem" }}
                            >
                              {event.description}
                            </p>
                          </div>

                          {/* BUTTON */}
                          <div className="text-md-end">
                            <button
                              className="btn btn-dark text-light px-3 py-2 d-inline-flex align-items-center gap-2"
                              onClick={() => setShowUploadModal(true)}
                            >
                              <FaUpload /> Upload Docs
                            </button>
                          </div>
                        </div>

                        <hr className="my-3" />

                        {/* DETAILS */}
                        <div className="row gy-3">
                          <div className="col-12 col-sm-6 d-flex align-items-center gap-3">
                            <FaCalendarAlt />
                            <div>
                              <div className="text-muted small">Event Date</div>
                              <div className="fw-semibold">
                                {formatEventDate(event.date)}
                              </div>
                            </div>
                          </div>

                          <div className="col-12 col-sm-6 d-flex align-items-center gap-3">
                            <FaMapMarkerAlt />
                            <div>
                              <div className="text-muted small">Location</div>
                              <div className="fw-semibold">{event.venue}</div>
                            </div>
                          </div>

                          <div className="col-12 col-sm-6 d-flex align-items-center gap-3">
                            <FaUser />
                            <div>
                              <div className="text-muted small">Hosted By</div>
                              <div className="fw-semibold">{event.author}</div>
                            </div>
                          </div>

                          <div className="col-12 col-sm-6 d-flex align-items-center gap-3">
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

        {showUploadModal && (
          <DocumentUploadModal
            show={showUploadModal}
            handleClose={() => setShowUploadModal(false)}
            email={email}
            event_id={eventId}
            requiredDocs={event ? event.required_documents : []}
          />
        )}
      </div>
    </div>
  );
}

export default RegisterDetails;
