import React, { useState, useEffect, useMemo } from "react";
import EventsCard from "./EventsCard";
import "../styles/Events.css";
import axios from "axios";
import { motion } from "framer-motion";

const Base_url = process.env.REACT_APP_API_URL;
function formatDate(dateStr) {
  if (!dateStr) return "Date TBD";
  const cleanDate = dateStr.split("T")[0];
  const [year, month, day] = cleanDate.split("-");
  // in js month start from 0
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}
const isMobile = window.innerWidth <= 768;
export default function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get(`${Base_url}/api/events`);
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    }
    fetchEvents();
  }, []);
  const todayStr = new Date().toISOString().slice(0, 10);

  const formattedEvents = useMemo(() => {
    return events.map((e) => ({
      ...e,
      dateRaw: e.date, // "2025-09-16"
      date: formatDate(e.date), // "16 Sep"
      isPastEvent: e.date < todayStr,
    }));
  }, [events, todayStr]);

  const { upcoming, today, past } = useMemo(() => {
    const upcoming = formattedEvents.filter((e) => e.dateRaw > todayStr);
    const today = formattedEvents.filter((e) => e.dateRaw === todayStr);
    const past = formattedEvents.filter((e) => e.dateRaw < todayStr);
    return { upcoming, today, past };
  }, [formattedEvents, todayStr]);

  const filteredEvents = useMemo(() => {
    switch (filter) {
      case "upcoming":
        return upcoming;
      case "today":
        return today;
      case "past":
        return past;
      default:
        return formattedEvents;
    }
  }, [filter, upcoming, today, past, formattedEvents]);

  return (
    <section className="events-section py-5" id="event-section">
      <div className="container">
        {/* Filter Buttons */}
        <div className="events-filter-section">
          <h2 className="filter-heading mb-4">Filter Your Events</h2>

          {/* Mobile Dropdown */}
          <div className="filter-dropdown d-md-none mb-4">
            <select
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="upcoming">Upcoming</option>
              <option value="today">Today</option>
              <option value="past">Past</option>
              <option value="all">Show All</option>
            </select>
          </div>

          <div className="d-none d-md-flex justify-content-center gap-3 flex-wrap">
            {["upcoming", "today", "past", "all"].map((item) => (
              <button
                key={item}
                className={`filter-btn ${filter === item ? "active" : ""}`}
                onClick={() => setFilter(item)}
              >
                {item === "all"
                  ? "Show All"
                  : item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>

    


<div className="row g-4">
  {filteredEvents.length > 0 ? (
    filteredEvents.map((event, index) => (
      <motion.div
        key={event.id}
        className="col-md-6 col-lg-4 d-flex"
        initial={{ opacity: 0, y: isMobile ? 30 : 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: isMobile ? 0.9 : 1.2,  // faster on mobile
          delay: index * (isMobile ? 0.1 : 0.2), // stagger adjusted
          ease: "easeOut",
        }}
      >
        <EventsCard event={event} />
      </motion.div>
    ))
  ) : (
    <p className="text-center text-white">No events found.</p>
  )}
</div>
      </div>
    </section>
  );
}
