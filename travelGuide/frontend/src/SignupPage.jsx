import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import Swal from "sweetalert2";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import "./Auth.css";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ✅ Send OTP
  const handleSendOtp = async () => {
    if (!isValidEmail(formData.email)) {
      setErrors({ ...errors, email: "Enter a valid email address" });
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/sendOtp?email=${encodeURIComponent(formData.email)}`,
        { method: "POST" }
      );
      const msg = await res.text();

      if (msg.includes("otpSentTo")) {
        setOtpSent(true);
        Swal.fire({
          icon: "success",
          title: "OTP Sent 📩",
          text: `Check your inbox for the OTP sent to ${formData.email}`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to Send OTP ❌",
          text: "Could not send verification email.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Network error while sending OTP.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    if (!otpValue.trim()) {
      setErrors({ ...errors, otp: "Enter the OTP sent to your email" });
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/verifyOtp?email=${encodeURIComponent(
          formData.email
        )}&otp=${otpValue}`,
        { method: "POST" }
      );
      const msg = await res.text();

      if (msg.includes("OTP verified")) {
        setIsEmailVerified(true);
        Swal.fire({
          icon: "success",
          title: "Email Verified ✅",
          text: "You can now complete signup.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid OTP ❌",
          text: "Please check and try again.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not verify OTP.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // ✅ Signup
  const handleSignup = async () => {
    let newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!isValidEmail(formData.email)) newErrors.email = "Valid email required";
    if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)
    )
      newErrors.password =
        "Password must be 8+ chars, include uppercase, number & special character";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const signupPayload = {
      fName: formData.firstName,
      lName: formData.lastName,
      password: formData.password,
      email: formData.email,
    };

    try {
      const response = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupPayload),
      });

      const data = await response.json();
      if (!response.ok || data.errorCode !== "100") {
        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: data.errorMsg || "Could not create account.",
        });
        return;
      }

      setShowConfetti(true);
      Swal.fire({
        icon: "success",
        title: "Signup Successful 🎉",
        text: "Welcome to TripEasy4U!",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        setShowConfetti(false);
        navigate("/login");
      }, 2000);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Try again.",
      });
    }
  };

  return (
    <div className="auth-wrapper">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <div className="auth-card">
        <div className="auth-logo">
          <img src="src/assets/logo.jpeg" alt="TripPulse Logo" />
        </div>

        <h2 className="auth-heading">Create Your TripEasy4U Account</h2>
        <p className="auth-subtext">Join us to explore and share travel experiences</p>

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
            />
            {errors.firstName && <p className="input-error">{errors.firstName}</p>}
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
            />
            {errors.lastName && <p className="input-error">{errors.lastName}</p>}
          </div>

          {/* Email + Verify */}
          <div className="input-group email-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              disabled={isEmailVerified}
            />
            <button
              type="button"
              className={`verify-btn ${isEmailVerified ? "verified" : ""}`}
              onClick={handleSendOtp}
              disabled={isVerifying || isEmailVerified}
            >
              {isEmailVerified ? "✅ Verified" : isVerifying ? "Sending..." : "Verify"}
            </button>
            {errors.email && <p className="input-error">{errors.email}</p>}
          </div>

          {otpSent && !isEmailVerified && (
  <div className="otp-section fade-in">
    <label className="otp-label">Enter the 6-digit OTP sent to your email</label>

    {/* OTP Input Boxes */}
    <div className="otp-input-row">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          type="text"
          maxLength="1"
          className="otp-digit"
          value={otpValue[i] || ""}
          onChange={(e) => {
            const newOtp = otpValue.split("");
            newOtp[i] = e.target.value.replace(/[^0-9]/g, "");
            setOtpValue(newOtp.join(""));

            // Auto-focus next box
            if (e.target.value && e.target.nextSibling) {
              e.target.nextSibling.focus();
            }

            // ✅ Auto-verify once 6 digits are filled
            if (newOtp.join("").length === 6) {
              handleVerifyOtp();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !e.target.value && e.target.previousSibling) {
              e.target.previousSibling.focus();
            }
          }}
        />
      ))}
    </div>

    {/* Verify Button */}
    <div className="otp-btn-container">
      <button
        type="button"
        className="verify-btn otp-verify-btn"
        onClick={handleVerifyOtp}
        disabled={isVerifying}
      >
        {isVerifying ? "Verifying..." : "Verify OTP"}
      </button>
    </div>

    {errors.otp && <p className="input-error">{errors.otp}</p>}
  </div>
)}


          {/* Password */}
          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="input-error">{errors.password}</p>}
          </div>

          {/* Sign Up */}
          <button
            type="button"
            className="sign-in-btn"
            onClick={handleSignup}
            disabled={!isEmailVerified}
          >
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
