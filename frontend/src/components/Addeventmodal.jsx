import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faPlusCircle,
  faCheckCircle,
  faHeading,
  faTags,
  faAlignLeft,
  faCalendarDays,
  faUser,
  faLocationDot,
  faMoneyBillWave,
  faPhone,
  faImage,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";
import { EventCategory } from "./EventCategory";
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `http://localhost:5000/events/${imagePath}`;
};


const steps = ["Basic Info", "Details", "Image", "Documents"];

export default function AddEventModal({
  isOpen,
  onClose,
  onSubmit,
  existingData,
  isEditing,
}) {
  const totalSteps = steps.length;

  const [step, setStep] = useState(0);
  const [data, setData] = useState({
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
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setStep(0);

      if (isEditing && existingData) {
        const matchedCategory = EventCategory.find(
          (c) =>
            c.value.toLowerCase() === existingData.category?.toLowerCase() ||
            c.label.toLowerCase() === existingData.category?.toLowerCase()
        );

        setData({
          title: existingData.title || "",
          category: matchedCategory || null, // ✅ Correct category format for react-select
          description: existingData.description || "",
          date: existingData.date ? existingData.date.split("T")[0] : "",
          author: existingData.author || "",
          venue: existingData.venue || "",
          fees: existingData.fees || "",
          contact: existingData.contact || "",
         image: existingData.image || null,  // no auto-load for file input
          required_docs: Array.isArray(existingData.required_documents)
            ? existingData.required_documents
            : [],
        });
        if (existingData.image) {
           setPreview(getFullImageUrl(existingData.image)); 
        } else {
          setPreview(null);
        }
      } else {
        setData({
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
      }

      setErrors({});
    }
  }, [isOpen, existingData, isEditing]);

  const handleChange = (e) => {
    const { name, value, files, checked } = e.target;
    let updatedValue = value;

    switch (name) {
      case "fees":
        updatedValue = value.replace(/\D/g, "");
        setErrors((prev) => ({
          ...prev,
          fees: updatedValue ? "" : "Enter numeric value",
        }));
        break;
      case "contact":
        updatedValue = value.replace(/\D/g, "").slice(0, 10);
        setErrors((prev) => ({
          ...prev,
          contact:
            updatedValue.length > 0 && updatedValue.length < 10
              ? "Must be 10 digits"
              : "",
        }));
        break;
      case "author":
      case "venue":
        updatedValue = value.replace(/[^a-zA-Z\s]/g, "");
        setErrors((prev) => ({
          ...prev,
          [name]: updatedValue ? "" : "Only letters allowed",
        }));
        break;
      case "date":
        const today = new Date().toISOString().split("T")[0];
        setErrors((prev) => ({
          ...prev,
          date: value < today ? "Cannot select past date" : "",
        }));
        break;
      case "image":
        if (files[0]) {
          const file = files[0];
          const validTypes = ["image/jpeg", "image/png"];
          if (!validTypes.includes(file.type))
            setErrors((prev) => ({ ...prev, image: "Only JPG/PNG allowed" }));
          else if (file.size > 2 * 1024 * 1024)
            setErrors((prev) => ({ ...prev, image: "Max size 2MB" }));
          else setErrors((prev) => ({ ...prev, image: "" }));
          setPreview(URL.createObjectURL(file));
          updatedValue = file;
        } else {
    // ✅ no new file selected — retain old image + preview
    updatedValue = data.image || "";
    if (data.image) setPreview(getFullImageUrl(data.image));
  }
        break;
      case "required_docs":
        setData((d) => {
          let docs = d.required_docs;
          if (checked) {
            if (docs.length >= 4) {
              Swal.fire({
                icon: "warning",
                title: "Limit reached",
                text: "Max 4 documents allowed",
                confirmButtonColor: "#0d6efd",
              });
              return d;
            }
            docs = [...docs, value];
          } else docs = docs.filter((v) => v !== value);
          return { ...d, required_docs: docs };
        });
        return;
      default:
        break;
    }

    setData((d) => ({ ...d, [name]: updatedValue }));
  };

  const handleCategoryChange = (opt) => {
    setData((d) => ({ ...d, category: opt }));
    setErrors((prev) => ({ ...prev, category: "" }));
  };

  const validateStep = (s) => {
    if (s === 0)
      return (
        data.title &&
        data.category &&
        data.date &&
        !errors.title &&
        !errors.date
      );
    if (s === 1)
      return (
        data.author &&
        data.venue &&
        data.fees &&
        data.contact &&
        !errors.author &&
        !errors.venue &&
        !errors.fees &&
        !errors.contact
      );
  if (s === 2) return (data.image || preview) && !errors.image;

    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };
  const handlePrev = () => setStep((s) => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(step)) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fix the highlighted fields.",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", data.category?.label || "");
    formData.append("description", data.description);
    formData.append("date", data.date);
    formData.append("author", data.author);
    formData.append("venue", data.venue);
    formData.append("fees", data.fees);
    formData.append("contact", data.contact);
 if (data.image instanceof File) {
  // New image selected
  formData.append("image", data.image);
} else if (isEditing && data.image) {
  // Keep the old image path if no new file
  formData.append("existingImage", data.image);
}


    // Backend expects an array of docs
    data.required_docs.forEach((doc) =>
      formData.append("required_docs[]", doc)
    );

    onSubmit(formData);
  };

  if (!isOpen) return null;

  const renderCheckIcon = (field) =>
    !errors[field] && data[field] ? (
      <FontAwesomeIcon icon={faCheckCircle} className="text-success ms-2" />
    ) : null;

  return (
    <div
      className="modal show d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        transition: "opacity 0.25s ease",
      }}
    >
      <div
        className="modal-dialog d-flex flex-column"
        style={{ width: "100%", maxWidth: "550px", maxHeight: "90vh" }}
      >
        <form
          className="modal-content shadow rounded-4 d-flex flex-column"
          style={{ flex: 1, overflow: "hidden" }}
          onSubmit={handleSubmit}
        >
          {/* Header */}
          <div className="modal-header flex-column align-items-start border-0 px-4 pt-4 pb-2">
            <h5 className="fw-bold d-flex align-items-center gap-2">
              <FontAwesomeIcon
                icon={isEditing ? faCheckCircle : faPlusCircle}
                className={isEditing ? "text-warning" : "text-primary"}
              />{" "}
              {isEditing ? "Update Event" : "Add Event"}
            </h5>

            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-3"
              onClick={onClose}
            ></button>
          </div>

          {/* Progress Dots */}
          <div className="px-4 mb-3 d-flex justify-content-center">
            {steps.map((_, i) => (
              <div
                key={i}
                style={{
                  width: step === i ? 20 : 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: step === i ? "#0d6efd" : "#ddd",
                  margin: "0 5px",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          {/* Body */}
          <div
            className="modal-body px-4 flex-grow-1"
            style={{ overflowY: "auto" }}
          >
            {step === 0 && (
              <>
                <label className="form-label fw-semibold">
                  <FontAwesomeIcon
                    icon={faHeading}
                    className="me-2 text-primary"
                  />{" "}
                  Event Title *
                </label>
                <div className="d-flex align-items-center mb-3">
                  <input
                    name="title"
                    value={data.title}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.title ? "is-invalid" : ""
                    }`}
                    placeholder="Event Title"
                  />
                  {renderCheckIcon("title")}
                </div>

                <label className="form-label fw-semibold">
                  <FontAwesomeIcon
                    icon={faTags}
                    className="me-2 text-primary"
                  />{" "}
                  Category *
                </label>
                <Select
                  options={EventCategory}
                  value={data.category} // ✅ now this will always be the right object
                  onChange={handleCategoryChange}
                  placeholder="Select category"
                  className="mb-3"
                />

                <label className="form-label fw-semibold">
                  <FontAwesomeIcon
                    icon={faAlignLeft}
                    className="me-2 text-primary"
                  />{" "}
                  Description
                </label>
                <textarea
                  name="description"
                  value={data.description}
                  onChange={handleChange}
                  className="form-control mb-3"
                  rows="3"
                />

                <label className="form-label fw-semibold">
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    className="me-2 text-primary"
                  />{" "}
                  Date *
                </label>
                <div className="d-flex align-items-center mb-3">
                  <input
                    type="date"
                    name="date"
                    value={data.date}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.date ? "is-invalid" : ""
                    }`}
                  />
                  {renderCheckIcon("date")}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <label className="form-label fw-semibold">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="me-2 text-primary"
                  />{" "}
                  Organizer *
                </label>
                <div className="d-flex align-items-center mb-3">
                  <input
                    name="author"
                    value={data.author}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.author ? "is-invalid" : ""
                    }`}
                    placeholder="Organizer"
                  />
                  {renderCheckIcon("author")}
                </div>

                <label className="form-label fw-semibold">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="me-2 text-primary"
                  />{" "}
                  Venue *
                </label>
                <div className="d-flex align-items-center mb-3">
                  <input
                    name="venue"
                    value={data.venue}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.venue ? "is-invalid" : ""
                    }`}
                  />
                  {renderCheckIcon("venue")}
                </div>

                <label className="form-label fw-semibold">
                  <FontAwesomeIcon
                    icon={faMoneyBillWave}
                    className="me-2 text-primary"
                  />{" "}
                  Fees *
                </label>
                <div className="d-flex align-items-center mb-3">
                  <input
                    name="fees"
                    value={data.fees}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.fees ? "is-invalid" : ""
                    }`}
                    placeholder="Enter amount"
                  />
                  {renderCheckIcon("fees")}
                </div>

                <label className="form-label fw-semibold">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="me-2 text-primary"
                  />{" "}
                  Contact *
                </label>
                <div className="d-flex align-items-center mb-3">
                  <input
                    name="contact"
                    value={data.contact}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.contact ? "is-invalid" : ""
                    }`}
                    placeholder="10-digit mobile"
                  />
                  {renderCheckIcon("contact")}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <label className="form-label fw-semibold">
                  <FontAwesomeIcon
                    icon={faImage}
                    className="me-2 text-primary"
                  />{" "}
                  Upload Image *
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="form-control mb-2"
                />
                {errors.image && (
                  <div className="text-danger small mt-1">{errors.image}</div>
                )}
                {preview && (
                  <div className="mt-2">
                    <img
                      src={preview}
                      alt="Event preview"
                      className="img-thumbnail"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <label className="form-label fw-semibold">
                  <FontAwesomeIcon
                    icon={faFileLines}
                    className="me-2 text-primary"
                  />{" "}
                  Required Documents
                </label>
                <div className="d-flex flex-wrap gap-3 mt-2">
                  {["Aadhar Card", "Resume", "Marksheet", "Photo"].map((d) => (
                    <div key={d} className="form-check">
                      <input
                        type="checkbox"
                        name="required_docs"
                        value={d}
                        checked={data.required_docs.includes(d)}
                        onChange={handleChange}
                        className="form-check-input"
                        id={d}
                      />
                      <label className="form-check-label" htmlFor={d}>
                        {d}
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="modal-footer px-4 pb-4 flex-wrap gap-2">
            {step > 0 && (
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill px-4"
                onClick={handlePrev}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Previous
              </button>
            )}
            {step < totalSteps - 1 && (
              <button
                type="button"
                className="btn btn-primary rounded-pill px-4"
                onClick={handleNext}
                disabled={!validateStep(step)}
              >
                Next <FontAwesomeIcon icon={faArrowRight} />
              </button>
            )}
            {step === totalSteps - 1 && (
              <button
                type="submit"
                className={`btn ${
                  isEditing ? "btn-warning" : "btn-success"
                } rounded-pill px-4`}
              >
                <FontAwesomeIcon icon={faPlusCircle} />{" "}
                {isEditing ? "Update Event" : "Add Event"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
