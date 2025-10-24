import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeading, faTags, faAlignLeft, faCalendarDays,
  faUser, faLocationDot, faMoneyBillWave, faPhone,
  faImage, faFileLines, faArrowLeft, faArrowRight,
  faPlusCircle
} from "@fortawesome/free-solid-svg-icons";

const steps = ["Basic Info", "Details", "Image", "Documents"];

export default function AddEventModal({ isOpen, onClose, onSubmit, categories }) {
  const totalSteps = steps.length;
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    title: "", category: null, description: "", date: "",
    author: "", venue: "", fees: "", contact: "",
    image: null, required_docs: [],
  });

  useEffect(() => { if (isOpen) setStep(0); }, [isOpen]);

  const handleNext = () => { if (validateStep(step) && step < totalSteps - 1) setStep(s => s + 1); };
  const handlePrev = () => setStep(s => s - 1);

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === "file") setData(d => ({ ...d, [name]: files[0] }));
    else if (type === "checkbox") {
      setData(d => {
        const docs = d.required_docs.includes(value)
          ? d.required_docs.filter(v => v !== value)
          : [...d.required_docs, value];
        return { ...d, required_docs: docs };
      });
    } else setData(d => ({ ...d, [name]: value }));
  };

  const handleCategoryChange = opt => setData(d => ({ ...d, category: opt }));

  const validateStep = s => {
    let msg = "";
    if (s === 0 && (!data.title || !data.category || !data.date)) msg = "Please fill required fields";
    else if (s === 1 && (!data.author || !data.venue || !data.fees || isNaN(data.fees) || !/^\d{10}$/.test(data.contact)))
      msg = "Check author, venue, fees, contact";
    else if (s === 2 && !data.image) msg = "Please upload an image";

    if (msg) { Swal.fire({ icon: "error", title: "Error", text: msg, confirmButtonColor: "#0d6efd" }); return false; }
    return true;
  };

  const handleSubmit = e => { e.preventDefault(); if (validateStep(step)) onSubmit(data); };

  if (!isOpen) return null;

  return (
    // Blur + semi-transparent overlay
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)", // Safari
        transition: "opacity 0.25s ease",
      }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "500px" }}>
        <form className="modal-content shadow rounded-4" onSubmit={handleSubmit}>

          {/* Header */}
          <div className="modal-header border-0 flex-column align-items-start pb-2">
            <h5 className="fw-bold text-dark d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faPlusCircle} className="text-primary" />
              {step === totalSteps - 1 ? "Add Event - Final Step" : "Add New Event"}
            </h5>
            <button type="button" className="btn-close position-absolute top-0 end-0 m-3" onClick={onClose}></button>
          </div>

          {/* Progress */}
          <div className="px-4 mb-3">
            <div className="progress" style={{ height: "6px" }}>
              <div className="progress-bar bg-primary" style={{ width: `${((step + 1) / totalSteps) * 100}%` }}></div>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {step === 0 && <>
              <label className="form-label fw-semibold"><FontAwesomeIcon icon={faHeading} className="text-primary me-2" /> Event Title *</label>
              <input name="title" value={data.title} onChange={handleChange} className="form-control mb-3" placeholder="Event Title" />

              <label className="form-label fw-semibold"><FontAwesomeIcon icon={faTags} className="text-primary me-2" /> Category *</label>
              <Select options={categories} value={data.category} onChange={handleCategoryChange} placeholder="Select category" className="mb-3" />

              <label className="form-label fw-semibold"><FontAwesomeIcon icon={faAlignLeft} className="text-primary me-2" /> Description</label>
              <textarea name="description" value={data.description} onChange={handleChange} className="form-control mb-3" rows="3" />

              <label className="form-label fw-semibold"><FontAwesomeIcon icon={faCalendarDays} className="text-primary me-2" /> Date *</label>
              <input type="date" name="date" value={data.date} onChange={handleChange} className="form-control" />
            </>}

            {step === 1 && <>
              <label className="form-label fw-semibold"><FontAwesomeIcon icon={faUser} className="text-primary me-2" /> Organizer *</label>
              <input name="author" value={data.author} onChange={handleChange} className="form-control mb-3" placeholder="Organizer" />

              <label className="form-label fw-semibold"><FontAwesomeIcon icon={faLocationDot} className="text-primary me-2" /> Venue *</label>
              <input name="venue" value={data.venue} onChange={handleChange} className="form-control mb-3" />

              <label className="form-label fw-semibold"><FontAwesomeIcon icon={faMoneyBillWave} className="text-primary me-2" /> Fees *</label>
              <input name="fees" value={data.fees} onChange={handleChange} className="form-control mb-3" />

              <label className="form-label fw-semibold"><FontAwesomeIcon icon={faPhone} className="text-primary me-2" /> Contact *</label>
              <input name="contact" value={data.contact} onChange={handleChange} className="form-control" />
            </>}

            {step === 2 && <>
              <label className="form-label fw-semibold"><FontAwesomeIcon icon={faImage} className="text-primary me-2" /> Upload Image *</label>
              <input type="file" name="image" onChange={handleChange} className="form-control mb-2" />
              {data.image && <img src={URL.createObjectURL(data.image)} alt="Preview" className="img-thumbnail mt-2" style={{ width: "120px" }} />}
            </>}

            {step === 3 && <>
              <label className="form-label fw-semibold"><FontAwesomeIcon icon={faFileLines} className="text-primary me-2" /> Required Documents</label>
              <div className="d-flex flex-wrap gap-3 mt-2">
                {["Aadhar Card", "Resume", "Marksheet", "Photo"].map(d => (
                  <div key={d} className="form-check">
                    <input type="checkbox" value={d} checked={data.required_docs.includes(d)} onChange={handleChange} className="form-check-input" id={d} />
                    <label className="form-check-label" htmlFor={d}>{d}</label>
                  </div>
                ))}
              </div>
            </>}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            {step > 0 && <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={handlePrev}><FontAwesomeIcon icon={faArrowLeft} /> Previous</button>}
            {step < totalSteps - 1 && <button type="button" className="btn btn-primary rounded-pill px-3" onClick={handleNext}>Next <FontAwesomeIcon icon={faArrowRight} /></button>}
            {step === totalSteps - 1 && <button type="submit" className="btn btn-success rounded-pill px-3"><FontAwesomeIcon icon={faPlusCircle} /> Add Event</button>}
          </div>

        </form>
      </div>
    </div>
  );
}
