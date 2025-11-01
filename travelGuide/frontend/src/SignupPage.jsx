import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import Swal from "sweetalert2";
import { FiUser, FiPhone, FiLock } from "react-icons/fi";
import "./Auth.css";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ✅ Handle Signup button click
  const handleSignup = async () => {
    let newErrors = {};

    // --- Frontend validation ---
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
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

    // --- Prepare payload matching your backend ---
    const signupPayload = {
      fName: formData.firstName,
      lName: formData.lastName,
      password: formData.password,
      msisdn: formData.mobileNumber,
    };

    try {
      const response = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupPayload),
      });

      const data = await response.json();

      // ✅ Handle success/failure (your API returns errorCode = "100" for success)
      if (!response.ok || data.errorCode !== "100") {
        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: data.errorMsg || "Could not create account.",
        });
        return;
      }

      // ✅ Signup successful
      setShowConfetti(true);
      Swal.fire({
        icon: "success",
        title: "Signup Successful 🎉",
        text: "Welcome to TripPulse!",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        setShowConfetti(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Signup Error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Try again.",
      });
    }
  };

  return (
    <div className="auth-wrapper">
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      <div className="auth-card">
        <div className="auth-logo">
          <img src="src/assets/logo.png" alt="TripPulse Logo" />
        </div>

        <h2 className="auth-heading">Create your TripPulse Account</h2>
        <p className="auth-subtext">Join to explore live travel insights</p>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          {/* First Name */}
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
            {errors.firstName && (
              <p className="input-error">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
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
            {errors.lastName && (
              <p className="input-error">{errors.lastName}</p>
            )}
          </div>

          {/* Mobile Number */}
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

          {/* Password */}
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
            {errors.password && (
              <p className="input-error">{errors.password}</p>
            )}
          </div>

          {/* Signup Button */}
          <button type="button" className="sign-in-btn" onClick={handleSignup}>
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
    </div>
  );
}
