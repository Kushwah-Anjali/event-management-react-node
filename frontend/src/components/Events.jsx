import React, { useState, useEffect } from "react";
import EventsCard from "./EventsCard";
import "../styles/Events.css";

// Helper function to format ISO date strings into "12 Sep" style
function formatDate(dateStr) {
  const date = new Date(dateStr); // Convert string to Date object
  const options = { day: "numeric", month: "short" };
  // 'numeric' = 1,2,3... | 'short' = Jan, Feb, Mar...
  return date.toLocaleDateString("en-US", options);
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");

  // Fetch events from API when component mounts
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("http://localhost:5000/api/events");
        const data = await res.json();
        setEvents(data); // Save fetched events in state
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    }
    fetchEvents();
  }, []);

  // Get today's date as string for filtering
  const todayStr = new Date().toISOString().slice(0, 10);

  // Categorize events based on date
  const upcoming = events.filter((e) => e.date > todayStr);
  const today = events.filter((e) => e.date === todayStr);
  const past = events.filter((e) => e.date < todayStr);

  // Decide which events to show based on filter
  const filteredEvents =
    filter === "all"
      ? events
      : filter === "upcoming"
      ? upcoming
      : filter === "today"
      ? today
      : past;

  return (
    <section className="events-section py-5" id="event-section">
      <div className="container">
        {/* Filter buttons */}
        <div className="events-filter-section">
          <h2 className="filter-heading mb-4">Filter Your Events</h2>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button
              className="btn btn-outline-primary"
              onClick={() => setFilter("upcoming")}
            >
              Upcoming
            </button>
            <button
              className="btn btn-outline-success"
              onClick={() => setFilter("today")}
            >
              Today
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setFilter("past")}
            > 
              Past
            </button>
            <button
              className="btn btn-outline-dark"
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
                {/* Pass formatted date to the card */}
                <EventsCard
                  event={{
                    ...event,
                    // Replace raw ISO date with formatted date
                    date: formatDate(event.date),
                  }}
                />
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
