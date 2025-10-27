import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import Swal from "sweetalert2";
import { FiUser, FiMail, FiPhone, FiLock, FiCheckCircle } from "react-icons/fi";
import "./Auth.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear specific field error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Basic client-side validation
    let newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Enter a valid email address";
    if (!/^\d{10}$/.test(formData.mobileNumber))
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number";
    if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        formData.password
      )
    )
      newErrors.password =
        "Password must have 8+ chars, 1 uppercase, 1 number, 1 special char";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
        setErrors({
          mobileNumber: "An account already exists with this mobile number.",
        });
        return;
      }

      if (data.errorCode === "100") {
        // 🎉 Success screen instead of alert
        setShowConfetti(true);
        setShowSuccessScreen(true);

        setTimeout(() => {
          setShowConfetti(false);
          navigate("/login");
        }, 3000);
      } else {
        setErrors({
          password: data.errorMsg || "Signup failed. Please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect to the server. Please try again later.",
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
              {errors.firstName && <p className="input-error">{errors.firstName}</p>}
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
              {errors.lastName && <p className="input-error">{errors.lastName}</p>}
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
              {errors.email && <p className="input-error">{errors.email}</p>}
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
                required
              />
              {errors.mobileNumber && (
                <p className="input-error">{errors.mobileNumber}</p>
              )}
            </div>

            <div className="input-group">
              <FiLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <p className="input-error">{errors.password}</p>}
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
    </div>
  );
};

export default SignupPage;
