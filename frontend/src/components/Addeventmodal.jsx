import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select"; // modern select replacement
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
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    category: null,
    description: "",
    date: "",
    author: "",
    venue: "",
    fees: "",
    contact: "",
    image: null,
    required_docs: [],
  });

  useEffect(() => {
    if(isOpen) setCurrentStep(0); // reset on open
  }, [isOpen]);

  const handleNext = () => {
    if(validateStep(currentStep)) {
      if(currentStep < totalSteps - 1) setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => setCurrentStep(currentStep - 1);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if(type === "file") {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if(type === "checkbox") {
      setFormData(prev => {
        const docs = prev.required_docs.includes(value)
          ? prev.required_docs.filter(d => d !== value)
          : [...prev.required_docs, value];
        return {...prev, required_docs: docs };
      });
    } else setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (selectedOption) => {
    setFormData(prev => ({ ...prev, category: selectedOption }));
  };

  const validateStep = (step) => {
    let msg = "";
    if(step === 0) {
      if(!formData.title) msg = "Please enter event title";
      else if(!formData.category) msg = "Please select category";
      else if(!formData.date) msg = "Please select date";
    } else if(step === 1) {
      if(!formData.author) msg = "Author/Organizer required";
      else if(!formData.venue) msg = "Venue required";
      else if(!formData.fees || isNaN(formData.fees)) msg = "Fees must be a number";
      else if(!/^\d{10}$/.test(formData.contact)) msg = "Contact must be 10 digits";
    } else if(step === 2 && !formData.image) {
      msg = "Please upload an image";
    }

    if(msg) {
      Swal.fire({ icon: "error", title: "Validation Error", text: msg, confirmButtonColor: "#0d6efd" });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(validateStep(currentStep)) onSubmit(formData);
  };

  const progressPercent = ((currentStep + 1)/totalSteps) * 100;

  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-dialog">
          <form className="modal-content glass-card" onSubmit={handleSubmit}>

            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">
                {currentStep === totalSteps - 1 ? "Add Event - Final Step" : "Add New Event"}
              </h5>
              <button type="button" className="close-btn" onClick={onClose}>×</button>
            </div>

            {/* Progress */}
            <div className="progress-wrapper">
              <span className="progress-text">{`Step ${currentStep+1} of ${totalSteps}`}</span>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>

            {/* Step Content */}
            <div className="modal-body">
              {currentStep === 0 && (
                <>
                  <label className="form-label"><FontAwesomeIcon icon={faHeading}/> Event Title *</label>
                  <input name="title" value={formData.title} onChange={handleChange} className="form-control" placeholder="Event Title"/>
                  
                  <label className="form-label mt-2"><FontAwesomeIcon icon={faTags}/> Category *</label>
                  <Select
                    options={categories}
                    value={formData.category}
                    onChange={handleCategoryChange}
                    placeholder="Select category"
                  />

                  <label className="form-label mt-2"><FontAwesomeIcon icon={faAlignLeft}/> Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows="3"/>
                  
                  <label className="form-label mt-2"><FontAwesomeIcon icon={faCalendarDays}/> Date *</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-control"/>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <label className="form-label"><FontAwesomeIcon icon={faUser}/> Author/Organizer *</label>
                  <input name="author" value={formData.author} onChange={handleChange} className="form-control" placeholder="Organizer"/>
                  
                  <label className="form-label mt-2"><FontAwesomeIcon icon={faLocationDot}/> Venue *</label>
                  <input name="venue" value={formData.venue} onChange={handleChange} className="form-control"/>
                  
                  <label className="form-label mt-2"><FontAwesomeIcon icon={faMoneyBillWave}/> Fees *</label>
                  <input name="fees" value={formData.fees} onChange={handleChange} className="form-control"/>
                  
                  <label className="form-label mt-2"><FontAwesomeIcon icon={faPhone}/> Contact *</label>
                  <input name="contact" value={formData.contact} onChange={handleChange} className="form-control"/>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <label className="form-label"><FontAwesomeIcon icon={faImage}/> Upload Image *</label>
                  <input type="file" name="image" onChange={handleChange} className="form-control"/>
                  {formData.image && <img src={URL.createObjectURL(formData.image)} alt="Preview" className="preview-img"/>}
                </>
              )}

              {currentStep === 3 && (
                <>
                  <label className="form-label"><FontAwesomeIcon icon={faFileLines}/> Required Documents</label>
                  {["Aadhar Card","Resume","Marksheet","Photo"].map(doc => (
                    <div key={doc} className="form-check">
                      <input className="form-check-input" type="checkbox" value={doc} checked={formData.required_docs.includes(doc)} onChange={handleChange}/>
                      <label className="form-check-label">{doc}</label>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer">
              {currentStep > 0 && <button type="button" className="btn btn-prev" onClick={handlePrev}><FontAwesomeIcon icon={faArrowLeft}/> Previous</button>}
              {currentStep < totalSteps - 1 && <button type="button" className="btn btn-next" onClick={handleNext}>Next <FontAwesomeIcon icon={faArrowRight}/></button>}
              {currentStep === totalSteps -1 && <button type="submit" className="btn btn-submit"><FontAwesomeIcon icon={faPlusCircle}/> Add Event</button>}
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default Addeventmodal;
