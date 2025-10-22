import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setAlert({
          show: true,
          message: "✅ Message sent successfully! We’ll reach you soon.",
          variant: "success",
        });
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
    }
  };

  return (
    <section className="py-5 bg-light" id="contact">
      <Container>
        <h2 className="text-center mb-3 fw-bold text-primary">
          📩 Get in Touch
        </h2>
        <p className="text-center text-muted mb-5">
          We’d love to hear from you! Drop us a message and we’ll connect ASAP.
        </p>

        <Row className="g-4">
          <Col md={6}>
            <div className="bg-white p-4 rounded shadow-sm">
              {alert.show && (
                <Alert variant={alert.variant}>{alert.message}</Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="example@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    placeholder="Write your message..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 fw-semibold"
                >
                  Send Message
                </Button>
              </Form>
            </div>
          </Col>

          <Col md={6}>
            <div className="bg-white p-4 rounded shadow-sm">
              <h5>📍 Our Office</h5>
              <p>123 Event Street, Mumbai, India</p>

              <h5>📞 Phone</h5>
              <p>+91 98765 43210</p>

              <h5>📧 Email</h5>
              <p>support@eventmanager.com</p>

              <div className="mt-3 rounded overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11610093658!2d72.7410997924083!3d19.082197839262697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b63fef0f2b9b%3A0x3bcf3f9f6e7b45bb!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1691311234567"
                  width="100%"
                  height="220"
                  style={{ border: "0" }}
                  allowFullScreen
                  loading="lazy"
                  title="map"
                ></iframe>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Contact;
