import React from "react";
import { useLocation } from "react-router-dom";

function RegisterDetails() {
  const location = useLocation();
  const { name, email, eventId } = location.state || {};

  return (
    <div className="container my-5">
      <h2>Registration Details</h2>

      <div className="mt-4">
        <h4>🎉 Welcome, {name}!</h4>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p className="text-muted">
          You have successfully registered for this event.
        </p>
      </div>
    </div>
  );
}

export default RegisterDetails;
