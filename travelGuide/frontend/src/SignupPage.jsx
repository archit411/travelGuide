import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import Swal from "sweetalert2";
import { FiUser, FiPhone, FiLock } from "react-icons/fi";
import "./Auth.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Handle OTP input
  const handleOtpChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value.replace(/\D/, "");
    setOtp(newOtp);

    // Auto-focus next box
    if (e.target.value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // Validate fields and send OTP (simulated)
  const handleSendOtp = () => {
    let newErrors = {};
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

    // Simulate OTP sent
    Swal.fire({
      icon: "success",
      title: "OTP Sent!",
      text: "Enter 0000 to verify (demo mode).",
      timer: 2000,
      showConfirmButton: false,
    });
    setOtpSent(true);
  };

  // Verify OTP (mocked)
  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete OTP",
        text: "Please enter all 4 digits of the OTP.",
      });
      return;
    }

    if (enteredOtp === "0000") {
      setShowConfetti(true);
      Swal.fire({
        icon: "success",
        title: "Signup Successful!",
        text: "Welcome to TripPulse 🎉",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        setShowConfetti(false);
        navigate("/login");
      }, 2000);
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid OTP",
        text: "The OTP you entered is incorrect. Try again.",
      });
    }
  };

  return (
    <div className="auth-wrapper">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <div className="auth-card">
        <div className="auth-logo">
          <img src="src/assets/logo.png" alt="TripPulse Logo" />
        </div>

        <h2 className="auth-heading">Create your TripPulse Account</h2>
        <p className="auth-subtext">Join to explore live travel insights</p>

        <form className="auth-form">
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

          {!otpSent ? (
            <button type="button" className="sign-in-btn" onClick={handleSendOtp}>
              Send OTP
            </button>
          ) : (
            <>
              <div className="otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    className="otp-box"
                  />
                ))}
              </div>

              <button
                type="button"
                className="sign-in-btn verify-btn"
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>
            </>
          )}
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
};

export default SignupPage;
