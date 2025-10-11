import React, { useEffect, useState } from "react";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../services/userService";
import Swal from "sweetalert2";
import UserModal from "./UserModal";
import { FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";

const ADMIN_KEY = process.env.REACT_APP_ADMIN_KEY || "mySecretKey123";

export default function UserTable() {
  // --- Data + UI state ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // Search (you already had this)
  const [searchQuery, setSearchQuery] = useState("");

  // Sorting state
  const [sortBy, setSortBy] = useState(null);       // 'name' | 'email' | 'created_at'
  const [sortDir, setSortDir] = useState("asc");    // 'asc' | 'desc'

  // Pagination state (you missed these earlier -> caused no-undef)
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // change to what you prefer

  // --- Load users from API ---
  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      if (res.data.status === "success") {
        setUsers(res.data.result);
      } else {
        Swal.fire("⚠️ Error", res.data.message, "warning");
        setUsers([]);
      }
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Error", "Failed to fetch users!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Reset page to 1 when searchQuery changes (good UX)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // --- Modal controls ---
  const openAdd = () => {
    setEditUser(null);
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditUser(user);
    setShowModal(true);
  };

  // --- Delete handler ---
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await deleteUser({ id }, ADMIN_KEY);
      Swal.fire({
        title: res.data.status === "success" ? "✅ Deleted" : "❌ Error",
        text: res.data.message,
        icon: res.data.status === "success" ? "success" : "error",
        backdrop: false,
      });
      loadUsers();
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Error", "Delete failed", "error");
    }
  };

  // --- Save (add/update) ---
  const handleSave = async (formData, isUpdate) => {
    try {
      setShowModal(false);
      const res = isUpdate
        ? await updateUser(formData, ADMIN_KEY)
        : await addUser(formData, ADMIN_KEY);

      Swal.fire({
        title: res.data.status === "success" ? "✅ Success" : "❌ Error",
        text: res.data.message,
        icon: res.data.status === "success" ? "success" : "error",
        backdrop: false,
      });
      loadUsers();
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Error", "Something went wrong!", "error");
    }
  };

  // --- Sorting handler ---
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
    setCurrentPage(1); // reset page on sort for a consistent UX
  };

  // --- Sorting logic (pure function) ---
  const getSortedUsers = (list) => {
    if (!sortBy) return [...list]; // no sort -> return copy

    const dir = sortDir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      const A = a[sortBy];
      const B = b[sortBy];

      // Date column
      if (sortBy === "created_at") {
        const tA = new Date(A).getTime() || 0;
        const tB = new Date(B).getTime() || 0;
        return (tA - tB) * dir;
      }

      // Strings (name, email)
      if (typeof A === "string" && typeof B === "string") {
        return A.localeCompare(B, undefined, { sensitivity: "base" }) * dir;
      }

      // Numeric fallback
      const nA = Number(A);
      const nB = Number(B);
      if (!Number.isNaN(nA) && !Number.isNaN(nB)) {
        return (nA - nB) * dir;
      }

      return 0;
    });
  };

  // --- Filtering (search) ---
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Apply sort then paginate (correct pipeline) ---
  const sortedUsers = getSortedUsers(filteredUsers);
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage) || 1;

  // Helper to show sort arrow in header
  const renderSortArrow = (col) => {
    if (sortBy !== col) return "⇅";
    return sortDir === "asc" ? "▲" : "▼";
  };

  return (
    <div className="user-table-card">
      {/* Header Section */}
      <div className="card-header-custom d-flex justify-content-between align-items-center">
        <h2>User Management</h2>
        <button className="btn btn-custom d-flex align-items-center" onClick={openAdd}>
          <FaPlus className="me-2" /> Add New User
        </button>
      </div>

      {/* Search Input */}
      <div className="input-group mb-3 mt-3">
        <span className="input-group-text"><FaSearch /></span>
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); /* resets page via useEffect */ }}
        />
      </div>

      {/* Table Section */}
      <div className="table-responsive">
        <table className="table table-hover table-borderless align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                Name <span className="ms-1">{renderSortArrow("name")}</span>
              </th>
              <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
                Email <span className="ms-1">{renderSortArrow("email")}</span>
              </th>
              <th onClick={() => handleSort("created_at")} style={{ cursor: "pointer" }}>
                Date Created <span className="ms-1">{renderSortArrow("created_at")}</span>
              </th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-4"><div className="spinner-border text-primary" role="status" /></td></tr>
            ) : currentUsers.length > 0 ? (
              currentUsers.map((user, idx) => (
                <tr key={user.id}>
                  {/* Show global index (not just page index) */}
                  <td>{indexOfFirst + idx + 1}</td>
                  <td className="fw-semibold">{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-success me-2" onClick={() => openEdit(user)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center py-4 text-muted">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls (simple) */}
      {sortedUsers.length > usersPerPage && (
        <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
          <button className="btn btn-outline-primary btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Previous</button>
          <span className="fw-semibold">Page {currentPage} of {totalPages}</span>
          <button className="btn btn-outline-primary btn-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</button>
        </div>
      )}

      {/* Modal */}
      <UserModal show={showModal} onClose={() => setShowModal(false)} onSave={handleSave} editUser={editUser} />
    </div>
  );
}
