import React, { useEffect, useRef, useState } from "react";
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
  const fixedKeys = ["sno", "title", "actions"];

  const [activeAction, setActiveAction] = useState(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  const handleToggle = (key) => {
    onChange({
      ...visibleColumns,
      [key]: !visibleColumns[key],
    });
  };

 const modalColumns = [...columns];


  const handleSelectAll = () => {
    const updated = {};
    Object.keys(visibleColumns).forEach((key) => {
      updated[key] = true;
    });
    onChange(updated);
    setActiveAction("select");
  };

  const handleUnselectAll = () => {
    const updated = {};
    Object.keys(visibleColumns).forEach((key) => {
      updated[key] = fixedKeys.includes(key) ? true : false;
    });
    onChange(updated);
    setActiveAction("unselect");
  };

  if (!open) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
    
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content border-0 shadow-lg rounded-4"
          ref={modalRef}
        >
          {/* Header */}
          <div
            className="modal-header bg-primary flex-column align-items-start border-0 px-4 pt-4 pb-2"
            style={{
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem",
            }}
          >
            <h5 className="fw-bold d-flex align-items-center gap-2 text-white">
              <FiSettings size={20} className="text-white" />
              {title}
            </h5>

            <button
              type="button"
              className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body px-4">
            {modalColumns.map((col) => (
              <div
                key={col.key}
                className="d-flex justify-content-between align-items-center mb-3"
              >
                <span className="fw-semibold">{col.label}</span>

                <label className="switch">
                  <input
                    type="checkbox"
                    checked={visibleColumns[col.key]}
                    disabled={fixedKeys.includes(col.key)}
                    onChange={() => handleToggle(col.key)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="modal-footer d-flex justify-content-between align-items-center px-4 pb-4">

            {/* Left actions */}
            <div className="d-flex gap-2">
              <button
                className={`btn btn-sm ${
                  activeAction === "select"
                    ? "btn-primary"
                    : "btn-outline-primary"
                } rounded-pill px-3`}
                onClick={handleSelectAll}
              >
                Check All
              </button>

              <button
                className={`btn btn-sm ${
                  activeAction === "unselect"
                    ? "btn-primary"
                    : "btn-outline-primary"
                } rounded-pill px-3`}
                onClick={handleUnselectAll}
              >
                Uncheck All
              </button>
            </div>

            <button
              className="btn btn-outline-secondary rounded-pill px-3"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
