// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import Swal from "sweetalert2";
import "../styles/login.css"; // importing your custom CSS
import Footer from "../components/Footer";
const Login = () => {
  // -----------------------------
  // 🧠 State variables
  // -----------------------------
  const [email, setEmail] = useState(""); // stores what user types in email field
  const [password, setPassword] = useState(""); // stores password input
  const [loading, setLoading] = useState(false); // to show loading spinner while login

  const navigate = useNavigate(); // helps to move to another page after login

  // -----------------------------
  // 🚀 Function when form is submitted
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault(); // stops page refresh (default form behavior)
    setLoading(true); // shows spinner

    try {
      // calling backend API via helper function
      const data = await loginUser({ email, password });

      if (data.status === "success") {
        // store token and user info in browser (to remember logged-in user)
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        await Swal.fire({
          icon: "success",
          title: "Welcome!",
          text: `Hey ${data.user.name}, glad to see you!`,
          timer: 1500,
          showConfirmButton: false,
        });

        // redirect based on role
        if (data.user.role === "root") {
          navigate("/users");
        } else {
          navigate("/events");
        }
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.response?.data?.message || "Please check your email or password.",
      });
    } finally {
      setLoading(false); // stop spinner
    }
  };

  // -----------------------------
  // 🧱 JSX (HTML-like structure)
  // -----------------------------
  return (
   <div className="login-wrapper">
  {/* Card container centers only the login card */}
  <div className="login-card-container">
    <div className="card login-card shadow-lg">
      {/* App Logo */}
      <div className="text-center mb-3">
        <img src="/logo.svg" alt="App Logo" className="login-logo" />
      </div>

      {/* Title */}
      <h4 className="fw-bold text-center text-gradient mb-4">
        <i className="fas fa-right-to-bracket me-2"></i> Sign In
      </h4>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <span className="input-group-text bg-light">
            <i className="fas fa-envelope"></i>
          </span>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
          />
        </div>

        <div className="input-group mb-4">
          <span className="input-group-text bg-light">
            <i className="fas fa-lock"></i>
          </span>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className="btn btn-gradient w-100" disabled={loading}>
          {loading ? (
            <div className="spinner-border spinner-border-sm text-light" role="status"></div>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  </div>

  {/* Footer now sticks at the bottom */}
  <Footer />
</div>

  );
};

export default Login;
