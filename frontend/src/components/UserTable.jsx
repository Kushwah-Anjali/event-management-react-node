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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Load Users from API
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

  // ✅ Add / Edit modal controls
  const openAdd = () => {
    setEditUser(null);
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditUser(user);
    setShowModal(true);
  };

  // ✅ Delete user handler with confirmation
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
        backdrop: false, // prevent screen blackout
      });
      loadUsers();
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Error", "Delete failed", "error");
    }
  };

  // ✅ Add / Update User handler
  const handleSave = async (formData, isUpdate) => {
    try {
      // Close modal before showing alert
      setShowModal(false);

      const res = isUpdate
        ? await updateUser(formData, ADMIN_KEY)
        : await addUser(formData, ADMIN_KEY);

      if (res.data.status === "success") {
        Swal.fire({
          title: "✅ Success",
          text: res.data.message,
          icon: "success",
          backdrop: false,
        });
        loadUsers();
      } else {
        Swal.fire({
          title: "❌ Error",
          text: res.data.message,
          icon: "error",
          backdrop: false,
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Error", "Something went wrong!", "error");
    }
  };

  // ✅ Filter users by name or email
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="card shadow-lg border-0 user-table-card">
      {/* ===== Header ===== */}
      <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center bg-white border-0 py-3">
        <button
          className="btn btn-primary fw-bold d-flex align-items-center mb-2 mb-md-0"
          onClick={openAdd}
        >
          <FaPlus className="me-2" /> Add User
        </button>

        <div className="input-group w-100 w-md-50 shadow-sm rounded">
          <span className="input-group-text bg-white border-end-0">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control border-start-0 rounded-end"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ===== Table ===== */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light text-uppercase small">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date Created</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user, idx) => (
                <tr key={user.id}>
                  <td>{idx + 1}</td>
                  <td className="fw-semibold">{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-success me-2"
                      onClick={() => openEdit(user)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== Modal ===== */}
      <UserModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        editUser={editUser}
      />
    </div>
  );
}
