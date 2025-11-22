import React from "react";

// Upgraded InfoBox that supports BOTH Bootstrap icons (string)
// AND React Icons (JSX components)
export default function InfoBox({ title, value, icon }) {
  return (
    <div className="col-sm-6 col-md-4 mb-3">
      <div className="card shadow-sm h-100 p-3 d-flex align-items-center text-center">
        {/* If icon is a STRING → treat as Bootstrap icon class
            If icon is a JSX ELEMENT → render directly */}
        {icon && (
          typeof icon === "string" ? (
            <i className={`${icon} fs-2 mb-2`}></i>
          ) : (
            <div className="fs-2 mb-2">{icon}</div>
          )
        )}

        <div className="text-muted small">{title}</div>
        <div className="fs-5 fw-semibold">{value ?? "N/A"}</div>
      </div>
    </div>
  );
}