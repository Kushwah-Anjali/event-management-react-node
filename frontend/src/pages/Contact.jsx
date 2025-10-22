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
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 200);

      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      clearInterval(progressInterval);
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
      setTimeout(() => setProgress(0), 1000);
      setLoading(false);
    }
  };

  // Auto-hide alert
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => setAlert({ show: false }), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  return (
    <section
      id="contact"
      className="py-5"
      style={{ background: "linear-gradient(180deg,#f8f9fa,#e9ecef)" }}
    >
      {/* Top-right alert */}
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
                  ? "fa-check-circle me-2"
                  : alert.variant === "danger"
                  ? "fa-times-circle me-2"
                  : "fa-exclamation-triangle me-2"
              }`}
            ></i>
            <span>{alert.message}</span>
            <button
              type="button"
              className="btn-close btn-close-white ms-auto"
              aria-label="Close"
              onClick={() => setAlert({ show: false })}
              style={{ opacity: 0.8 }}
            ></button>
          </div>
        </div>
      )}

      <Container>
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-primary mb-2">
            <i className="fas fa-envelope-open-text me-2"></i> Let’s Connect
          </h2>
          <p className="text-secondary fs-5">
            Have an idea or event? Let’s make it happen together.
          </p>
          <hr className="w-25 mx-auto border-primary opacity-75" />
        </div>

        {/* Unified Contact Section */}
        <div className="shadow-lg rounded-4 overflow-hidden">
          <Row className="g-0">
            {/* Left: Info + Map */}
            <Col md={5} className="p-4 bg-primary text-white d-flex flex-column justify-content-between">
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
                  <p className="mb-0 opacity-75">123 Event Street, Mumbai, India</p>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold mb-1">
                    <i className="fas fa-phone-alt me-2"></i> Phone
                  </h6>
                  <p className="mb-0 opacity-75">+91 98765 43210</p>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold mb-1">
                    <i className="fas fa-envelope me-2"></i> Email
                  </h6>
                  <p className="mb-0 opacity-75">support@eventmanager.com</p>
                </div>
              </div>

              {/* Map */}
              <div className="mt-4 rounded overflow-hidden shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11610093658!2d72.7410997924083!3d19.082197839262697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b63fef0f2b9b%3A0x3bcf3f9f6e7b45bb!2sMumbai!5e0!3m2!1sen!2sin!4v1691311234567"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="map"
                  className="rounded-3"
                ></iframe>
              </div>
            </Col>

            {/* Right: Form */}
            <Col md={7} className="p-5 bg-white d-flex flex-column justify-content-center">
              <h4 className="fw-bold text-dark mb-4 text-center">
                <i className="fas fa-paper-plane me-2 text-primary"></i> Send a Message
              </h4>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="form-floating mb-3">
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="rounded-3"
                  />
                  <Form.Label>
                    <i className="fas fa-user me-2 text-primary"></i> Full Name
                  </Form.Label>
                </Form.Group>

                <Form.Group className="form-floating mb-3">
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="rounded-3"
                  />
                  <Form.Label>
                    <i className="fas fa-envelope me-2 text-primary"></i> Email
                  </Form.Label>
                </Form.Group>

                <Form.Group className="form-floating mb-4">
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    placeholder="Message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="rounded-3"
                    style={{ height: "120px" }}
                  />
                  <Form.Label>
                    <i className="fas fa-comment-dots me-2 text-primary"></i> Message
                  </Form.Label>
                </Form.Group>

                {loading && (
                  <ProgressBar
                    now={progress}
                    animated
                    striped
                    variant="primary"
                    className="mb-3"
                  />
                )}

                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="fw-semibold rounded-3 py-2 shadow-sm"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          className="me-2"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i> Send Message
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </div>
      </Container>

      {/* Success Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Modal.Body
          className="text-center p-5 rounded-4"
          style={{
            background: "linear-gradient(135deg, #007bff, #6f42c1)",
            color: "white",
          }}
        >
          <div className="mb-4">
            <i
              className="fas fa-check-circle fa-4x text-white"
              style={{ textShadow: "0 0 10px rgba(255,255,255,0.6)" }}
            ></i>
          </div>

          <h4 className="fw-bold mb-2">Message Sent Successfully!</h4>
          <p className="opacity-75 mb-4">
            Thank you for reaching out. Our team will get in touch soon 🚀
          </p>

          <Button
            variant="light"
            onClick={() => setShowModal(false)}
            className="fw-semibold px-4 rounded-3 shadow-sm"
          >
            <i className="fas fa-times me-2"></i> Close
          </Button>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default Contact;
