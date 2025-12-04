import React from "react";
import { FaUser, FaEnvelope, FaCalendarAlt } from "react-icons/fa";

export default function Infoboxhelper({ data }) {
  const iconMap = {
    Name: <FaUser className="text-success" />, 
    Email: <FaEnvelope className="text-success" />, 
    "Total Events": <FaCalendarAlt className="text-success" />
  };

  return (
    <div className="card shadow-sm border-0 rounded-3 p-2" style={{ width: "100%", maxWidth: "280px" }}>
      <div className="row g-2">
        {data?.map((item, index) => (
          <div className="col-12 d-flex align-items-center" key={index}>
            <div className="w-100 p-2 rounded-2 d-flex justify-content-between align-items-center border bg-light">
              <div className="d-flex align-items-center gap-2">
                {iconMap[item.title] || null}
                <span className="fw-semibold text-success">{item.title}</span>
              </div>
              <span className="fw-bold text-success">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Usage Example:
// <InfoBox
//   data=[
//     { title: "Name", value: user?.name },
//     { title: "Email", value: user?.email },
//     { title: "Total Events", value: events.length },
//   ]
// />
