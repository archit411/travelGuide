import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./Auth.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    msisdn: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/api/login?msisdn=${formData.msisdn}&password=${formData.password}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (data.errorCode === "100") {
        // Successful login → redirect to Dashboard with username
        navigate("/homepage", { state: { username: data.userName } });
      } else if (data.errorCode === "106") {
        // Error → show popup
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.errorMsg,
          confirmButtonColor: "#d33",
          background: "#fff8f8",
          backdrop: `rgba(255, 0, 0, 0.15)`,
        });
      } else {
        // Any other errors
        Swal.fire({
          icon: "warning",
          title: "Login Issue",
          text: data.errorMsg || "Unknown error occurred",
          confirmButtonColor: "#ff9800",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect to server. Please try again later.",
        confirmButtonColor: "#d33",
      });
      console.error("Error:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="tel"
            name="msisdn"
            placeholder="Mobile Number"
            value={formData.msisdn}
            onChange={handleChange}
            pattern="\d{10}"
            title="Enter a valid 10-digit mobile number"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="auth-button">
            Login
          </button>
        </form>

        <p className="auth-footer">
          Don’t have an account?{" "}
          <Link to="/signup" className="auth-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
