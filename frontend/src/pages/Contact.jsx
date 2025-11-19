import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
  ProgressBar,
  Spinner,
} from "react-bootstrap";

import "../styles/Contact.css";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(10);

    try {
      const interval = setInterval(() => {
        setProgress((p) => (p < 90 ? p + 10 : p));
      }, 200);

      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      clearInterval(interval);
      setProgress(100);

      if (data.success) {
        setShowModal(true);
        setForm({ name: "", email: "", message: "" });
      } else {
        setAlert({
          show: true,
          message: "❌ " + data.error,
          variant: "danger",
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        message: "⚠️ Server Error. Try again later.",
        variant: "warning",
      });
    } finally {
      setTimeout(() => setProgress(0), 800);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (alert.show) {
      const t = setTimeout(() => setAlert({ show: false }), 4000);
      return () => clearTimeout(t);
    }
  }, [alert.show]);

  return (
    <section className="contact-section py-5">
      {alert.show && (
        <div className="position-fixed top-3 end-3 p-3" style={{ zIndex: 1050 }}>
          <div
            className="d-flex align-items-center rounded-3 shadow-sm p-3 text-white fw-semibold"
            style={{
              minWidth: "280px",
              background:
                alert.variant === "success"
                  ? "linear-gradient(135deg,#007bff,#6f42c1)"
                  : alert.variant === "danger"
                  ? "#dc3545"
                  : "#ffc107",
            }}
          >
            <i
              className={`fas ${
                alert.variant === "success"
                  ? "fa-check-circle"
                  : alert.variant === "danger"
                  ? "fa-times-circle"
                  : "fa-exclamation-triangle"
              } me-2`}
            ></i>
            <span>{alert.message}</span>
            <button
              className="btn-close btn-close-white ms-auto"
              onClick={() => setAlert({ show: false })}
            ></button>
          </div>
        </div>
      )}

      <Container>
        <div className="text-center mb-5">
          <h2 className="fw-bold text-light mb-2">
            <i className="fas fa-envelope-open-text me-2"></i> Let’s Connect
          </h2>
          <p className="text-light fs-5">
            Have an idea or event? Let’s make it happen together.
          </p>
          <hr className="w-25 mx-auto border-light opacity-75" />
        </div>

        {/* FIXED max width wrapper */}
        <div className="shadow-lg rounded-4 overflow-hidden mx-auto contact-card-wrapper">
          <Row className="g-0">
            {/* Left */}
            <Col md={5} className="p-4 text-white d-flex flex-column justify-content-between con-left">
              <div>
                <h4 className="fw-bold mb-3">
                  <i className="fas fa-headset me-2"></i> Contact Info
                </h4>
                <p className="opacity-75 mb-4">
                  Reach out for collaborations, partnerships, or event inquiries.
                </p>

                <div className="mb-3">
                  <h6 className="fw-bold mb-1">
                    <i className="fas fa-map-marker-alt me-2"></i> Address
                  </h6>
                  <p className="opacity-75 mb-0">123 Event Street, Mumbai</p>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold mb-1">
                    <i className="fas fa-phone-alt me-2"></i> Phone
                  </h6>
                  <p className="opacity-75 mb-0">+91 98765 43210</p>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold mb-1">
                    <i className="fas fa-envelope me-2"></i> Email
                  </h6>
                  <p className="opacity-75 mb-0">support@eventmanager.com</p>
                </div>
              </div>

              <div className="mt-4 rounded overflow-hidden shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11610093658!2d72.7410997924083!3d19.082197839262697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b63fef0f2b9b%3A0x3bcf3f9f6e7b45bb!2sMumbai!5e0!3m2!1sen!2sin!4v1691311234567"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="rounded-3"
                  title="map"
                ></iframe>
              </div>
            </Col>

            {/* Right */}
            <Col md={7} className="p-4 bg-white d-flex flex-column justify-content-center">
              <h4 className="fw-bold text-center text-gradient mb-4">
                <i className="fas fa-paper-plane me-2"></i> Send a Message
              </h4>
<Form onSubmit={handleSubmit} className="form-standardized">

  {/* Name */}
  <div className="form-input-group">
    <i className="fas fa-user form-icon"></i>
    <input
      type="text"
      name="name"
      placeholder="Full Name"
      value={form.name}
      onChange={handleChange}
      required
    />
  </div>

  {/* Email */}
  <div className="form-input-group">
    <i className="fas fa-envelope form-icon"></i>
    <input
      type="email"
      name="email"
      placeholder="Email"
      value={form.email}
      onChange={handleChange}
      required
    />
  </div>

  {/* Message */}
  <div className="form-input-group">
    <i className="fas fa-comment-dots form-icon"></i>
    <textarea
      name="message"
      placeholder="Your message"
      value={form.message}
      onChange={handleChange}
      required
    ></textarea>
  </div>

  {loading && (
    <ProgressBar
      now={progress}
      animated
      striped
      variant="primary"
      className="mb-3"
    />
  )}

  <button
    type="submit"
    className="btn btn-gradient w-100 py-2 shine-btn"
    disabled={loading}
  >
    {loading ? (
      <div className="spinner-border spinner-border-sm text-light"></div>
    ) : (
      <>
        <i className="fas fa-paper-plane me-2"></i> Send Message
      </>
    )}
  </button>
</Form>

            </Col>
          </Row>
        </div>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Modal.Body
          className="text-center p-5 rounded-4"
          style={{
            background: "linear-gradient(135deg, #007bff, #6f42c1)",
            color: "white",
          }}
        >
          <div className="mb-4">
            <i className="fas fa-check-circle fa-4x text-white"></i>
          </div>

          <h4 className="fw-bold mb-2">Message Sent Successfully!</h4>
          <p className="opacity-75 mb-4">Thank you! Our team will reach out soon 🚀</p>

          <Button
            variant="light"
            className="fw-semibold px-4 rounded-3 shadow-sm"
            onClick={() => setShowModal(false)}
          >
            <i className="fas fa-times me-2"></i> Close
          </Button>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default Contact;
