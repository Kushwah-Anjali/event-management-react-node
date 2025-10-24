import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faCalendarDays,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Addeventmodal from "../components/Addeventmodal";
import Swal from "sweetalert2";

const UserEvents = () => {
  const navigate = useNavigate();

  // ✅ State Initialization
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Load user from localStorage once
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Error parsing user:", err);
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Fetch user events (Memoized)
  const fetchEvents = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/userevents/user/${user.id}`
      );
      const data = await res.json();

      if (data.status === "success" && Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        Swal.fire("Error", data.message || "Failed to load events", "error");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      Swal.fire("Error", "Server not reachable", "error");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ✅ Fetch events after user loads
  useEffect(() => {
    if (user?.id) {
      fetchEvents();
    }
  }, [user, fetchEvents]);

  // ✅ Add Event
  const handleAddEvent = async (newEvent) => {
    if (!user?.id) {
      Swal.fire("Error", "User not found. Please log in again.", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/userevents/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newEvent, user_id: user.id }),
      });

      const data = await res.json();

      if (data.status === "success") {
        setEvents((prev) => [...prev, data.event]);
        Swal.fire("Success", "Event added successfully!", "success");
      } else {
        Swal.fire("Error", data.message || "Failed to add event", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to connect to backend", "error");
    } finally {
      setIsModalOpen(false);
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ Search & Pagination Logic
  const filteredEvents = events.filter((e) =>
    e.title?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEvents.length / rowsPerPage) || 1;
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentEvents = filteredEvents.slice(startIdx, startIdx + rowsPerPage);

  return (
    <div className="container py-4">
      {/* 🔹 Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
            {user?.name || "Loading..."}
          </h2>
          <p className="text-muted mb-0">
            <FontAwesomeIcon icon={faEnvelope} className="me-1" />{" "}
            {user?.email || ""}
          </p>
        </div>

        <div>
          <button className="btn btn-primary me-2" onClick={() => setIsModalOpen(true)}>
            Add Event
          </button>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* 🔹 Toolbar */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-semibold">
          <FontAwesomeIcon icon={faCalendarDays} className="me-2 text-primary" />
          Your Events
        </h4>

        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select w-auto"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5 rows</option>
            <option value={10}>10 rows</option>
            <option value={20}>20 rows</option>
          </select>

          <div className="input-group">
            <span className="input-group-text bg-white">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search events..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* 🔹 Events Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  Loading events...
                </td>
              </tr>
            ) : currentEvents.length > 0 ? (
              currentEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>
                    {event.date
                      ? new Date(event.date).toLocaleDateString()
                      : "No Date"}
                  </td>
                  <td>{event.venue || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  No events found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Pagination */}
      <div className="d-flex justify-content-center mt-3">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`btn btn-sm mx-1 ${
              currentPage === num ? "btn-primary" : "btn-outline-secondary"
            }`}
            onClick={() => setCurrentPage(num)}
          >
            {num}
          </button>
        ))}
      </div>

      {/* 🔹 Add Event Modal */}
      {isModalOpen && (
        <Addeventmodal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          categories={[
            { value: "Workshop", label: "Workshop" },
            { value: "Seminar", label: "Seminar" },
            { value: "Competition", label: "Competition" },
          ]}
          onSubmit={handleAddEvent}
        />
      )}
    </div>
  );
};

export default UserEvents;
