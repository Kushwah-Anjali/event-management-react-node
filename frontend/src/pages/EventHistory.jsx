// src/pages/EventHistory.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import InfoBox from "../components/InfoBox";
import HistoryModal from "../components/HistoryModal";
import "../styles/History.css";

export default function EventHistory() {
  const location = useLocation();
  const navigate = useNavigate();

  const { eventId } = location.state || {};

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(Boolean(eventId));
  const [error, setError] = useState(null);

  // Modal State
const [showModal, setShowModal] = useState(false);


  // Submit handler for modal
  const handleHistorySubmit = async (formData, eventId) => {
    console.log("Submitting history:", formData, "For Event:", eventId);

    try {
      const res = await fetch(`http://localhost:5000/api/events/history/${eventId}`, {
        method: "POST",
        body: formData,
      });

      const payload = await res.json();

      if (!res.ok || payload.status === "error") {
        throw new Error(payload.message || "Failed to save history");
      }

      alert("History saved successfully!");

   
    } catch (err) {
      alert("Error: " + err.message);
      console.error(err);
    }

    setShowHistoryModal(false);
  };

useEffect(() => {
  if (!eventId) {
    setLoading(false);
    return;
  }

  (async () => {
    try {
      // 1️⃣ Fetch EVENT ITSELF
      const eventRes = await fetch(`http://localhost:5000/api/register/event/${eventId}`);
      const eventPayload = await eventRes.json();

      if (!eventRes.ok || eventPayload.status === "error") {
        throw new Error(eventPayload.message || "Failed to fetch event");
      }

      let evt = eventPayload.event || eventPayload;

      // Convert event docs + media
      const sections = [];
      if (evt.summary) sections.push({ title: "Summary", type: "text", content: evt.summary });
      if (evt.long_summary) sections.push({ title: "Long Summary", type: "text", content: evt.long_summary });
      if (evt.highlights) sections.push({ title: "Highlights", type: "text", content: evt.highlights });
      if (evt.lessons) sections.push({ title: "Lessons Learned", type: "text", content: evt.lessons });

      const documents = Array.isArray(evt.required_documents) ? evt.required_documents : [];

      let media = [];
      try {
        if (evt.media_links) {
          media = JSON.parse(evt.media_links);
          media = Array.isArray(media) ? media : [];
        }
      } catch (e) {
        media = [];
      }

      evt = { ...evt, sections, documents, media };

      // 2️⃣ Fetch HISTORY
      const historyRes = await fetch(`http://localhost:5000/api/history/${eventId}`);
      const historyPayload = await historyRes.json();

      if (historyPayload.exists) {
        const h = historyPayload.history;

        // Add history into event sections
        if (h.summary) evt.sections.push({ title: "History Summary", type: "text", content: h.summary });
        if (h.long_summary) evt.sections.push({ title: "History Long Summary", type: "text", content: h.long_summary });
        if (h.highlights) evt.sections.push({ title: "Event Highlights", type: "text", content: h.highlights });
        if (h.lessons_learned) evt.sections.push({ title: "Lessons Learned", type: "text", content: h.lessons_learned });

        // Merge event media + history media (with static path)
        if (Array.isArray(h.media)) {
          const historyMedia = h.media.map((m) => ({
            ...m,
            src: `http://localhost:5000/history/${m.url}`,
          }));
          evt.media = [...evt.media, ...historyMedia];
        }
      }

      // Update state
      setEvent(evt);
      setLoading(false);

    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setLoading(false);
    }
  })();
}, [eventId]);


  // Fade-in observer
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

  // Loading / Error Handling
  if (loading)
    return <div className="container my-5 text-center">Loading event...</div>;

  if (error)
    return <div className="container my-5 text-center text-danger">Error: {error}</div>;

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
    <div className="container my-4">

      {/* Back Button + CTA */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i> Back
        </button>

        {event.registerLink && (
          <a className="btn btn-gradient" href={event.registerLink} target="_blank" rel="noreferrer">
            Register
          </a>
        )}
      </div>

      {/* HERO */}
      <div className="card overflow-hidden mb-4 hero-card fade-in">
        {event.image ? (
          <div className="hero-media" style={{ backgroundImage: `url(${event.image})` }}>
            <div className="hero-overlay d-flex flex-column justify-content-end p-4">
              <div className="d-flex justify-content-between align-items-end">
                <div>
                  <h1 className="hero-title mb-1">{event.title}</h1>
                  <div className="text-light small">{event.date || "Date TBD"} • {event.venue || "Venue TBD"}</div>
                </div>

                {event.category && <span className="badge bg-gradient">{event.category}</span>}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <h1 className="hero-title">{event.title}</h1>
            <div className="text-muted">{event.date || "Date TBD"} • {event.venue || "Venue TBD"}</div>
          </div>
        )}
      </div>

      {/* 🔥 ADD HISTORY BUTTON (NEW) */}
      <div className="text-end mb-3">
        <button
          className="btn btn-primary"
          onClick={() => setShowHistoryModal(true)}
        >
          <i className="bi bi-clock-history me-2"></i>
          Add Event History
        </button>
      </div>

      {/* Metadata Grid */}
      <div className="row mb-4">
        <InfoBox title="Attendees" value={event.attendees ?? event.attendees_count ?? "0"} icon="bi bi-people-fill" />
        <InfoBox title="Guests" value={event.guests ?? "0"} icon="bi bi-person-badge-fill" />
        <InfoBox title="Budget Spent" value={event.budget ?? event.budget_spent ?? "N/A"} icon="bi bi-cash-stack" />
        <InfoBox title="Fees" value={event.fees ?? "Free"} icon="bi bi-wallet2" />
        <InfoBox title="Venue" value={event.venue ?? "N/A"} icon="bi bi-geo-alt-fill" />
        <InfoBox title="Contact" value={event.contact ?? "N/A"} icon="bi bi-telephone-fill" />
      </div>

      {/* Documents */}
      {event.documents?.length > 0 && (
        <div className="card p-3 mb-4 fade-in">
          <h5 className="mb-3">Documents</h5>
          <div className="row">
            {event.documents.map((doc, i) => (
              <div className="col-md-4 mb-2" key={i}>
                <a href={doc.url ?? doc} target="_blank" rel="noreferrer" className="text-decoration-none">
                  <div className="p-3 info-doc h-100 d-flex align-items-center">
                    <i className="bi bi-file-earmark-text fs-3 me-2"></i>
                    <div>
                      <div className="fw-semibold">{doc.name ?? `Document ${i + 1}`}</div>
                      <div className="small text-muted">{doc.type ?? ""}</div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {event.description && (
        <div className="card p-3 mb-4 fade-in">
          <h5 className="mb-2">Description</h5>
          <p className="mb-0">{event.description}</p>
        </div>
      )}

      {/* Dynamic Sections */}
      {event.sections?.map((s, idx) => (
        <div key={idx} className="card p-3 mb-4 fade-in">
          <h5 className="mb-2">{s.title}</h5>
          <p className="mb-0">{s.content}</p>
        </div>
      ))}

      {/* Gallery */}
      {event.media?.length > 0 && (
        <div className="card p-3 mb-4 fade-in">
          <h5 className="mb-3">Gallery</h5>
          <div className="row g-2">
            {event.media.map((m, i) => (
              <div className="col-sm-6 col-md-4" key={i}>
                <div className="ratio ratio-16x9">
                  {m.type?.includes("video") ? (
                    <video src={m.src} controls className="w-100 h-100 rounded" />
                  ) : (
                    <img src={m.src} alt={`media-${i}`} className="w-100 h-100 object-cover rounded" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="d-flex gap-3 justify-content-end">
        <div className="small text-muted">
          Report generated: {new Date(event.created_at ?? Date.now()).toLocaleString()}
        </div>
      </div>

      {/* 🔥 HISTORY MODAL INSTANCE */}
   <HistoryModal
   show={showModal}
   onHide={() => setShowModal(false)}
   eventData={event}
 
   onSubmit={handleHistorySubmit}
/>

    </div>
  );
}
