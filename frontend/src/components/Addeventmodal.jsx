import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import "../styles/Addeventmodal.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHeading, faTags, faAlignLeft, faCalendarDays,
  faUser, faLocationDot, faMoneyBillWave, faPhone,
  faImage, faFileLines, faArrowLeft, faArrowRight,
  faPlusCircle
} from "@fortawesome/free-solid-svg-icons";

const steps = ["Basic Info", "Details", "Image Upload", "Documents"];

export default function Addeventmodal({ isOpen, onClose, onSubmit, categories }) {
  const totalSteps = steps.length;
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    title: "", category: null, description: "", date: "",
    author: "", venue: "", fees: "", contact: "",
    image: null, required_docs: [],
  });

  useEffect(() => { if (isOpen) setStep(0); }, [isOpen]);

  const handleNext = () => { if(validateStep(step) && step < totalSteps - 1) setStep(s => s + 1); };
  const handlePrev = () => setStep(s => s - 1);

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if(type === "file") setData(d => ({ ...d, [name]: files[0] }));
    else if(type === "checkbox") {
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
    if(s===0 && (!data.title || !data.category || !data.date)) msg = "Please fill all required fields";
    else if(s===1 && (!data.author || !data.venue || !data.fees || isNaN(data.fees) || !/^\d{10}$/.test(data.contact))) msg = "Check details: author, venue, fees, contact";
    else if(s===2 && !data.image) msg = "Please upload an image";

    if(msg) { Swal.fire({ icon:"error", title:"Error", text:msg, confirmButtonColor:"#0d6efd" }); return false; }
    return true;
  };

  const handleSubmit = e => { e.preventDefault(); if(validateStep(step)) onSubmit(data); };

  if(!isOpen) return null;

  const progress = ((step+1)/totalSteps)*100;

  return (
    <div className="ae-modal-overlay">
      <div className="ae-modal-dialog">
        <form className="ae-modal-card" onSubmit={handleSubmit}>

          {/* Header */}
          <div className="ae-modal-header">
            <h5>{step===totalSteps-1 ? "Add Event - Final Step" : "Add New Event"}</h5>
            <button type="button" className="ae-btn-close" onClick={onClose}>×</button>
          </div>

          {/* Progress */}
          <div className="ae-progress-wrapper">
            <span className="ae-progress-text">{`Step ${step+1} of ${totalSteps}`}</span>
            <div className="ae-progress-bg"><div className="ae-progress-fill" style={{width:`${progress}%`}}></div></div>
          </div>

          {/* Body */}
          <div className="ae-modal-body">
            {step===0 && <>
              <label><FontAwesomeIcon icon={faHeading}/> Event Title *</label>
              <input name="title" value={data.title} onChange={handleChange} className="ae-input" placeholder="Event Title"/>
              
              <label className="ae-mt"><FontAwesomeIcon icon={faTags}/> Category *</label>
              <Select options={categories} value={data.category} onChange={handleCategoryChange} placeholder="Select category"/>

              <label className="ae-mt"><FontAwesomeIcon icon={faAlignLeft}/> Description</label>
              <textarea name="description" value={data.description} onChange={handleChange} className="ae-input" rows="3"/>

              <label className="ae-mt"><FontAwesomeIcon icon={faCalendarDays}/> Date *</label>
              <input type="date" name="date" value={data.date} onChange={handleChange} className="ae-input"/>
            </>}

            {step===1 && <>
              <label><FontAwesomeIcon icon={faUser}/> Author/Organizer *</label>
              <input name="author" value={data.author} onChange={handleChange} className="ae-input" placeholder="Organizer"/>
              
              <label className="ae-mt"><FontAwesomeIcon icon={faLocationDot}/> Venue *</label>
              <input name="venue" value={data.venue} onChange={handleChange} className="ae-input"/>

              <label className="ae-mt"><FontAwesomeIcon icon={faMoneyBillWave}/> Fees *</label>
              <input name="fees" value={data.fees} onChange={handleChange} className="ae-input"/>

              <label className="ae-mt"><FontAwesomeIcon icon={faPhone}/> Contact *</label>
              <input name="contact" value={data.contact} onChange={handleChange} className="ae-input"/>
            </>}

            {step===2 && <>
              <label><FontAwesomeIcon icon={faImage}/> Upload Image *</label>
              <input type="file" name="image" onChange={handleChange} className="ae-input"/>
              {data.image && <img src={URL.createObjectURL(data.image)} alt="Preview" className="ae-preview"/>}
            </>}

            {step===3 && <>
              <label><FontAwesomeIcon icon={faFileLines}/> Required Documents</label>
              {["Aadhar Card","Resume","Marksheet","Photo"].map(d => (
                <div key={d} className="ae-doc-check">
                  <input type="checkbox" value={d} checked={data.required_docs.includes(d)} onChange={handleChange}/>
                  <label>{d}</label>
                </div>
              ))}
            </>}
          </div>

          {/* Footer */}
          <div className="ae-modal-footer">
            {step>0 && <button type="button" className="ae-btn-prev" onClick={handlePrev}><FontAwesomeIcon icon={faArrowLeft}/> Previous</button>}
            {step<totalSteps-1 && <button type="button" className="ae-btn-next" onClick={handleNext}>Next <FontAwesomeIcon icon={faArrowRight}/></button>}
            {step===totalSteps-1 && <button type="submit" className="ae-btn-submit"><FontAwesomeIcon icon={faPlusCircle}/> Add Event</button>}
          </div>

        </form>
      </div>
    </div>
  );
}
