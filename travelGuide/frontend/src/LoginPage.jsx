import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FiPhone, FiLock } from "react-icons/fi";
import "./Auth.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";


const LoginPage = () => {
  const [formData, setFormData] = useState({
    msisdn: "",
    password: "",
  });
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const navigate = useNavigate();

  // ✅ Capture PWA install prompt event
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("📲 PWA install prompt captured");
    });
  }, []);

  // ✅ Show custom PWA install popup
  const showInstallPrompt = async () => {
    if (!deferredPrompt) {
      Swal.fire({
        icon: "info",
        title: "Install Unavailable",
        text: "Please refresh the page or try in a supported browser (like Chrome).",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Install TripPulse?",
      text: "Get quick access to TripPulse — discover, plan, and explore offline.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Install Now",
      cancelButtonText: "Later",
      confirmButtonColor: "#111827",
      background: "#f9fafb",
    });

    if (result.isConfirmed) {
      deferredPrompt.prompt();
      const outcome = await deferredPrompt.userChoice;
      if (outcome.outcome === "accepted") {
        console.log("✅ User installed TripPulse!");
      } else {
        console.log("❌ User dismissed install prompt");
      }
      setDeferredPrompt(null);
    }
  };

  // ✅ Handle login input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle login submit (normal msisdn/password)
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
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.userName);
        }
        Swal.fire({
          icon: "success",
          title: "Welcome back!",
          text: `Hi ${data.userName || "traveler"} 👋`,
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/homepage", { state: { username: data.userName } });
      } else if (data.errorCode === "106") {
        Swal.fire({
          icon: "error",
          title: "Invalid Credentials",
          text: "Your phone number or password is incorrect. Please try again.",
          confirmButtonColor: "#d33",
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Login Issue",
          text: "Something went wrong. Please try again later.",
          confirmButtonColor: "#ff9800",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect to TripPulse servers. Please try again.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const googleToken = credentialResponse.credential; // ID token
    const res = await fetch("http://localhost:8080/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: googleToken }),
    });
    const data = await res.json();

    if (data.errorCode === "100") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.userName);

      Swal.fire({
        icon: "success",
        title: `Welcome ${data.userName || "traveler"}!`,
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/homepage", { state: { username: data.userName } });
    } else {
      Swal.fire({ icon: "error", title: "Google Sign-In Failed" });
    }
  } catch (err) {
    console.error(err);
    Swal.fire({ icon: "error", title: "Sign-In Error" });
  }
};


  // 🔹 Added function: handle Google login error
  const handleGoogleFailure = () => {
    Swal.fire({
      icon: "error",
      title: "Google Sign-In Failed",
      text: "Please try again later.",
    });
  };

  return (
    // 🔹 Wrap your component with GoogleOAuthProvider (clientId from Google Cloud)
    <GoogleOAuthProvider clientId="189568540017-edlbo7rlh95m7ne2q4ls7u3tg3ea41hd.apps.googleusercontent.com">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-logo">
            <img src="src/assets/logo.png" alt="TripPulse Logo" />
          </div>
          <h2 className="auth-heading">Welcome to TripPulse</h2>
          <p className="auth-subtext">Sign in to explore live travel insights</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <FiPhone className="input-icon" />
              <input
                type="tel"
                name="msisdn"
                placeholder="Enter phone number"
                value={formData.msisdn}
                onChange={handleChange}
                pattern="\d{10}"
                title="Enter a valid 10-digit phone number"
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
                required
              />
            </div>

            <button type="submit" className="sign-in-btn">
              Sign In
            </button>
          </form>

          <div className="divider">
            <span>or continue with</span>
          </div>

          {/* 🔹 Added Google Login Button */}
          <div className="social-login">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              shape="rectangular"
              theme="outline"
              text="signin_with"
              width="240"
            />

            <button className="social-btn">
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg"
                alt="Apple"
              />
              Apple
            </button>
          </div>

          <p className="auth-footer">
            Don’t have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign Up
            </Link>
          </p>

          <button className="install-btn" onClick={showInstallPrompt}>
            📲 Install TripPulse
          </button>

          <p className="guest-text">Continue as Guest</p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
