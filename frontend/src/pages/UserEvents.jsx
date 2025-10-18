import React, { useEffect, useState } from "react";
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

  // ✅ Get user from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // ✅ Fetch logged-in user's events
  useEffect(() => {
    if (!user) return;
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/userevents/user/${user.id}`);
        const data = await res.json();
        if (data.status === "success") {
          setEvents(data.events);
        } else {
          Swal.fire("Error", data.message || "Failed to load events", "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Server not reachable", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [user]);

  // 🔍 Search + Pagination
  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredEvents.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentEvents = filteredEvents.slice(startIdx, startIdx + rowsPerPage);

  // 🧠 Add Event
  const handleAddEvent = async (newEvent) => {
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
    }
    closeModal();
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
            {user?.name}
          </h2>
          <p className="text-muted mb-0">
            <FontAwesomeIcon icon={faEnvelope} className="me-1" /> {user?.email}
          </p>
        </div>
        <div>
          <button className="btn btn-primary me-2" onClick={openModal}>
            Add Event
          </button>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Toolbar */}
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

      {/* Table */}
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
            ) : currentEvents.length ? (
              currentEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.venue}</td>
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

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`btn btn-sm mx-1 ${currentPage === num ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setCurrentPage(num)}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Add Event Modal */}
      <Addeventmodal
        isOpen={isModalOpen}
        onClose={closeModal}
        categories={[
          { value: "Workshop", label: "Workshop" },
          { value: "Seminar", label: "Seminar" },
          { value: "Competition", label: "Competition" },
        ]}
        onSubmit={handleAddEvent}
      />
    </div>
  );
};

export default UserEvents;
