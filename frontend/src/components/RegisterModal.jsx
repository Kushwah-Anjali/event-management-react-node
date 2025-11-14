import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function RegisterModal({ show, handleClose, eventId }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ we use this instead of window.location.href

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isEmailChecked) {
    // ✅ Step 1: Check if email exists
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/register/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, event_id: eventId }),
      });
      const data = await res.json();

      if (data.status === "found") {
        // ✅ Directly redirect if already registered
        const userName = data.data[0].name;
        handleClose();
        return navigate("/register-details", {  state: { 
    name: userName, 
    email, 
    eventId,
    registered_at: data.data[0].registered_at   // ⬅ ADD THIS
  },});
      }

      // ✅ If not found, move to next step (ask for name)
      setIsEmailChecked(true);
    } catch (error) {
      console.error("Error checking email:", error);
    } finally {
      setLoading(false);
    }
  } else {
    // ✅ Step 2: Register new user if not already
    let userName = name;

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/register/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId, name, email }),
      });
      const data = await res.json();

      if (data.status === "success") {
        userName = data.data.name;

        // ✅ Show SweetAlert success popup
        Swal.fire({
          icon: "success",
          title: "Registration Successful 🎉",
          text: "Redirecting to details page...",
          showConfirmButton: false,
          timer: 2000, // 2 seconds
        });

        // ✅ Close modal and redirect after short delay
        setTimeout(() => {
          handleClose();
          navigate("/register-details", {
            state: { name: userName, email, eventId,registered_at: data.data.registered_at   },
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed 😢",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
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
