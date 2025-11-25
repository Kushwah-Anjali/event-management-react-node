// src/pages/EventHistory.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import InfoBox from "../components/InfoBox";

import {
  FaArrowLeft,

  FaUsers,
  FaRegClock,
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

const [history, setHistory] = useState(null);

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
  <div className="history-wrapper py-4" style={{ background: "#0d0d4d" }}>
    <div className="event-history-page container">

      {/* Top Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        {event.registerLink && (
          <a
            className="btn btn-primary fw-semibold px-4"
            href={event.registerLink}
            target="_blank"
            rel="noreferrer"
          >
            Register
          </a>
        )}
      </div>

   {/* Hero Section */}
<div className="mb-4 fade-in shadow-sm rounded-4 overflow-hidden bg-light">
  <div className="d-flex flex-column flex-md-row align-items-stretch">

    {/* Image Left */}
    <div
      className="flex-shrink-0"
      style={{
        width: "100%",
        maxWidth: "280px",
        height: "220px",
        backgroundImage: `url(${event.image || "/placeholder.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
       
      }}
    ></div>

    {/* Content Right */}
    <div className="flex-grow-1 p-3 d-flex flex-column justify-content-center">
      <h2 className="fw-bold mb-2 d-flex align-items-center gap-2">
       {event.title}
      </h2>

      <p className="text-muted mb-1 d-flex align-items-center gap-2">
        <FaRegClock /> {event.date || "Date TBD"}
      </p>

      <p className="text-muted mb-0 d-flex align-items-center gap-2">
        <FaMapMarkerAlt /> {event.venue || "Venue TBD"}
      </p>
    </div>

  </div>
</div>

      {/* Info Boxes */}
      <div className="row g-3 mb-4">
        <InfoBox title="Attendees" value={event.attendees_count ?? event.attendees ?? "0"} icon={<FaUsers style={{color:"#1e3a8a"}} />} />
        <InfoBox title="Guests" value={event.guests ?? "0"} icon={<FaIdBadge style={{color:"#1e3a8a"}} />} />
        <InfoBox title="Budget Spent" value={event.budget_spent ?? event.budget ?? "N/A"} icon={<FaMoneyBill style={{color:"#1e3a8a"}} />} />
        <InfoBox title="Entry Fee" value={event.fees ?? "Free"} icon={<FaWallet style={{color:"#1e3a8a"}} />} />
        <InfoBox title="Venue" value={event.venue ?? "N/A"} icon={<FaMapMarkerAlt style={{color:"#1e3a8a"}} />} />
        <InfoBox title="Contact" value={event.contact ?? "N/A"} icon={<FaPhone style={{color:"#1e3a8a"}} />} />
      </div>

      {/* Dynamic Sections */}
      {event.sections?.map((s, idx) => (
        <div key={idx} className="card p-4 mb-4 shadow-sm rounded-4 fade-in">
          <h5 className="fw-bold text-primary mb-2">{s.title}</h5>
          <p className="text-secondary lh-base">{s.content}</p>
        </div>
      ))}

      {/* Gallery */}
      {event.media?.length > 0 && (
        <div className="card p-4 mb-4 shadow-sm rounded-4 fade-in">
          <h5 className="fw-bold text-primary mb-3">Gallery</h5>

          <div className="row g-3">
            {event.media.map((m, i) => (
              <div className="col-sm-6 col-md-4" key={i}>
                <div className="ratio ratio-16x9 rounded overflow-hidden">
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

      {/* Footer */}
      <div className="text-end text-muted small mt-3">
        Report generated: {new Date(event.created_at ?? Date.now()).toLocaleString()}
      </div>

    </div>
  </div>
);


}
