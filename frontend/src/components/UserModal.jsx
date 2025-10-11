// frontend/src/components/UserModal.jsx
import React, { useEffect, useState } from "react";
import "../styles/userModal.css";

export default function UserModal({ show, onClose, onSave, editUser }) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  useEffect(() => {
    if (editUser) {
      setForm({
        id: editUser.id,
        name: editUser.name,
        email: editUser.email,
        password: "",
        role: editUser.role || "admin",
      });
    } else {
      setForm({
        id: "",
        name: "",
        email: "",
        password: "",
        role: "admin",
      });
    }
  }, [editUser, show]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    const payload = {
      id: form.id,
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
    };
    onSave(payload, Boolean(form.id));
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-3">
          {/* Modal Header */}
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold text-primary">
              {form.id ? "Edit User" : "Add User"}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control shadow-sm"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control shadow-sm"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {form.id ? "New Password (optional)" : "Password"}
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="form-control shadow-sm"
                  placeholder={
                    form.id ? "Leave blank to keep current password" : "Enter password"
                  }
                />
              </div>

              {/* Role (hidden or editable later if you want role-based control) */}
              {/* <div className="mb-3">
                <label className="form-label fw-semibold">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="form-select shadow-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div> */}

              <div className="d-flex justify-content-end mt-4">
                <button
                  type="button"
                  className="btn btn-light me-2"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary fw-semibold">
                  {form.id ? "Update" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
