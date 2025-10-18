import React, { useEffect, useState } from "react";
import "../styles/UserEvents.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faCalendarDays,
  faMagnifyingGlass,
  faTrash,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import Addeventmodal from "../components/Addeventmodal";
import Swal from "sweetalert2";
import axios from "axios";

const UserEvents = () => {
  const [user, setUser] = useState({ id: 1, name: "Jane Doe", email: "jane@example.com" }); // temporary static user
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ---------- Modal Controls ----------
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // ---------- Fetch Events ----------
  useEffect(() => {
    fetchUserEvents();
  }, []);

  const fetchUserEvents = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/events/user/${user.id}`);
      setEvents(res.data.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      Swal.fire("Error", "Failed to load your events!", "error");
    }
  };

  // ---------- Add Event ----------
  const handleAddEvent = async (newEvent) => {
    try {
      // build FormData to handle file uploads (image/documents)
      const formData = new FormData();
      formData.append("title", newEvent.title);
      formData.append("category", newEvent.category?.value || "");
      formData.append("description", newEvent.description);
      formData.append("date", newEvent.date);
      formData.append("author", newEvent.author);
      formData.append("venue", newEvent.venue);
      formData.append("fees", newEvent.fees);
      formData.append("contact", newEvent.contact);
      formData.append("user_id", user.id);
      if (newEvent.image) formData.append("image", newEvent.image);
      formData.append("required_docs", JSON.stringify(newEvent.required_docs));

      await axios.post("http://localhost:5000/api/events/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Success!", "Your event has been added.", "success");
      closeModal();
      fetchUserEvents(); // refresh table
    } catch (err) {
      console.error("Error adding event:", err);
      Swal.fire("Error", "Failed to add event.", "error");
    }
  };

  // ---------- Delete Event ----------
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the event!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${id}`);
        Swal.fire("Deleted!", "Event removed successfully.", "success");
        fetchUserEvents();
      } catch (err) {
        console.error("Error deleting:", err);
        Swal.fire("Error", "Could not delete event.", "error");
      }
    }
  };

  // ---------- Pagination ----------
  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredEvents.length / rowsPerPage);
  const currentEvents = filteredEvents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="dashboard-container container py-4">
      {/* Top Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">
            <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
            {user.name}
          </h2>
          <small className="text-muted">
            <FontAwesomeIcon icon={faEnvelope} className="me-1" /> {user.email}
          </small>
        </div>
        <div>
          <button className="btn btn-primary me-2" onClick={openModal}>
            <FontAwesomeIcon icon={faPlusCircle} /> Add Event
          </button>
          <button className="btn btn-outline-danger">Logout</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-semibold mb-0">
          <FontAwesomeIcon icon={faCalendarDays} className="me-2" />
          Your Events
        </h5>
        <div className="d-flex align-items-center">
          <select
            className="form-select me-2"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            style={{ width: "100px" }}
          >
            <option value={5}>5 rows</option>
            <option value={10}>10 rows</option>
            <option value={20}>20 rows</option>
          </select>
          <div className="input-group" style={{ width: "250px" }}>
            <span className="input-group-text bg-light">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle">
          <thead className="table-primary text-center">
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Organizer</th>
              <th>Venue</th>
              <th>Fees</th>
              <th>Contact</th>
              <th>Required Docs</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {currentEvents.length > 0 ? (
              currentEvents.map((e) => (
                <tr key={e.id}>
                  <td>{e.title}</td>
                  <td>{e.category}</td>
                  <td>{new Date(e.date).toLocaleDateString()}</td>
                  <td>{e.author}</td>
                  <td>{e.venue}</td>
                  <td>₹{e.fees}</td>
                  <td>{e.contact}</td>
                  <td>{Array.isArray(e.required_docs) ? e.required_docs.join(", ") : e.required_docs}</td>
                  <td>
                    {e.image ? (
                      <img
                        src={`http://localhost:5000/uploads/events/${e.image}`}
                        alt={e.title}
                        width="60"
                        className="rounded"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(e.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-muted py-4">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`btn btn-sm mx-1 ${currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
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
