import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaEnvelope,
  FaArrowRight,
  FaArrowLeft,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";

export default function RegisterModal({ show, handleClose, eventId }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailChecked) {
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:5000/api/register/check-email",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, event_id: eventId }),
          }
        );
        const data = await res.json();

        if (data.status === "found") {
          const userName = data.data[0].name;
          handleClose();

          return navigate("/register-details", {
            state: {
              name: userName,
              email,
              eventId,
              registered_at: data.data[0].registered_at,
            },
          });
        }

        setIsEmailChecked(true);
      } catch (error) {
        console.error("Error checking email:", error);
      } finally {
        setLoading(false);
      }
    } else {
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

          Swal.fire({
            icon: "success",
            title: "Registration Successful 🎉",
            text: "Redirecting to details page...",
            showConfirmButton: false,
            timer: 2000,
          });

          setTimeout(() => {
            handleClose();
            navigate("/register-details", {
              state: {
                name: userName,
                email,
                eventId,
                registered_at: data.data.registered_at,
              },
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
  const handlePrevious = () => {
    setIsEmailChecked(false);
    setName("");
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Form onSubmit={handleSubmit} className="rounded-4 shadow-sm">
        {/* Header */}
        <div className="modal-header bg-primary text-white rounded-top">
          <h5 className="modal-title fw-bold d-flex align-items-center gap-2 ms-2">
            {" "}
            <FaUserPlus className="text-light" />
            Register Here         
          </h5>
          <Button
            variant="close"
            onClick={handleClose}
            className="btn-close-white"
          ></Button>
        </div>

        {/* Body */}
        <Modal.Body className="px-4">
          {/* Email */}
          {!isEmailChecked && (
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold d-flex align-items-center gap-2">
                <FaEnvelope className="text-primary" />
                Email
              </Form.Label>

              <Form.Control
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
          )}

          {/* Name */}
          {isEmailChecked && (
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold d-flex align-items-center gap-2">
                <FaUser className="text-primary" /> Name
              </Form.Label>
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

        {/* Footer */}
        <Modal.Footer>
          <div className="d-flex justify-content-end gap-2 w-100">
            {/* Cancel / Previous */}
            {!isEmailChecked ? (
              <Button
                variant="outline-secondary"
                type="button"
                onClick={handleClose}
                className="rounded-pill px-3"
              >
                Cancel
              </Button>
            ) : (
              <Button
                variant="outline-secondary"
                type="button"
                onClick={handlePrevious}
                className="rounded-pill px-3"
              >
                <FaArrowLeft className="me-2" />
                Previous
              </Button>
            )}

            {/* Next / Submit */}
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="rounded-pill px-3"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processing...
                </>
              ) : isEmailChecked ? (
                "Submit"
              ) : (
                <>
                  Next <FaArrowRight className="ms-2 text-light" />
                </>
              )}
            </Button>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
