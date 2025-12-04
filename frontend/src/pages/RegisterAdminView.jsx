import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaUsers,
  FaRegClipboard,
  FaTags,
  FaRegCalendarAlt,
} from "react-icons/fa";

import InfoBox from "../components/InfoBox";

const RegisterAdminView = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { eventId, title, category, date } = state || {};

  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const sortedUsers = [...registeredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // For documents sorting
    if (sortConfig.key === "documents") {
      const aPhoto = JSON.parse(a.documents || "{}")?.photo ? 1 : 0;
      const bPhoto = JSON.parse(b.documents || "{}")?.photo ? 1 : 0;
      aValue = aPhoto;
      bValue = bPhoto;
    }

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const onSort = (column) => {
    setSortConfig((prev) => ({
      key: column,
      direction:
        prev.key === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  useEffect(() => {
    if (!eventId) return;

    const fetchRegisteredUsers = async () => {
      const res = await fetch(
        `http://localhost:5000/api/register/${eventId}/registrations`
      );
      const data = await res.json();

      if (data.status === "success") {
        setRegisteredUsers(data.users);
      }
    };

    fetchRegisteredUsers();
  }, [eventId]);

  return (
    <div style={{ background: "#0d0d4d", paddingTop: "40px" }}>
      <div className="container py-4">
        {/* Header Card */}
        <div className="card shadow-sm border-0 rounded-4 mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center dash-head mb-4">
              <h3 className="text-white d-flex align-items-center gap-2 mb-0">
                <FaUsers />
                Register Users
              </h3>

              <button
                className="btn btn-outline-light d-flex align-items-center justify-content-center rounded-3 fw-semibold"
                style={{ width: "42px", height: "42px" }}
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft size={18} />
              </button>
            </div>
            <div className="row g-4">
              <InfoBox title="Title" value={title} icon={<FaRegClipboard />} />

              <InfoBox title="Category" value={category} icon={<FaTags />} />

              <InfoBox
                title="Date"
                value={date ? new Date(date).toLocaleDateString() : "-"}
                icon={<FaRegCalendarAlt />}
              />
            </div>
          </div>
        </div>

        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body">
            <div className="table-responsive rounded">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="table-primary">
                  <tr>
                    <th className="fw-semibold">S.No</th>
                  <th
  className="fw-semibold"
  style={{ cursor: "pointer", userSelect: "none" }}
  onClick={() => onSort("name")}
>
  Name{" "}
  {sortConfig.key === "name"
    ? sortConfig.direction === "asc"
      ? "▲"
      : "▼"
    : "⇅"}
</th>
                 <th
  className="fw-semibold"
  style={{ cursor: "pointer", userSelect: "none" }}
  onClick={() => onSort("email")}
>
  Email{" "}
  {sortConfig.key === "email"
    ? sortConfig.direction === "asc"
      ? "▲"
      : "▼"
    : "⇅"}
</th>


                   <th
  className="fw-semibold"
  style={{ cursor: "pointer", userSelect: "none" }}
  onClick={() => onSort("documents")}
>
  Documents{" "}
  {sortConfig.key === "documents"
    ? sortConfig.direction === "asc"
      ? "▲"
      : "▼"
    : "⇅"}
</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">
                        No registrations yet
                      </td>
                    </tr>
                  ) : (
                   sortedUsers.map((user, idx) => {
                      let documents = {};

                      try {
                        documents = JSON.parse(user.documents || "{}");
                      } catch {
                        documents = {};
                      }

                      return (
                        <tr key={user.id}>
                          <td>{idx + 1}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>

                          {/* Documents */}
                         <td>
  <input
    type="checkbox"
    checked={Boolean(documents.photo)}
    readOnly
  />
</td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdminView;
