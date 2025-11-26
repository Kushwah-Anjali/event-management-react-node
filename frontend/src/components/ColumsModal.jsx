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

  // Close when clicking outside
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

  // Unified toggle handler
  const handleToggle = (key) => {
    onChange({
      ...visibleColumns,
      [key]: !visibleColumns[key],
    });
  };

  // Create list based on visibleColumns object keys
  // Ensures modal ALWAYS syncs with table config
  const modalColumns = [
    { key: "sno", label: "S. No (Fixed)" },
    { key: "title", label: "Title (Fixed)" },
    ...columns, // dynamic columns you passed earlier
    { key: "actions", label: "Actions (Fixed)" },
  ];

  return (
    <div
      className={`modal fade ${open ? "show d-block" : "d-none"} bg-dark bg-opacity-50`}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered" ref={modalRef}>
        <div className="modal-content border-0 shadow-lg">

          {/* Header */}
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <FiSettings size={20} />
              {title}
            </h5>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {modalColumns.map((col) => (
              <div
                key={col.key}
                className="d-flex justify-content-between align-items-center mb-3"
              >
                <span className="fw-semibold">{col.label}</span>

                {/* Disable toggle for fixed columns */}
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={visibleColumns[col.key]}
                    disabled={["sno", "title", "actions"].includes(col.key)}
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
