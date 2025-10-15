import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faPlusCircle,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
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

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header border-0 flex-column align-items-start pb-0">
            <h4 className="fw-bold text-dark d-flex align-items-center gap-2">
              <FontAwesomeIcon
                icon={form.id ? faEdit : faPlusCircle}
                className="text-primary"
              />
              {form.id ? "Edit User" : "Add User"}
            </h4>
            <div className="underline-accent mb-2"></div>
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-3"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <FontAwesomeIcon icon={faUser} className="text-primary me-2" />
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
                  <FontAwesomeIcon icon={faEnvelope} className="text-primary me-2" />
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
                  <FontAwesomeIcon icon={faLock} className="text-primary me-2" />
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
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill px-3"
                >
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
