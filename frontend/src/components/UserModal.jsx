import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPlusCircle,
  FaEdit,
} from "react-icons/fa";

export default function UserModal({ show, onClose, onSave, editUser }) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  useEffect(() => {
    if (editUser) setForm({ ...editUser, password: "" });
    else setForm({ id: "", name: "", email: "", password: "", role: "admin" });
  }, [editUser, show]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    onSave(
      { ...form, name: form.name.trim(), email: form.email.trim() },
      Boolean(form.id)
    );
  };

  if (!show) return null;

  return (
    // Modal overlay with blur
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        transition: "opacity 0.25s ease",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4">
          {/* Header */}
          <div
            className="modal-header bg-primary flex-column align-items-start border-0 px-4 pt-4 pb-2"
            style={{
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem",
            }}
          >
            <h5 className="fw-bold d-flex align-items-center gap-2 text-white">
              {form.id ? (
                <FaEdit className="text-white" />
              ) : (
                <FaPlusCircle className="text-white" />
              )}
              {form.id ? "Edit User" : "Add User"}
            </h5>

            <button
              type="button"
              className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <FaUser className="text-primary me-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <FaEnvelope className="text-primary me-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <FaLock className="text-primary me-2" />
                  {form.id ? "New Password (optional)" : "Password"}
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={
                    form.id ? "Leave blank to keep current" : "Enter password"
                  }
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-3"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary rounded-pill px-3">
                  {form.id ? "Update User" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
