import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/login.css"; // minimal styles

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        await Swal.fire({
          icon: "success",
          title: "Welcome!",
          text: `Hey ${data.user.name}, glad to see you!`,
          timer: 1500,
          showConfirmButton: false,
        });

        navigate(data.user.role === "root" ? "/users" : "/events");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.response?.data?.message || "Invalid credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper d-flex justify-content-center align-items-center">
      <div className="card shadow-lg p-4 p-md-5 border-0 glass-card" style={{ maxWidth: "400px" }}>
        <h4 className="fw-bold text-center text-gradient mb-4">
          <i className="fas fa-right-to-bracket me-2"></i> Sign In
        </h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 input-group rounded border overflow-hidden">
            <span className="input-group-text bg-light border-0 text-purple">
              <i className="fas fa-envelope"></i>
            </span>
            <input
              type="email"
              className="form-control border-0 bg-light"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
                autoComplete="off" 
            />
          </div>

          <div className="mb-4 input-group rounded border overflow-hidden">
            <span className="input-group-text bg-light border-0 text-purple">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              className="form-control border-0 bg-light"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              
            />
          </div>

          <button
            type="submit"
            className="btn btn-gradient w-100 py-2 shine-btn"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm text-light" role="status"></div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
