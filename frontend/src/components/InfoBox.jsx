import React, { useState } from "react";
import Infoboxhelper from "./Infoboxhelper";

export default function InfoBox({ icon: Icon, title, data }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Clickable icon + title */}
      <div className="d-flex align-items-center gap-2 cursor-pointer" onClick={() => setOpen(!open)}>
        <Icon className="fs-4 text-white" />
        <h3 className="text-white mb-0">{title}</h3>
      </div>

      {/* Slide-in card from left */}
      <div
        className={`position-fixed top-0 start-0 bg-white shadow-lg transition-transform`}
        style={{
          width: "280px",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
          zIndex: 1050,
          overflowY: "auto",
          height: "100vh",
        }}
      >
        {/* Header with close button */}
        <div className="p-3 d-flex justify-content-between align-items-center border-bottom">
          <h5 className="mb-0">{title}</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => setOpen(false)}>X</button>
        </div>

        {/* Card content */}
        <div className="p-3">
          <Infoboxhelper data={data} />
        </div>
      </div>
    </>
  );
}
