import React, { useState, useEffect, useMemo } from "react";
import EventsCard from "./EventsCard";
import "../styles/Events.css";

// Helper function to format ISO date strings into "12 Sep" style
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = { day: "numeric", month: "short" };
  return date.toLocaleDateString("en-US", options);
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");

  // Fetch events once when component mounts
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("http://localhost:5000/api/events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    }
    fetchEvents();
  }, []);

  // Get today's date as string for filtering
  const todayStr = new Date().toISOString().slice(0, 10);

  // ✅ useMemo 1: Format dates only when 'events' change
  const formattedEvents = useMemo(() => {
  
    return events.map((e) => ({
      ...e,
      dateRaw: e.date,
      date: formatDate(e.date),
    }));
  }, [events]);

  // ✅ useMemo 2: Categorize events efficiently
  const { upcoming, today, past } = useMemo(() => {
  
    const upcoming = formattedEvents.filter((e) => e.dateRaw > todayStr);
    const today = formattedEvents.filter((e) => e.dateRaw === todayStr);
    const past = formattedEvents.filter((e) => e.dateRaw < todayStr);
    return { upcoming, today, past };
  }, [formattedEvents, todayStr]);

  // ✅ Select filtered events based on chosen filter
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
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button
              className={`btn ${
                filter === "upcoming" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setFilter("upcoming")}
            >
              Upcoming
            </button>
            <button
              className={`btn ${
                filter === "today" ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => setFilter("today")}
            >
              Today
            </button>
            <button
              className={`btn ${
                filter === "past" ? "btn-secondary" : "btn-outline-secondary"
              }`}
              onClick={() => setFilter("past")}
            >
              Past
            </button>
            <button
              className={`btn ${
                filter === "all" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setFilter("all")}
            >
              Show All
            </button>
          </div>
        </div>

        {/* Event Grid */}
        <div className="row g-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div className="col-md-6 col-lg-4 d-flex" key={event.id}>
                <EventsCard event={event} />
              </div>
            ))
          ) : (
            <p className="text-center text-white">No events found.</p>
          )}
        </div>
      </div>
    </section>
  );
}
