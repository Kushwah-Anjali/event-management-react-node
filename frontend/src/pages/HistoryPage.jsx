import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import InfoBox from "../components/InfoBox";
import { FaHistory, FaRegClipboard, FaTags, FaRegCalendarAlt , FaArrowLeft} from "react-icons/fa";


export default function HistoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const eventId = location.state?.eventId;

  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    if (!eventId) return;

    try {
      const res = await fetch(`http://localhost:5000/api/history/${eventId}`);
      const data = await res.json();

      if (!data.exists) {
        Swal.fire("No History", "No history found for this event.", "info");
        setHistory(null);
      } else {
        setHistory(data.history);
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
  return (
     <div style={{background:"#0d0d4d",paddingTop:"40px"}}>
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
      <InfoBox
        title="Title"
        value={title}
        icon={<FaRegClipboard />}
      />

      {/* Event Category */}
      <InfoBox
        title="Category"
        value={category}
        icon={<FaTags />}
      />

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

      <div className="card shadow-sm border-0 ">
        <div className="card-body">
          <div className="table-responsive rounded">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-primary">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="fw-semibold">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      Loading history...
                    </td>
                  </tr>
                ) : !history ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-4 text-muted"
                    >
                      No history available
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td>{history.summary || "-"}</td>
                    <td>{history.highlights || "-"}</td>
                    <td>{history.attendees_count || "-"}</td>
                    <td>{history.guests || "-"}</td>
                    <td>{history.budget_spent || "-"}</td>

                    <td className="text-truncate" style={{ maxWidth: "200px" }}>
                      {history.long_summary || "-"}
                    </td>

                    <td className="text-truncate" style={{ maxWidth: "200px" }}>
                      {history.lessons_learned || "-"}
                    </td>

                    <td>
                      {history.media_links?.length
                        ? history.media_links.map((file, j) => (
                            <img
                              key={j}
                              src={file.url}
                              alt="media"
                              className="rounded me-2"
                              width="50"
                            />
                          ))
                        : "-"}
                    </td>

                   
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
     </div>
  
  );
}
