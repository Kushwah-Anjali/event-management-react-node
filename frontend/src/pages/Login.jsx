// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // for redirecting
import axios from "axios";
import "../styles/login.css"; // your existing CSS
import Swal from "sweetalert2"; // for nice alerts

const Login = () => {
  // -----------------------------
  // Step 1: State for form inputs
  // -----------------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // show spinner while API call

  const navigate = useNavigate(); // used to redirect after login

  // -----------------------------
  // Step 2: Handle form submission
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page refresh
    setLoading(true);

    try {
      // POST to Node backend
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (response.data.status === "success") {
        // Save JWT in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Show success alert
        await Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome ${response.data.user.name}!`,
          timer: 1500,
          showConfirmButton: false,
        });

        // Redirect based on role (like your PHP version)
        if (response.data.user.role === "root") {
          navigate("/users"); // React route for admin
        } else {
          navigate("/events"); // React route for regular users
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.response?.data?.message || "Invalid credentials",
      });
    } finally {
      setLoading(false); // stop loading spinner
    }
  };

  return (
    <div className="login-wrapper">
      <div className="card login-card">
        <h4 className="fw-bold text-center">
          <i className="fas fa-right-to-bracket me-1"></i> Login
        </h4>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="fas fa-envelope"></i>
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="input-group mb-4">
            <span className="input-group-text">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
