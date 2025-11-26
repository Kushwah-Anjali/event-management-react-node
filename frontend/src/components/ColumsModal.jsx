import React, { useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FiSettings } from "react-icons/fi";
import "../styles/ColumsModal.css";

export default function ColumnsModal({
  open,
  onClose,
  columns,
  visibleColumns,
  onChange,
  title = "Customize Columns",
}) {
  const modalRef = useRef();

  // Handle outside click
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  const handleToggle = (key) => {
    onChange({
      ...visibleColumns,
      [key]: !visibleColumns[key],
    });
  };

  return (
    <div
      className={`modal fade ${open ? "show d-block" : "d-none"} bg-dark bg-opacity-50`}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered" ref={modalRef}>
        <div className="modal-content border-0 shadow-lg">

          {/* Header with Icon */}
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <FiSettings size={20} />
              {title}
            </h5>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {columns.map((col) => (
              <div
                key={col.key}
                className="d-flex justify-content-between align-items-center mb-3"
              >
                <span className="fw-semibold">{col.label}</span>

                {/* Toggle Switch */}
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={visibleColumns[col.key]}
                    onChange={() => handleToggle(col.key)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
