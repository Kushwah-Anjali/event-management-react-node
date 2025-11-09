import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function RegisterModal({ show, handleClose, eventId, onSubmit }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isEmailChecked) {
    // Step 1: Check email
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/register/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, event_id: eventId }),
      });
      const data = await res.json();

      if (data.status === "found") {
        setAlreadyRegistered(true);
        setName(data.data[0].name);
      }
      setIsEmailChecked(true);
    } catch (error) {
      console.error("Error checking email:", error);
    } finally {
      setLoading(false);
    }
  } else {
    // Step 2: Register user
    if (!alreadyRegistered) {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/register/new", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event_id: eventId, name, email }),
        });
        const data = await res.json();

        if (data.status === "success") {
          alert("Registration successful!");
        }
      } catch (error) {
        console.error("Error registering user:", error);
      } finally {
        setLoading(false);
      }
    }
  handleClose();
    // ✅ Redirect for both cases
    window.location.href = `/event/${eventId}?email=${email}`;
  
  }
};


  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form onSubmit={handleSubmit} className="p-3 rounded-3 shadow-sm">
        <div className="modal-header bg-primary text-white rounded-top">
          <h5 className="modal-title">
            <i className="bi bi-calendar-plus me-2"></i> Register Here
          </h5>
          <Button variant="close" onClick={handleClose} className="btn-close-white"></Button>
        </div>

        <Modal.Body>
          {alreadyRegistered && (
            <div className="p-3 border border-success rounded-3 bg-light shadow-sm mb-3">
              <div className="d-flex align-items-center text-success mb-2">
                <i className="bi bi-check-circle-fill fs-4 me-2"></i>
                <h6 className="mb-0">You are already registered!</h6>
              </div>
              <hr className="my-2" />
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Email:</strong> {email}</p>
            </div>
          )}

          {!isEmailChecked && (
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
          )}

          {isEmailChecked && !alreadyRegistered && (
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Processing..." : isEmailChecked ? "Submit" : "Next"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
