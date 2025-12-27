import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserEvents.css";
import InfoBox from "../components/InfoBox";
import Logout from "../components/Logout";
import Addeventmodal from "../components/Addeventmodal";
import ColumnsModal from "../components/ColumsModal";
import {
  FaUserCircle,
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
  FaHistory,
  FaCog,
} from "react-icons/fa";

import Swal from "sweetalert2";
const Base_url = process.env.REACT_APP_API_URL;

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
    sortKey: "",
    sortOrder: "asc",
  });
  const [open, setOpen] = useState(false);
  const { user, events, search, rowsPerPage, currentPage, isModalOpen } = state;

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
      const res = await fetch(`${Base_url}/api/events/user/${user.id}`);
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

  const handleSaveEvent = async (formData) => {
    if (!user?.id) {
      return Swal.fire("Error", "User not found", "error");
    }

    try {
      formData.append("user_id", user.id);

      // 👇 THIS is the ONLY difference between add & update
      if (state.editEvent?.id) {
        formData.append("eventId", state.editEvent.id);
      }

      const res = await fetch(`${Base_url}/api/events/save-event`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success") {
        Swal.fire(
          "Success",
          state.editEvent ? "Event updated!" : "Event added!",
          "success"
        );

        fetchEvents(); // single source of truth

        setState((prev) => ({
          ...prev,
          isModalOpen: false,
          editEvent: null,
        }));
      } else {
        Swal.fire("Error", data.message || "Operation failed", "error");
      }
    } catch {
      Swal.fire("Error", "Backend not reachable", "error");
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
      const res = await fetch(`${Base_url}/api/events/delete/${id}`, {
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
  const handleHistory = (event) => {
    navigate("/history", {
      state: {
        eventId: event.id,
        title: event.title,
        category: event.category,
        date: event.date,
      },
    });
  };

  const filteredEvents = useMemo(() => {
    let items = events.filter((e) =>
      e.title?.toLowerCase().includes(search.toLowerCase())
    );

    if (state.sortKey) {
      items.sort((a, b) => {
        const valA = a[state.sortKey] ?? "";
        const valB = b[state.sortKey] ?? "";

        if (typeof valA === "string") {
          return state.sortOrder === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        return state.sortOrder === "asc" ? valA - valB : valB - valA;
      });
    }

    return items;
  }, [events, search, state.sortKey, state.sortOrder]);

  const handleSort = (key) => {
    setState((prev) => {
      let newOrder = "asc";

      if (prev.sortKey === key && prev.sortOrder === "asc") {
        newOrder = "desc";
      }

      return {
        ...prev,
        sortKey: key,
        sortOrder: newOrder,
      };
    });
  };
  const renderActionButtons = (event) => {
    const today = new Date().toISOString().split("T")[0];
    const eventDate = event.date; // make sure this is yyyy-mm-dd format

    // ► PAST EVENTS
    if (eventDate < today) {
      return (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-dark"
            title="History"
            onClick={() => handleHistory(event)}
          >
            <FaHistory />
          </button>

          <button
            className="btn btn-sm btn-outline-danger"
            title="Delete"
            onClick={() => handleDeleteEvent(event.id)}
          >
            <FaTrash />
          </button>
        </div>
      );
    }

    // ► TODAY EVENTS
    if (eventDate === today) {
      return (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-danger"
            title="Delete"
            onClick={() => handleDeleteEvent(event.id)}
          >
            <FaTrash />
          </button>
        </div>
      );
    }

    // ► FUTURE EVENTS
    return (
      <div className="d-flex gap-2">
        <button
          className="btn btn-sm btn-outline-success"
          title="Edit"
          onClick={() => handleEditEvent(event)}
        >
          <FaEdit />
        </button>

        <button
          className="btn btn-sm btn-outline-danger"
          title="Delete"
          onClick={() => handleDeleteEvent(event.id)}
        >
          <FaTrash />
        </button>
      </div>
    );
  };

  const totalPages = Math.ceil(filteredEvents.length / rowsPerPage) || 1;
  const currentEvents = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    return filteredEvents.slice(startIdx, startIdx + rowsPerPage);
  }, [filteredEvents, currentPage, rowsPerPage]);

  const columns = [
    { key: "category", label: "Category" },
    { key: "description", label: "Description" },
    { key: "venue", label: "Venue" },
    { key: "author", label: "Author" },
    { key: "fees", label: "Fees" },
    { key: "required_documents", label: "Required Docs" },
    { key: "contact", label: "Contact" },
    { key: "date", label: "Date" },
    { key: "image", label: "Image" },
  ];

  const [visibleColumns, setVisibleColumns] = useState({
    sno: true,
    title: true,
    category: true,
    date: true,
    actions: true,

    // hidden by default
    description: false,
    venue: false,
    author: false,
    fees: false,
    required_documents: false,
    contact: false,
    image: false,
  });

  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  return (
    <div className="users-event-page">
      <div className="container py-4">
        {/* Dashboard White Card */}

        <div className="card shadow-sm border-0 rounded-4 mb-4 overflow-hidden">
          <div className="card-body  bg-light ">
            {/* Full-width header row */}
            <div
              className="d-flex justify-content-between align-items-center dash-head section-header"
              onClick={() => setOpen((prev) => !prev)}
            >
              <h3 className="text-white d-flex align-items-center gap-2 mb-0 section-title">
                <FaUserCircle />
                My Events Dashboard
              </h3>

              {/* Logout should NOT trigger toggle */}
              <div
                onClick={(e) => {
                  e.stopPropagation(); // KEY LINE
                }}
              >
                <Logout />
              </div>
            </div>

            <div
              className={`info-section card border-0 shadow-sm mb-4 p-4 rounded-4 ${
                open ? "show" : ""
              }`}
            >
              <div className="row g-4">
                <InfoBox
                  title="Name"
                  value={user?.name}
                  icon="bi bi-people-fill"
                />
                <InfoBox
                  title="Email"
                  value={user?.email}
                  icon="bi bi-envelope-fill"
                />
                <InfoBox
                  title="Total Events"
                  value={events.length}
                  icon="bi bi-calendar-event-fill"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card shadow-sm border-0 rounded-3">
          <div className="card-body">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
              {/* LEFT SIDE: Rows + Search */}
              <div className="d-flex flex-wrap gap-2 align-items-center flex-grow-1">
                {/* Search box */}
                <div
                  className="input-group"
                  style={{ minWidth: "200px", maxWidth: "300px" }}
                >
                  <span className="input-group-text bg-white">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
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

                {/* Rows selector */}
                <select
                  className="form-select"
                  style={{ width: "6rem" }}
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

                {/* Column/settings button */}
                <button
                  className="btn btn-outline-dark d-flex align-items-center gap-2"
                  title="Select columns"
                  onClick={() => setIsColumnModalOpen(true)}
                >
                  <FaCog />
                  Columns
                </button>
              </div>

              <div className="flex-shrink-0">
                <button
                  className="btn btn-custom-dark d-flex align-items-center gap-2 rounded-3 text-light bg-black"
                  onClick={() =>
                    setState((prev) => ({ ...prev, isModalOpen: true }))
                  }
                >
                  <FaPlus />
                  Add Event
                </button>
              </div>
            </div>
            <div className="table-responsive rounded">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="table-primary">
                  <tr>
                    {/* FIXED COLUMNS */}
                    <th className="fw-semibold">S. No</th>
                    <th
                      className="fw-semibold"
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleSort("title")}
                    >
                      Title
                      <span className="ms-1">
                        {state.sortKey === "title"
                          ? state.sortOrder === "asc"
                            ? "▲"
                            : "▼"
                          : "⇅"}
                      </span>
                    </th>

                    {/* DYNAMIC COLUMNS */}
                    {columns.map(
                      (col) =>
                        visibleColumns[col.key] && (
                          <th
                            key={col.key}
                            className="fw-semibold"
                            style={{
                              cursor: ["image"].includes(col.key)
                                ? "default"
                                : "pointer",
                              userSelect: "none",
                            }}
                            onClick={() =>
                              !["image"].includes(col.key) &&
                              handleSort(col.key)
                            }
                          >
                            {col.label}

                            {/* Sorting indicator */}
                            {!["image"].includes(col.key) && (
                              <span className="ms-1">
                                {state.sortKey === col.key
                                  ? state.sortOrder === "asc"
                                    ? "▲"
                                    : "▼"
                                  : "⇅"}
                              </span>
                            )}
                          </th>
                        )
                    )}

                    {/* FIXED ACTIONS COLUMN */}
                    <th className="fw-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {currentEvents.map((event, idx) => (
                    <tr
                      key={event.id}
                      onDoubleClick={() =>
                        navigate("/RegisterAdminView", {
                          state: {
                            eventId: event.id,
                            title: event.title,
                            category: event.category,
                            date: event.date,
                          },
                        })
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {/* FIXED S.NO */}
                      <td>{(currentPage - 1) * rowsPerPage + idx + 1}</td>

                      {/* FIXED TITLE */}
                      <td>{event.title}</td>

                      {/* DYNAMIC FIELDS */}
                      {visibleColumns.category && (
                        <td>{event.category || "-"}</td>
                      )}

                      {visibleColumns.description && (
                        <td className="text-truncate">
                          {event.description || "-"}
                        </td>
                      )}

                      {visibleColumns.venue && <td>{event.venue || "-"}</td>}

                      {visibleColumns.author && <td>{event.author || "-"}</td>}

                      {visibleColumns.fees && <td>{event.fees || "-"}</td>}

                      {visibleColumns.required_documents && (
                        <td>
                          {Array.isArray(event.required_documents)
                            ? event.required_documents.join(", ")
                            : event.required_documents || "-"}
                        </td>
                      )}

                      {visibleColumns.contact && (
                        <td>{event.contact || "-"}</td>
                      )}

                      {visibleColumns.date && (
                        <td>
                          {event.date
                            ? new Date(event.date).toLocaleDateString()
                            : "-"}
                        </td>
                      )}

                      {visibleColumns.image && (
                        <td>
                          {event.image ? (
                            <img
                              src={event.image}
                              width={50}
                              height={50}
                              className="rounded"
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                      )}

                      {/* FIXED ACTIONS */}
                      <td>{renderActionButtons(event)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
            onSubmit={handleSaveEvent} // 👈 smart switch
            existingData={state.editEvent}
            isEditing={!!state.editEvent} // 👈 pre-fill modal fields
          />
        )}
        <ColumnsModal
          open={isColumnModalOpen}
          onClose={() => setIsColumnModalOpen(false)}
          columns={columns}
          visibleColumns={visibleColumns}
          onChange={setVisibleColumns}
        />
      </div>
    </div>
  );
};

export default UserEvents;
