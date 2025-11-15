import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Confetti from "react-confetti";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import "./Auth.css";

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    emailId: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ✅ Send OTP
  const handleSendOtp = async () => {
    const { fName, lName, emailId, password } = formData;

    let newErrors = {};
    if (!fName.trim()) newErrors.fName = "First name is required";
    if (!lName.trim()) newErrors.lName = "Last name is required";
    if (!isValidEmail(emailId)) newErrors.emailId = "Enter a valid email";
    if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
    )
      newErrors.password =
        "Password must be 8+ chars, include uppercase, number & special char";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(
  `https://travelguide-1-21sw.onrender.com/api/sendOtp?email=${encodeURIComponent(emailId)}`,
  { method: "POST" }
);

      const msg = await res.text();

      if (msg && msg.toLowerCase().includes("otp")) {
        setOtpSent(true);
        Swal.fire({
          icon: "success",
          title: "OTP Sent!",
          text: `Check your inbox for OTP sent to ${emailId}`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to Send OTP",
          text: "Could not send OTP. Try again.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Please check your connection.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle OTP Input
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    // auto-focus next field
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // ✅ Signup (after OTP entered)
  const handleSignup = async () => {
    const otp = otpValues.join("");
    if (otpValues.some(v => v === "") || otp.length !== 6){
      Swal.fire({
        icon: "warning",
        title: "Invalid OTP",
        text: "Please enter all 6 digits of OTP.",
      });
      return;
    }

    const signupPayload = {
      emailId: formData.emailId,
      fName: formData.fName,
      lName: formData.lName,
      password: formData.password,
    };

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://travelguide-1-21sw.onrender.com/api/signup?otp=${encodeURIComponent(otp)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signupPayload),
        }
      );

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
        text: "Welcome to tripEZ!",
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logo.jpeg" alt="tripEZ Logo" />
        </div>

        <h2 className="auth-heading">Create Your tripEZ Account</h2>
        <p className="auth-subtext">Join us to explore and share travel experiences</p>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          {/* First Name */}
          <div className="input-group">
            <FiUser className="input-icon" />
            <input
              type="text"
              name="fName"
              placeholder="First Name"
              value={formData.fName}
              onChange={handleChange}
            />
            {errors.fName && <p className="input-error">{errors.fName}</p>}
          </div>

          {/* Last Name */}
          <div className="input-group">
            <FiUser className="input-icon" />
            <input
              type="text"
              name="lName"
              placeholder="Last Name"
              value={formData.lName}
              onChange={handleChange}
            />
            {errors.lName && <p className="input-error">{errors.lName}</p>}
          </div>

          {/* Email */}
          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              name="emailId"
              placeholder="Email ID"
              value={formData.emailId}
              onChange={handleChange}
              disabled={otpSent}
            />
            {errors.emailId && <p className="input-error">{errors.emailId}</p>}
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
              disabled={otpSent}
            />
            {errors.password && <p className="input-error">{errors.password}</p>}
          </div>

          {/* Send OTP */}
          {!otpSent && (
            <button
              type="button"
              className="sign-in-btn"
              onClick={handleSendOtp}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          )}

          {/* OTP Section */}
          {otpSent && (
            <div className="otp-section fade-in">
              <label className="otp-label">Enter the 6-digit OTP sent to your email</label>
              <div className="otp-input-row">
                {otpValues.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength="1"
                    className="otp-digit"
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                  />
                ))}
              </div>

              {/* Show SignUp button when 6 digits entered */}
              {otpValues.join("").length === 6 && (
                <button
                  type="button"
                  className="sign-in-btn otp-verify-btn"
                  onClick={handleSignup}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </button>
              )}
            </div>
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
}
