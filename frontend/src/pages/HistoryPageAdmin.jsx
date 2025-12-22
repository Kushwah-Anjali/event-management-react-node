import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import InfoBox from "../components/InfoBox";
import MediaHistory from "../components/MediaHistory";
import HistoryModal from "../components/HistoryModal";
import ColumsModal from "../components/ColumsModal";
import { FaHistory, FaRegClipboard, FaTags, FaRegCalendarAlt, FaArrowLeft, FaCog } from "react-icons/fa";
import { getHistoryByEvent, saveHistory } from "../services/adminHistoryPage"; // Axios

export default function HistoryPageAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const eventId = location.state?.eventId;

  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const visibleColumnsDefault = {
    summary: true,
    highlights: false,
    attendees_count: true,
    guests: false,
    budget_spent: true,
    long_summary: false,
    lessons_learned: false,
    media: true,
  };
  const [visibleColumns, setVisibleColumns] = useState(visibleColumnsDefault);

  const columns = useMemo(() => [
    { key: "summary", label: "Summary" },
    { key: "highlights", label: "Highlights" },
    { key: "attendees_count", label: "Attendees" },
    { key: "guests", label: "Guests" },
    { key: "budget_spent", label: "Budget Spent" },
    { key: "long_summary", label: "Long Summary" },
    { key: "lessons_learned", label: "Lessons Learned" },
    { key: "media", label: "Media" },
  ], []);

  const filteredColumns = useMemo(() => columns.filter(col => visibleColumns[col.key]), [columns, visibleColumns]);
  // Fetch history
  const fetchHistory = async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const { data } = await getHistoryByEvent(eventId);
      if (!data.exists) {
        setHistory(null);
        Swal.fire("No History", "No history found for this event.", "info");
      } else {
        setHistory(data.history);}
    } catch (err) {
      Swal.fire("Error", "Cannot fetch history", "error");
    } finally {
      setLoading(false);
    }
  };

  // Add / update history
  const handleHistorySubmit = async (fd, id) => {
    try {
      const { data } = await saveHistory(id, fd);
      setHistory(data.history); 
      setShowHistoryModal(false);
      Swal.fire("Success", `History ${data.action} successfully`, "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Unable to update history", "error");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [eventId]);

  const { title, category, date } = location.state || {};
  const eventData = { id: eventId, title: title || "", date: date || "" };

  return (
    <div style={{ background: "#0d0d4d", paddingTop: "40px" }}>
      <div className="container py-4">
        {/* Header */}
        <div className="card shadow-sm border-0 rounded-4 mb-4">
          <div className="card-body">
          <div
  className="d-flex justify-content-between align-items-center dash-head mb-4 section-header"
               onClick={() => setOpen((prev) => !prev)}

>
  <h3 className="text-white d-flex align-items-center gap-2 mb-0 section-title"><FaHistory /> Event History</h3>
  <button
    className="btn btn-outline-light  icon-btn d-flex align-items-center justify-content-center rounded-3 fw-semibold"
    style={{ width: 42, height: 42 }}
    onClick={(e) => {
                  e.stopPropagation(); // IMPORTANT
                  navigate(-1);
                }}
  >
    <FaArrowLeft size={18} />
  </button>
</div>

 <div
              className={`info-section border rounded-4 mb-4 p-3 p-md-4 bg-white ${
                open ? "show" : ""
              }`}
            >
  <div className="row g-3">
    <InfoBox title="Title" value={title} icon={<FaRegClipboard />} />
    <InfoBox title="Category" value={category} icon={<FaTags />} />
    <InfoBox title="Date" value={new Date(date).toLocaleDateString()} icon={<FaRegCalendarAlt />} />
  </div>
</div>

          </div>
        </div>

        {/* History Table */}
        <div className="card shadow-sm border-0">
          <div className="card-body pb-2 d-flex justify-content-between flex-wrap gap-2 mb-3">
            <button className="btn btn-outline-dark d-flex align-items-center gap-2" onClick={() => setIsColumnModalOpen(true)}>
              <FaCog /> Columns
            </button>
            <button
  className="btn rounded-3 btn-custom-dark bg-black text-light"
  onClick={() => setShowHistoryModal(true)}
>
  {history ? "Update History" : "+ Add History"}
</button>

          </div>
          <div className="card-body pt-0">
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="table-primary">
                  <tr>{filteredColumns.map(col => <th key={col.key} className="fw-semibold">{col.label}</th>)}</tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={filteredColumns.length} className="text-center py-4">Loading history...</td></tr>
                  ) : !history ? (
                    <tr><td colSpan={filteredColumns.length} className="text-center py-4 text-muted">No history available</td></tr>
                  ) : (
                    <tr>
                      {filteredColumns.map(col => (
                        <td key={col.key}>
                          {col.key === "media" ? (history.media?.length ? <MediaHistory media={history.media} thumbnailWidth={50} /> : "-") : history[col.key] || "-"}
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

      {/* Modals */}
{showHistoryModal && (
  <HistoryModal
    show={true}
    onHide={() => setShowHistoryModal(false)}
    eventData={eventData}
    historyData={history}
    onSubmit={handleHistorySubmit}
  />
)}

      <ColumsModal open={isColumnModalOpen} onClose={() => setIsColumnModalOpen(false)} columns={columns} visibleColumns={visibleColumns} onChange={setVisibleColumns} />
    </div>
  );
}
