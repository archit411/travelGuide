import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./Auth.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
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
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ✅ Simple email validation regex
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // ✅ Reusable toast (for Google or normal login)
  const showWelcomeToast = (userName, source = "trip") => {
    const toast = document.createElement("div");
    toast.className = "google-toast";
    toast.innerHTML = `
      <img src="${
        source === "google"
          ? "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
          : "src/assets/logo.jpeg"
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

  // ✅ Handle email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });

    if (!validateEmail(formData.email)) {
      setErrors({
        email: "Please enter a valid email address",
      });
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/login?email=${encodeURIComponent(
          formData.email
        )}&password=${encodeURIComponent(formData.password)}`,
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

        showWelcomeToast(data.userName, "trip");

        setTimeout(() => {
          navigate("/homepage", { state: { username: data.userName } });
        }, 1000);
      } else if (data.errorCode === "106") {
        setErrors({
          email: "",
          password: "Incorrect email or password",
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
      const res = await fetch("${BASE_URL}/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: googleToken }),
      });

      const data = await res.json();

      if (data.errorCode === "100") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.userName);

        // ✅ Immediately call /saveUserDetails after successful Google login
        try {
          await fetch("${BASE_URL}/profile/saveUserDetails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.token}`,
            },
          });
          console.log("✅ User details saved successfully.");
        } catch (err) {
          console.error("❌ Error while saving user details:", err);
        }

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
            <img src="src/assets/logo.jpeg" alt="TripPulse Logo" />
          </div>

          <h2 className="auth-heading">Welcome to TripEasy4U</h2>
          <p className="auth-subtext">Sign in to explore live travel insights</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <FiMail className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className="input-error">{errors.email}</p>}
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
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
