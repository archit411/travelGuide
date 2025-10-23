import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Confetti from "react-confetti";
import Swal from "sweetalert2";
import { FiUser, FiMail, FiPhone, FiLock, FiCheckCircle } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import "./Auth.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
  });

  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      fName: formData.firstName,
      lName: formData.lastName,
      emailId: formData.email,
      msisdn: formData.mobileNumber,
      password: formData.password,
    };

    try {
      const response = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.errorCode === "109") {
        Swal.fire({
          icon: "error",
          title: "Account Already Exists",
          text: data.errorMsg || "An account already exists with this number.",
          confirmButtonColor: "#d33",
          background: "#fff8f8",
          backdrop: `rgba(255, 0, 0, 0.15)`,
        });
        return;
      }

      if (data.errorCode === "100") {
        // 🎉 Success screen instead of alert
        setShowConfetti(true);
        setShowSuccessScreen(true);

        // Auto redirect to login after 3 seconds
        setTimeout(() => {
          setShowConfetti(false);
          navigate("/login");
        }, 3000);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Signup Failed",
          text: data.errorMsg || "Unknown error occurred.",
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
    <div className="auth-wrapper">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      {showSuccessScreen ? (
        <div className="success-card">
          <FiCheckCircle className="success-icon" />
          <h2 className="success-title">Welcome to TripPulse!</h2>
          <p className="success-text">
            Your account has been created successfully, {formData.firstName}.
          </p>
          <p className="success-subtext">Redirecting to login...</p>
        </div>
      ) : (
        <div className="auth-card">
          <div className="auth-logo">
              <img src="src/assets/logo.png" alt="TripPulse Logo" />
          </div>

          <h2 className="auth-heading">Create your TripPulse Account</h2>
          <p className="auth-subtext">Join to explore live travel insights</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <FiUser className="input-icon" />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <FiUser className="input-icon" />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <FiMail className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <FiPhone className="input-icon" />
              <input
                type="tel"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleChange}
                pattern="\d{10}"
                title="Mobile number must be 10 digits"
                required
              />
            </div>

            <div className="input-group">
              <FiLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                title="Password must be at least 8 characters, contain one uppercase letter, one number, and one special character (@$!%*?&)"
                required
              />
            </div>

            <button type="submit" className="sign-in-btn">
              Sign Up
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default SignupPage;
