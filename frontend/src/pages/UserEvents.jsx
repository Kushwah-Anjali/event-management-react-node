import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faCalendarDays,
  faMagnifyingGlass,
  faPlus,
  faRightFromBracket,
  faTrash,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

import Addeventmodal from "../components/Addeventmodal";
import Swal from "sweetalert2";
const API_BASE = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace(/\/api$/, "")
  : "http://localhost:5000";

const UserEvents = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    user: null,
    events: [],
    search: "",
    rowsPerPage: 5,
    currentPage: 1,
    isModalOpen: false,
    loading: false,
    editEvent: null,
  });

  const {
    user,
    events,
    search,
    rowsPerPage,
    currentPage,
    isModalOpen,
    loading,
  } = state;

  // --- Auth Check ---
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser)
      setState((prev) => ({ ...prev, user: JSON.parse(storedUser) }));
    else navigate("/login");
  }, [navigate]);

    // --- Fetch Events (Reusable Function) ---
const fetchEvents = async () => {
  if (!user?.id) return;

  setState((prev) => ({ ...prev, loading: true }));
  try {
    const res = await fetch(`http://localhost:5000/api/userevents/user/${user.id}`);
    const data = await res.json();

    if (data.status === "success") {
      setState((prev) => ({ ...prev, events: data.events }));
    } else {
      Swal.fire("Error", data.message || "Failed to load events", "error");
    }
  } catch {
    Swal.fire("Error", "Server not reachable", "error");
  } finally {
    setState((prev) => ({ ...prev, loading: false }));
  }
};

