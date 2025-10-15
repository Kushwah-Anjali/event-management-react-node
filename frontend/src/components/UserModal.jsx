import React, { useEffect, useState } from "react";
import "../styles/userModal.css";

export default function UserModal({ show, onClose, onSave, editUser }) {
  const [form, setForm] = useState({ id: "", name: "", email: "", password: "", role: "admin" });

  useEffect(() => {
    if (editUser) setForm({ ...editUser, password: "" });
    else setForm({ id: "", name: "", email: "", password: "", role: "admin" });
  }, [editUser, show]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    onSave({ ...form, name: form.name.trim(), email: form.email.trim() }, Boolean(form.id));
  };

  if (!show) return null;

  return (
    <div className="um-overlay">
      <div className="um-dialog">
        <div className="um-card">
          <div className="um-header">
            <h5>{form.id ? "Edit User" : "Add User"}</h5>
            <button className="um-close" onClick={onClose}>×</button>
          </div>

          <div className="um-body">
            <form onSubmit={handleSubmit}>
              <div className="um-group">
                <label>Name</label>
                <input className="um-input" name="name" value={form.name} onChange={handleChange} placeholder="Enter full name" required />
              </div>

              <div className="um-group">
                <label>Email</label>
                <input className="um-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter email" required />
              </div>

              <div className="um-group">
                <label>{form.id ? "New Password (optional)" : "Password"}</label>
                <input className="um-input" type="password" name="password" value={form.password} onChange={handleChange} placeholder={form.id ? "Leave blank to keep current" : "Enter password"} />
              </div>

              <div className="um-actions">
                <button type="button" className="um-cancel" onClick={onClose}>Cancel</button>
                <button type="submit" className="um-submit">{form.id ? "Update" : "Add User"}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
