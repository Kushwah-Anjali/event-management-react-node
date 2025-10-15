import React, { useEffect, useState } from "react";
import "../styles/UserEvents.css"; // new updated CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faCalendarDays, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Addeventmodal from "../components/Addeventmodal"; 
import Swal from "sweetalert2"; 

const UserEvents = () => {
  const [user, setUser] = useState({ name: "Loading name...", email: "Loading email..." });
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
const openModal = () => setIsModalOpen(true);
const closeModal = () => setIsModalOpen(false);
  useEffect(() => {
    // placeholder for user & events
    setUser({ name: "Jane Doe", email: "jane@example.com" });
    setEvents([
      { id: 1, title: "AI Conference", date: "2025-10-15", location: "Berlin" },
      { id: 2, title: "Web3 Meetup", date: "2025-10-16", location: "San Francisco" },
      { id: 3, title: "Freelance Hackathon", date: "2025-10-17", location: "Remote" },
      { id: 4, title: "NFT Art Workshop", date: "2025-10-18", location: "Paris" },
      { id: 5, title: "UX/UI Masterclass", date: "2025-10-19", location: "London" },
      { id: 6, title: "Quantum Computing Talk", date: "2025-10-20", location: "Tokyo" },
    ]);
  }, []);

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEvents.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentEvents = filteredEvents.slice(startIdx, startIdx + rowsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  return (
    <div className="dashboard-container">
      {/* Top Bar */}
      <div className="dashboard-topbar">
        <div className="user-info">
          <h1 className="user-name">
            <FontAwesomeIcon icon={faUser} className="me-2" /> {user.name}
          </h1>
          <p className="user-email">
            <FontAwesomeIcon icon={faEnvelope} className="me-1" /> {user.email}
          </p>
        </div>

        <div className="actions">
        <button className="btn btn-add" onClick={openModal}>Add Event</button>

          <button className="btn btn-logout">Logout</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <h3 className="section-title">
          <FontAwesomeIcon icon={faCalendarDays} className="me-2" /> Your Events
        </h3>

        <div className="toolbar-controls">
          <select
            className="rows-select"
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

          <div className="search-box">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
            <input
              type="text"
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

      {/* Events Table */}
      <div className="table-container">
        <table className="events-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {currentEvents.length ? (
              currentEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.date}</td>
                  <td>{event.location}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="no-events">
                  No events found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-wrapper">
        {pageNumbers.map((num) => (
          <button
            key={num}
            className={`page-btn ${currentPage === num ? "active" : ""}`}
            onClick={() => setCurrentPage(num)}
          >
            {num}
          </button>
        ))}
      </div>
  <Addeventmodal
  isOpen={isModalOpen}
  onClose={closeModal}
  categories={[
    { value: "Workshop", label: "Workshop" },
    { value: "Seminar", label: "Seminar" },
    { value: "Competition", label: "Competition" },
  ]}
  onSubmit={(newEvent) => {
    setEvents(prev => [...prev, { ...newEvent, id: Date.now() }]); // add new event
    closeModal(); // close modal
    Swal.fire({
      icon: "success",
      title: "Event Added!",
      text: "Your event has been added successfully.",
      confirmButtonColor: "#0d6efd",
    });
  }}
/>

    </div> 
  
  );
};

export default UserEvents;