// --- Run once user is loaded ---
useEffect(() => {
  if (user?.id) fetchEvents();
}, [user]);


  // --- Add Event ---
  const handleAddEvent = async (formData) => {
    if (!user?.id)
      return Swal.fire("Error", "User not found. Please log in.", "error");

    try {
      formData.append("user_id", user.id);

      const res = await fetch("http://localhost:5000/api/userevents/add", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success") {
        const newEvent = data.event;

        // Normalize required_documents (convert string → array)
        if (typeof newEvent.required_documents === "string") {
          try {
            newEvent.required_documents = JSON.parse(
              newEvent.required_documents
            );
          } catch {
            newEvent.required_documents = [newEvent.required_documents];
          }
        }

        // Normalize image path
        if (newEvent.image && !newEvent.image.startsWith("http")) {
          newEvent.image = newEvent.image;
        }

        setState((prev) => ({
          ...prev,
          events: [...prev.events, newEvent],
        }));

        Swal.fire("Success", "Event added successfully!", "success");
      } else Swal.fire("Error", data.message || "Failed to add event", "error");
    } catch {
      Swal.fire("Error", "Backend connection failed", "error");
    } finally {
      setState((prev) => ({ ...prev, isModalOpen: false }));
    }
  };
  const handleUpdateEvent = async (formData) => {
    if (!state.editEvent) return;
    const eventId = state.editEvent.id;

    try {
      const res = await fetch(
        `http://localhost:5000/api/userevents/update/${eventId}`,
        
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        Swal.fire("Updated!", "Event updated successfully!", "success");
        fetchEvents();

        // Update the local state to reflect new changes instantly
        setState((prev) => ({
          ...prev,
          events: prev.events.map((e) =>
            e.id === eventId ? { ...e, ...data.updatedEvent } : e
          ),
          isModalOpen: false,
          editEvent: null,
        }));
      } else {
        Swal.fire("Error", data.message || "Failed to update event", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Backend connection failed", "error");
    }
  };

  // --- Delete Event ---
  const handleDeleteEvent = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the event.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/userevents/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.status === "success") {
        setState((prev) => ({
          ...prev,
          events: prev.events.filter((e) => e.id !== id),
        }));
        Swal.fire("Deleted!", "Event deleted successfully.", "success");
      } else {
        Swal.fire("Error", data.message || "Failed to delete event", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server not reachable", "error");
    }
  };
  const handleEditEvent = (event) => {
    setState((prev) => ({
      ...prev,
      isModalOpen: true,
      editEvent: event, // store the current event to edit
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // --- Filter & Pagination ---
  const filteredEvents = useMemo(
    () =>
      events.filter((e) =>
        e.title?.toLowerCase().includes(search.toLowerCase())
      ),
    [events, search]
  );

  const totalPages = Math.ceil(filteredEvents.length / rowsPerPage) || 1;
  const currentEvents = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    return filteredEvents.slice(startIdx, startIdx + rowsPerPage);
  }, [filteredEvents, currentPage, rowsPerPage]);

  const columns = useMemo(
    () => [
      { key: "sno", label: "S.No" },
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "description", label: "Description" },
      { key: "date", label: "Date" },
      { key: "author", label: "Organizer" },
      { key: "venue", label: "Venue" },
      { key: "fees", label: "Fees" },
      { key: "contact", label: "Contact" },
      { key: "image", label: "Image" },
      { key: "required_docs", label: "Documents" },
      { key: "actions", label: "Actions" },
    ],
    []
  );

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
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
        <div className="d-flex gap-2 flex-wrap">
          <button
            className="btn btn-primary d-flex align-items-center gap-1"
            onClick={() => setState((prev) => ({ ...prev, isModalOpen: true }))}
          >
            <FontAwesomeIcon icon={faPlus} /> Add Event
          </button>
          <button
            className="btn btn-outline-danger d-flex align-items-center gap-1"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faRightFromBracket} /> Logout
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
       
        <div className="d-flex gap-2 flex-wrap">
          <select
            className="form-select w-auto"
            value={rowsPerPage}
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                rowsPerPage: Number(e.target.value),
                currentPage: 1,
              }))
            }
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
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  search: e.target.value,
                  currentPage: 1,
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  Loading events...
                </td>
              </tr>
            ) : currentEvents.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-muted"
                >
                  No events found
                </td>
              </tr>
            ) : (
              currentEvents.map((event, idx) => (
                <tr key={event.id}>
                  <td>{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                  <td>{event.title}</td>
                  <td>{event.category || "-"}</td>
                  <td className="text-truncate" style={{ maxWidth: "150px" }}>
                    {event.description || "-"}
                  </td>
                  <td>
                    {event.date
                      ? new Date(event.date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{event.author || "-"}</td>
                  <td>{event.venue || "-"}</td>
                  <td>{event.fees ? `₹${event.fees}` : "-"}</td>
                  <td>{event.contact || "-"}</td>
                  <td>
                    {event.image ? (
                      <img
                        src={
                          event.image
                        }
                        alt="Event"
                        className="rounded"
                        width="50"
                      />
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
                    {(() => {
                      const docs = event.required_documents;

                      if (!docs) return "-";

                      // If it's a string, try parsing it or splitting it
                      if (typeof docs === "string") {
                        try {
                          const parsed = JSON.parse(docs);
                          return Array.isArray(parsed)
                            ? parsed.join(", ")
                            : docs;
                        } catch {
                          return docs.includes(",")
                            ? docs
                            : docs.split(" ").join(", ");
                        }
                      }

                      // If it's already an array
                      if (Array.isArray(docs)) return docs.join(", ");

                      return "-";
                    })()}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-warning"
                        title="Edit"
                        onClick={() => handleEditEvent(event)}
                      >
                      <FontAwesomeIcon icon={faPenToSquare} />

                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        title="Delete"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                     <FontAwesomeIcon icon={faTrash} />

                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-3 flex-wrap">
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={currentPage === 1}
            onClick={() =>
              setState((prev) => ({ ...prev, currentPage: currentPage - 1 }))
            }
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`btn btn-sm ${
                currentPage === num ? "btn-primary" : "btn-outline-secondary"
              }`}
              onClick={() =>
                setState((prev) => ({ ...prev, currentPage: num }))
              }
            >
              {num}
            </button>
          ))}
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={currentPage === totalPages}
            onClick={() =>
              setState((prev) => ({ ...prev, currentPage: currentPage + 1 }))
            }
          >
            Next
          </button>
        </div>
      )}

      {/* Add Event Modal */}
      {isModalOpen && (
        <Addeventmodal
          isOpen={isModalOpen}
          onClose={() =>
            setState((prev) => ({
              ...prev,
              isModalOpen: false,
              editEvent: null,
            }))
          }
          onSubmit={state.editEvent ? handleUpdateEvent : handleAddEvent} // 👈 smart switch
          existingData={state.editEvent}
          isEditing={!!state.editEvent} // 👈 pre-fill modal fields
        />
      )}
    </div>
  );
};

export default UserEvents;
