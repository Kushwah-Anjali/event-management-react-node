// src/pages/EventHistory.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InfoBox from "../components/InfoBox";
import MediaHistory from "../components/MediaHistory";
import { fetchEventHistory } from "../services/eventHistoryService";

import {
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

  useEffect(() => {
    const load = async () => {
      if (!eventId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchEventHistory(eventId);
        if (!data) throw new Error("No data returned");
        setEvent(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch event history");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [eventId]);

  // Fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.15 }
    );

    const fadeEls = document.querySelectorAll(".fade-in");
    fadeEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [event]);

  const formatEventDate = (dateString) => {
    if (!dateString) return "Not specified";
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  if (loading)
    return <div className="container my-5 text-center">Loading event...</div>;

  if (error)
    return (
      <div className="container my-5 text-center text-danger">
        Error: {error}
      </div>
    );

  if (!event)
    return (
      <div className="container my-5 text-center">
        <h3>No Event Data Found</h3>
        <button
          className="btn btn-outline-secondary mt-3"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );

  // Generate sections from backend data
  const sections = [
    event.summary && { title: "Summary", content: event.summary },
    event.long_summary && { title: "Long Summary", content: event.long_summary },
    event.highlights && { title: "Highlights", content: event.highlights },
    event.lessons && { title: "Lessons Learned", content: event.lessons },
  ].filter(Boolean);

  // Combine photos and videos for MediaHistory component
  const media = [...(event.photos || []), ...(event.videos || [])];

  return (
    <div className="history-wrapper py-4" style={{ background: "#0d0d4d" }}>
      <div className="event-history-page container-lg px-3 px-md-4">
        {/* Event Header */}
        <div className="mb-4 shadow-sm rounded-2 overflow-hidden bg-light">
          <div className="row g-0 align-items-stretch">
            <div className="col-12 col-md-4">
              <div
                className="w-100 h-100"
                style={{
                  minHeight: "180px",
                  backgroundImage: `url(${event.image || "/placeholder.jpg"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>
            <div className="col-12 col-md-8 p-3 p-md-4 d-flex flex-column justify-content-center">
              <h2 className="fw-bold mb-2 text-center text-md-start">
                {event.title}
              </h2>
              <p className="text-muted mb-1 d-flex justify-content-center justify-content-md-start align-items-center gap-2">
                <FaRegClock /> {formatEventDate(event.date)}
              </p>
            </div>
          </div>
        </div>

        {/* Info Boxes */}
        <div className="row g-3 mb-4">
          <InfoBox title="Attendees" value={event.attendees_count} icon={<FaUsers />} />
          <InfoBox title="Guests" value={event.guests} icon={<FaIdBadge />} />
          <InfoBox title="Budget Spent" value={event.budget_spent} icon={<FaMoneyBill />} />
          <InfoBox title="Entry Fee" value={event.fees} icon={<FaWallet />} />
          <InfoBox title="Venue" value={event.venue} icon={<FaMapMarkerAlt />} />
          <InfoBox title="Contact" value={event.contact} icon={<FaPhone />} />
        </div>

        {/* Sections */}
        {sections.map((s, idx) => (
          <div key={idx} className="card p-3 p-md-4 mb-3 shadow-sm">
            <h5 className="fw-bold mb-2">{s.title}</h5>
            <p className="text-secondary lh-lg mb-0">{s.content}</p>
          </div>
        ))}

        {/* Media Gallery */}
        {media.length > 0 && (
          <div className="card p-4 mb-4 shadow-sm fade-in">
            <h5 className="fw-bold mb-3">Gallery</h5>
            <MediaHistory media={media} thumbnailWidth={200} />
          </div>
        )}

        <div className="text-end text-muted small mt-3">
          Report generated: {new Date(event.created_at ?? Date.now()).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
