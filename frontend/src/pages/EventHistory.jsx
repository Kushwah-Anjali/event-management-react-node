// src/pages/EventHistory.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import InfoBox from "../components/InfoBox";
import HistoryModal from "../components/HistoryModal";
import {
  FaArrowLeft,
  FaClock,
  FaUsers,
  FaIdBadge,
  FaMoneyBill,
  FaWallet,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";

import "../styles/History.css";

export default function EventHistory() {
  const location = useLocation();
  const navigate = useNavigate();

  const { eventId } = location.state || {};
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(Boolean(eventId));
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // Handle History Submit
  const handleHistorySubmit = async (formData, eventId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/history/${eventId}`, {
        method: "POST",
        body: formData,
      });

      const payload = await res.json();

      if (!res.ok || payload.status === "error") {
        throw new Error(payload.message || "Failed to save history");
      }

      alert("History saved successfully!");
      window.location.reload(); // force refresh after upload
    } catch (err) {
      alert("Error: " + err.message);
      console.error(err);
    }

    setShowModal(false);
  };

  // Fetch Event + History
  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        // 1️⃣ Fetch event
        const eventRes = await fetch(`http://localhost:5000/api/register/event/${eventId}`);
        const eventPayload = await eventRes.json();

        if (!eventRes.ok || eventPayload.status === "error") {
          throw new Error(eventPayload.message || "Failed to fetch event");
        }

        let evt = eventPayload.event || eventPayload;

        // Event sections
        const sections = [];
        if (evt.summary) sections.push({ title: "Summary", type: "text", content: evt.summary });
        if (evt.long_summary) sections.push({ title: "Long Summary", type: "text", content: evt.long_summary });
        if (evt.highlights) sections.push({ title: "Highlights", type: "text", content: evt.highlights });
        if (evt.lessons) sections.push({ title: "Lessons Learned", type: "text", content: evt.lessons });



        // Event Media Fix
        let media = [];
        try {
          if (evt.media_links) {
            media = JSON.parse(evt.media_links) || [];
            media = media.map((m) => ({
              ...m,
              src: `http://localhost:5000/events/${m.url}`,
            }));
          }
        } catch {
          media = [];
        }

        evt = { ...evt, sections,media };

        // 2️⃣ Fetch History
        const historyRes = await fetch(`http://localhost:5000/api/history/${eventId}`);
        const historyPayload = await historyRes.json();

        if (historyPayload.exists) {
     const h = Array.isArray(historyPayload.history)
       ? historyPayload.history[0]
    : historyPayload.history; 

          // Sections
          if (h.summary) evt.sections.push({ title: "History Summary", type: "text", content: h.summary });
          if (h.long_summary) evt.sections.push({ title: "History Long Summary", type: "text", content: h.long_summary });
          if (h.highlights) evt.sections.push({ title: "Event Highlights", type: "text", content: h.highlights });
          if (h.lessons_learned) evt.sections.push({ title: "Lessons Learned", type: "text", content: h.lessons_learned });

          // Metadata merge
          evt.attendees_count = h.attendees_count ?? evt.attendees_count ?? evt.attendees ?? 0;
          evt.guests = h.guests ?? evt.guests ?? 0;
          evt.budget_spent = h.budget_spent ?? evt.budget_spent ?? evt.budget ?? "N/A";

          // History Media
          if (Array.isArray(h.media)) {
            const historyMedia = h.media.map((m) => ({
              ...m,
              src: `http://localhost:5000/history/${m.url}`,
            }));
            evt.media = [...evt.media, ...historyMedia];
          }
        }

        setEvent(evt);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    })();
  }, [eventId]);

  // Fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible"));
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [event]);

  // Basic load states
  if (loading) return <div className="container my-5 text-center">Loading event...</div>;
  if (error) return <div className="container my-5 text-center text-danger">Error: {error}</div>;
  if (!event)
    return (
      <div className="container my-5 text-center">
        <h3>No Event Data Found</h3>
        <button className="btn btn-outline-secondary mt-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );

return (
  <div className="history-wrapper py-4">  <div className="event-history-page container">

    {/* Back + Register */}
    <div className="d-flex justify-content-between align-items-center mb-4">
      <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
       <FaArrowLeft className="me-1" />
 Back
      </button>

      {event.registerLink && (
        <a className="btn btn-primary" href={event.registerLink} target="_blank" rel="noreferrer">
          Register
        </a>
      )}
    </div>

    {/* Hero */}
    <div className="mb-4 fade-in">
      {event.image ? (
        <div
          className="eh-hero shadow"
          style={{ backgroundImage: `url(${event.image})` }}
        >
          <div className="h-100 w-100 d-flex flex-column justify-content-end p-3"
               style={{ background: "linear-gradient(to top, rgba(0,0,0,.6), transparent)" }}>
            <h1 className="text-white fw-bold mb-1">{event.title}</h1>
            <p className="text-light small mb-0">
              {event.date || "Date TBD"} • {event.venue || "Venue TBD"}
            </p>
          </div>
        </div>
      ) : (
        <div className="card p-4 shadow-sm">
          <h1 className="fw-bold">{event.title}</h1>
          <p className="text-muted">
            {event.date || "Date TBD"} • {event.venue || "Venue TBD"}
          </p>
        </div>
      )}
    </div>

    {/* Add History Button */}
    <div className="text-end mb-4">
      <button className="btn btn-custom-dark bg-black text-light" onClick={() => setShowModal(true)}>
       <FaClock className="me-1" />Add Event History
      </button>
    </div>

    {/* Info Boxes */}
    <div className="row g-3 mb-4">
      <InfoBox title="Attendees" value={event.attendees_count ?? event.attendees ?? "0"}   icon={<FaUsers />} />
      <InfoBox title="Guests" value={event.guests ?? "0"} icon={<FaIdBadge />} />
      <InfoBox title="Budget Spent" value={event.budget_spent ?? event.budget ?? "N/A"}   icon={<FaMoneyBill />} />
      <InfoBox title="Fees" value={event.fees ?? "Free"}   icon={<FaWallet />} />
      <InfoBox title="Venue" value={event.venue ?? "N/A"}    icon={<FaMapMarkerAlt />} />
      <InfoBox title="Contact" value={event.contact ?? "N/A"}  icon={<FaPhone />} />
    </div>
    {/* Dynamic Sections */}
    {event.sections?.map((s, idx) => (
      <div key={idx} className="card p-3 mb-4 shadow-sm fade-in">
        <h5 className="fw-bold mb-2">{s.title}</h5>
        <p className="mb-0">{s.content}</p>
      </div>
    ))}

    {/* Gallery */}
    {event.media?.length > 0 && (
      <div className="card p-3 shadow-sm mb-4 fade-in">
        <h5 className="fw-bold mb-3">Gallery</h5>
        <div className="row g-3">
          {event.media.map((m, i) => (
            <div className="col-sm-6 col-md-4" key={i}>
              <div className="ratio ratio-16x9 rounded">
                {m.type?.includes("video") ? (
                  <video src={m.src} controls className="rounded w-100 h-100" />
                ) : (
                  <img src={m.src} alt="" className="img-fluid w-100 h-100 rounded" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="text-end text-muted small">
      Report generated: {new Date(event.created_at ?? Date.now()).toLocaleString()}
    </div>

    {/* Modal */}
    <HistoryModal
      show={showModal}
      onHide={() => setShowModal(false)}
      eventData={event}
      onSubmit={handleHistorySubmit}
    />
  </div></div>
);

}
