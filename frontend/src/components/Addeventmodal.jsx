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

const Addeventmodal = ({ isOpen, onClose, onSubmit, categories }) => {
  const totalSteps = steps.length;
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    title: "", category: null, description: "", date: "",
    author: "", venue: "", fees: "", contact: "",
    image: null, required_docs: [],
  });

  useEffect(() => { if(isOpen) setStep(0); }, [isOpen]);

  const handleNext = () => { if(validate(step) && step < totalSteps - 1) setStep(s => s + 1); };
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

  const validate = s => {
    let msg = "";
    if(s === 0 && (!data.title || !data.category || !data.date)) msg = "Please fill all required fields";
    else if(s === 1 && (!data.author || !data.venue || !data.fees || isNaN(data.fees) || !/^\d{10}$/.test(data.contact))) msg = "Check details: author, venue, fees, contact";
    else if(s === 2 && !data.image) msg = "Please upload an image";

    if(msg) { Swal.fire({ icon: "error", title: "Error", text: msg, confirmButtonColor: "#0d6efd" }); return false; }
    return true;
  };

  const handleSubmit = e => { e.preventDefault(); if(validate(step)) onSubmit(data); };

  const progress = ((step + 1) / totalSteps) * 100;

  if(!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalBox">
        <form className="modalCard" onSubmit={handleSubmit}>
          
          {/* Header */}
          <div className="modalHead">
            <h5>{step === totalSteps-1 ? "Add Event - Final Step" : "Add New Event"}</h5>
            <button type="button" className="btnClose" onClick={onClose}>×</button>
          </div>

          {/* Progress */}
          <div className="progressWrapper">
            <span className="progressText">{`Step ${step+1} of ${totalSteps}`}</span>
            <div className="progressBarBg">
              <div className="progressBarFill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Body */}
          <div className="modalBody">
            {step === 0 && <>
              <label><FontAwesomeIcon icon={faHeading}/> Event Title *</label>
              <input name="title" value={data.title} onChange={handleChange} className="inputField" placeholder="Event Title"/>
              
              <label className="mt2"><FontAwesomeIcon icon={faTags}/> Category *</label>
              <Select options={categories} value={data.category} onChange={handleCategoryChange} placeholder="Select category" />

              <label className="mt2"><FontAwesomeIcon icon={faAlignLeft}/> Description</label>
              <textarea name="description" value={data.description} onChange={handleChange} className="inputField" rows="3"/>

              <label className="mt2"><FontAwesomeIcon icon={faCalendarDays}/> Date *</label>
              <input type="date" name="date" value={data.date} onChange={handleChange} className="inputField"/>
            </>}

            {step === 1 && <>
              <label><FontAwesomeIcon icon={faUser}/> Author/Organizer *</label>
              <input name="author" value={data.author} onChange={handleChange} className="inputField" placeholder="Organizer"/>
              
              <label className="mt2"><FontAwesomeIcon icon={faLocationDot}/> Venue *</label>
              <input name="venue" value={data.venue} onChange={handleChange} className="inputField"/>

              <label className="mt2"><FontAwesomeIcon icon={faMoneyBillWave}/> Fees *</label>
              <input name="fees" value={data.fees} onChange={handleChange} className="inputField"/>

              <label className="mt2"><FontAwesomeIcon icon={faPhone}/> Contact *</label>
              <input name="contact" value={data.contact} onChange={handleChange} className="inputField"/>
            </>}

            {step === 2 && <>
              <label><FontAwesomeIcon icon={faImage}/> Upload Image *</label>
              <input type="file" name="image" onChange={handleChange} className="inputField"/>
              {data.image && <img src={URL.createObjectURL(data.image)} alt="Preview" className="previewImg"/>}
            </>}

            {step === 3 && <>
              <label><FontAwesomeIcon icon={faFileLines}/> Required Documents</label>
              {["Aadhar Card","Resume","Marksheet","Photo"].map(d => (
                <div key={d} className="docCheck">
                  <input type="checkbox" value={d} checked={data.required_docs.includes(d)} onChange={handleChange}/>
                  <label>{d}</label>
                </div>
              ))}
            </>}
          </div>

          {/* Footer */}
          <div className="modalFoot">
            {step>0 && <button type="button" className="btnPrev" onClick={handlePrev}><FontAwesomeIcon icon={faArrowLeft}/> Previous</button>}
            {step<totalSteps-1 && <button type="button" className="btnNext" onClick={handleNext}>Next <FontAwesomeIcon icon={faArrowRight}/></button>}
            {step===totalSteps-1 && <button type="submit" className="btnSubmit"><FontAwesomeIcon icon={faPlusCircle}/> Add Event</button>}
          </div>

        </form>
      </div>
    </div>
  );
};

export default Addeventmodal;
