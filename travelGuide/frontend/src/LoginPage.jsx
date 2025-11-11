import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./Auth.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallSteps, setShowInstallSteps] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const navigate = useNavigate();

  // ✅ Capture PWA install prompt
// ✅ Capture and manage PWA install prompt
useEffect(() => {
  const handleBeforeInstallPrompt = (e) => {
    e.preventDefault();
    setDeferredPrompt(e);
  };

  const handleAppInstalled = () => {
    console.log("✅ App installed successfully!");
    setIsInstalled(true);
    localStorage.setItem("tripPulseInstalled", "true");

    // Hide install button after success
    setDeferredPrompt(null);
  };

  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.addEventListener("appinstalled", handleAppInstalled);

  // Check if already installed earlier
  if (localStorage.getItem("tripPulseInstalled") === "true") {
    setIsInstalled(true);
  }

  return () => {
    window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.removeEventListener("appinstalled", handleAppInstalled);
  };
}, []);

// ✅ Trigger native install prompt or show manual instructions
const showInstallPrompt = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      console.log("📲 User accepted install prompt");
      setIsInstalled(true);
      localStorage.setItem("tripPulseInstalled", "true");

      // Hide button immediately
      setDeferredPrompt(null);
    } else {
      console.log("❌ User dismissed install prompt");
    }
  } else {
    // Fallback for iOS/Safari — show manual steps
    setShowInstallSteps(true);
  }
};


  // ✅ Show install prompt or manual steps
  // const showInstallPrompt = async () => {
  //   if (deferredPrompt) {
  //     deferredPrompt.prompt();
  //     const choiceResult = await deferredPrompt.userChoice;

  //     if (choiceResult.outcome === "accepted") {
  //       setIsInstalled(true);
  //       localStorage.setItem("tripPulseInstalled", "true");
  //     }

  //     setDeferredPrompt(null);
  //   } else {
  //     // If no native install support → show steps
  //     setShowInstallSteps(true);
  //   }
  // };

  const handleHideSteps = () => {
    setShowInstallSteps(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const showWelcomeToast = (userName, source = "trip") => {
    const toast = document.createElement("div");
    toast.className = "google-toast";
    toast.innerHTML = `
      <img src="${
        source === "google"
          ? "/google.svg"
          : "/logo.jpeg"
      }" alt="logo" class="google-logo" />
      <span>Welcome ${userName || "traveler"}!</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });

    if (!validateEmail(formData.email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    try {
      const response = await fetch(
        `https://travelguide-1-21sw.onrender.com/api/login?email=${encodeURIComponent(
          formData.email
        )}&password=${encodeURIComponent(formData.password)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
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
        setErrors({ password: "Incorrect email or password" });
      } else {
        setErrors({ password: "Something went wrong. Please try again later." });
      }
    } catch (error) {
      setErrors({ password: "Unable to connect to the server. Please try again." });
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;
      const res = await fetch(
        "https://travelguide-1-21sw.onrender.com/api/auth/google",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: googleToken }),
          mode: "cors",
        }
      );

      const data = await res.json();

      if (data.errorCode === "100") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.userName);

        await fetch("https://travelguide-1-21sw.onrender.com/profile/saveUserDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          mode: "cors",
        });

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

  const handleGoogleFailure = () => setErrors({ password: "Google Sign-In Failed" });

  return (
    <GoogleOAuthProvider clientId="189568540017-edlbo7rlh95m7ne2q4ls7u3tg3ea41hd.apps.googleusercontent.com">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-logo">
            <img src="/logo.jpeg" alt="TripPulse Logo" />
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
              {errors.password && <p className="input-error">{errors.password}</p>}
            </div>

            <button type="submit" className="sign-in-btn">
              Sign In
            </button>
          </form>

          <div className="divider">
            <span>or continue with</span>
          </div>

        <div className="social-login">
  <div className="google-btn-wrapper">
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleFailure}
      shape="rectangular"
      theme="outline"
      text="signin_with"
    />
  </div>
</div>


          <p className="auth-footer">
            Don’t have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign Up
            </Link>
          </p>

          {/* ✅ Install button (only if not installed) */}
          {!isInstalled && (
            <button className="install-btn" onClick={showInstallPrompt}>
              📲 Install TripEasy4U
            </button>
          )}

          {/* ✅ Manual install steps for unsupported browsers */}
          {showInstallSteps && (
            <div className="install-steps">
              <h4>How to Install TripPulse</h4>
              <ol>
                <li>
                  <strong>Android (Chrome):</strong> Tap the 3-dot menu → “Add to
                  Home Screen”.
                </li>
                <li>
                  <strong>iPhone (Safari):</strong> Tap the share icon → “Add to
                  Home Screen”.
                </li>
                <li>
                  <strong>Desktop (Chrome/Edge):</strong> Click the install icon in
                  the address bar.
                </li>
              </ol>
              <button className="close-steps-btn" onClick={handleHideSteps}>
                Got it!
              </button>
            </div>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
