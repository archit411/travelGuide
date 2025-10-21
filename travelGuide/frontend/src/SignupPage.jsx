import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Confetti from "react-confetti";
import Swal from "sweetalert2";
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

      const data = await response.json(); // parse response JSON

      // 💥 Check errorCode from backend response
      if (data.errorCode === "109") {
        // ❌ Account already exists
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
        // 🎉 Account created successfully
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);

        Swal.fire({
          icon: "success",
          title: "Account Created Successfully!",
          text: `Your username is: ${data.userName}`,
          confirmButtonColor: "#3085d6",
          background: "#f0fff0",
        });

        // Clear form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          mobileNumber: "",
          password: "",
        });
      } else {
        // ❌ Other errors
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
    <div className="auth-container">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
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
          <button type="submit" className="auth-button">
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

      <ToastContainer />
    </div>
  );
};

export default SignupPage;
