import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import InfoBox from "../components/InfoBox";
import MediaHistory from "../components/MediaHistory";
import HistoryModal from "../components/HistoryModal";
import ColumsModal from "../components/ColumsModal";
import {
  FaHistory,
  FaRegClipboard,
  FaTags,
  FaRegCalendarAlt,
  FaArrowLeft,
  FaCog,
} from "react-icons/fa";

export default function HistoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const eventId = location.state?.eventId;

  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    Summary: true,
    attandees: true,
    budget_spent: true,
    media: true,
    highlights: false,
    long_summary: false,
    lessons_learned: false,
    guests: false,
  });

  const fetchHistory = async () => {
    if (!eventId) return;

    try {
      const res = await fetch(`http://localhost:5000/api/history/${eventId}`);
      const data = await res.json();

      if (!data.exists) {
        Swal.fire("No History", "No history found for this event.", "info");
        setHistory(null);
      } else {
        const h = Array.isArray(data.history) ? data.history[0] : data.history;

        // Parse media_links into usable media array
        const media = Array.isArray(h.media)
          ? h.media.map((m) => ({
              ...m,
              src: `http://localhost:5000/history/${m.url}`,
            }))
          : [];

        setHistory({ ...h, media });
      }
    } catch (err) {
      Swal.fire("Error", "Cannot connect to server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [eventId]);

  // Columns WITHOUT id and event_id
  const columns = [
    { key: "summary", label: "Summary" },
    { key: "highlights", label: "Highlights" },
    { key: "attendees_count", label: "Attendees" },
    { key: "guests", label: "Guests" },
    { key: "budget_spent", label: "Budget Spent" },
    { key: "long_summary", label: "Long Summary" },
    { key: "lessons_learned", label: "Lessons Learned" },
    { key: "media", label: "Media" },
  ];

  const { title, category, date } = location.state || {};
  const eventData = {
    id: eventId,
    title: title || "",
    date: date || "",
  };

  return (
    <div style={{ background: "#0d0d4d", paddingTop: "40px" }}>
      <div className="container py-4">
        <div className="card shadow-sm border-0 rounded-4 mb-4">
          <div className="card-body">
            {/* Full-width header row */}
            <div className="d-flex justify-content-between align-items-center dash-head mb-4">
              {/* Title */}
              <h3 className="text-white d-flex align-items-center gap-2 mb-0">
                <FaHistory />
                Event History
              </h3>
              <button
                className="btn btn-outline-light d-flex align-items-center justify-content-center rounded-3 fw-semibold"
                style={{ width: "42px", height: "42px" }}
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft size={18} />
              </button>
            </div>

            {/* Info Grid */}
            <div className="row g-4">
              {/* Event Title */}
              <InfoBox title="Title" value={title} icon={<FaRegClipboard />} />

              {/* Event Category */}
              <InfoBox title="Category" value={category} icon={<FaTags />} />

              {/* Event Date */}
              <InfoBox
                title="Date"
                value={new Date(date).toLocaleDateString()}
                icon={<FaRegCalendarAlt />}
              />
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------- */}

        <div className="card shadow-sm border-0">
          <div className="card-body pb-2">
            {/* Buttons Row */}
           
              <div className="d-flex gap-2 flex-wrap justify-content-between mb-3">
                <button
                  className="btn btn-outline-dark d-flex align-items-center gap-2"
                  onClick={() => setIsColumnModalOpen(true)}
                >
                  <FaCog />
                  Columns
                </button>

                <button
                  className="btn fw-semibold rounded-3 btn-custom-dark bg-black text-light"
                  onClick={() => setShowHistoryModal(true)}
                >
                  + Add History
                </button>
              </div>
           
          </div>

          <div className="card-body pt-0">
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="table-primary">
                  <tr>
                    {columns
                      .filter((col) => visibleColumns[col.key] !== false)
                      .map((col) => (
                        <th key={col.key} className="fw-semibold">
                          {col.label}
                        </th>
                      ))}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={
                          columns.filter((c) => visibleColumns[c.key] !== false)
                            .length
                        }
                        className="text-center py-4"
                      >
                        Loading history...
                      </td>
                    </tr>
                  ) : !history ? (
                    <tr>
                      <td
                        colSpan={
                          columns.filter((c) => visibleColumns[c.key] !== false)
                            .length
                        }
                        className="text-center py-4 text-muted"
                      >
                        No history available
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      {columns
                        .filter((col) => visibleColumns[col.key] !== false)
                        .map((col) => (
                          <td key={col.key}>
                            {col.key === "media" ? (
                              history.media?.length ? (
                                <MediaHistory
                                  media={history.media}
                                  thumbnailWidth={50}
                                />
                              ) : (
                                "-"
                              )
                            ) : (
                              history[col.key] || "-"
                            )}
                          </td>
                        ))}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <HistoryModal
        show={showHistoryModal}
        onHide={() => setShowHistoryModal(false)}
        eventData={eventData}
        historyData={history ?? {}}
        onSubmit={(fd, id) => {
          setShowHistoryModal(false);
          fetchHistory();
        }}
      />
      <ColumsModal
        open={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        columns={columns}
        visibleColumns={visibleColumns}
        onChange={setVisibleColumns}
      />
    </div>
  );
}
