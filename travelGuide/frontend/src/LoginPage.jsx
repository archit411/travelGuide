import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiPhone, FiLock } from "react-icons/fi";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./Auth.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({ msisdn: "", password: "" });
  const [errors, setErrors] = useState({ msisdn: "", password: "" });
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const navigate = useNavigate();

  // ✅ Capture PWA install event
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  // ✅ Custom PWA install prompt
  const showInstallPrompt = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      alert("Install prompt not available. Try again in Chrome or Edge.");
    }
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear specific error when typing
  };

  // ✅ Reusable toast (for Google or normal login)
  const showWelcomeToast = (userName, source = "trip") => {
    const toast = document.createElement("div");
    toast.className = "google-toast";
    toast.innerHTML = `
      <img src="${
        source === "google"
          ? "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
          : "src/assets/logo.png"
      }" 
        alt="logo" class="google-logo" />
      <span>Welcome ${userName || "traveler"}!</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  // ✅ Handle phone/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ msisdn: "", password: "" });

    // 🔹 Basic phone validation
    if (!/^\d{10}$/.test(formData.msisdn)) {
      setErrors({
        msisdn: "Please enter a valid 10-digit phone number",
      });
      return;
    }

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
        // ✅ Successful login
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.userName);
        }

        // ✅ Show toast (TripPulse logo)
        showWelcomeToast(data.userName, "trip");

        // Navigate after short delay
        setTimeout(() => {
          navigate("/homepage", { state: { username: data.userName } });
        }, 1000);
      } else if (data.errorCode === "106") {
        // ❌ Invalid credentials
        setErrors({
          msisdn: "",
          password: "Incorrect phone number or password",
        });
      } else {
        setErrors({
          password: "Something went wrong. Please try again later.",
        });
      }
    } catch (error) {
      setErrors({
        password: "Unable to connect to the server. Please try again.",
      });
    }
  };

  // ✅ Google Login Success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;
      const res = await fetch("http://localhost:8080/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: googleToken }),
      });

      const data = await res.json();

      if (data.errorCode === "100") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.userName);

        showWelcomeToast(data.userName, "google");

        setTimeout(() => {
          navigate("/homepage", { state: { username: data.userName } });
        }, 1000);
      } else {
        setErrors({ password: "Google Sign-In Failed" });
      }
    } catch {
      setErrors({ password: "Sign-In Error. Please retry." });
    }
  };

  const handleGoogleFailure = () =>
    setErrors({ password: "Google Sign-In Failed" });

  return (
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
                maxLength="10"
                required
              />
              {errors.msisdn && <p className="input-error">{errors.msisdn}</p>}
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
              {errors.password && (
                <p className="input-error">{errors.password}</p>
              )}
            </div>

            <button type="submit" className="sign-in-btn">
              Sign In
            </button>
          </form>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-login">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              shape="rectangular"
              theme="outline"
              text="signin_with"
              width="240"
            />
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
