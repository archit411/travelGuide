import React, { useState } from "react";
import {
  FiSettings,
  FiCamera,
  FiMapPin,
  FiHeart,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [toggles, setToggles] = useState({
    weather: true,
    crowd: true,
  });

  const navigate = useNavigate();

  const handleToggle = (key) => {
    setToggles({ ...toggles, [key]: !toggles[key] });
  };

  const handleLogoutConfirm = () => {
    setLogoutConfirm(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    sessionStorage.clear();

    setLogoutConfirm(false);
    toast.success("You’ve been logged out successfully 👋", {
      position: "top-center",
      autoClose: 1800,
      theme: darkMode ? "dark" : "light",
      transition: Slide,
    });

    setTimeout(() => {
      navigate("/login");
    }, 1800);
  };

  return (
    <div className={`mobile-container ${darkMode ? "dark-mode" : ""}`}>
      <header className="profile-header">
        <h2>Profile</h2>
        
      </header>

      {/* Profile Info */}
      <section className="profile-card">
        <div className="avatar"></div>
        <h3>Archit Jain</h3>
        <p className="username">@archit_travels</p>
        <span className="badge">Elite Traveler</span>

        <div className="stats">
          <div>
            <FiCamera />
            <p>42</p>
            <span>Stories</span>
          </div>
          <div>
            <FiMapPin />
            <p>28</p>
            <span>Reports</span>
          </div>
          <div>
            <FiHeart />
            <p>567</p>
            <span>Helpful</span>
          </div>
        </div>

        <div className="score-card">
          <div>
            <p className="label">TripPulse Score</p>
            <h2>1247</h2>
          </div>
          <div className="next">
            <p>Next Level</p>
            <span>753 points</span>
          </div>
        </div>
      </section>

      {/* Account Section */}
      <section className="settings-section">
        <h3>Account</h3>
        <div className="settings-item">
          <span>👤 Edit Profile</span>
          <p>Update your personal information</p>
        </div>
        <div className="settings-item">
          <span>🛡️ Privacy & Security</span>
          <p>Manage privacy preferences</p>
        </div>
      </section>

      {/* Notifications */}
      <section className="settings-section">
        <h3>Notifications</h3>
        {[
          { label: "Weather Alerts", key: "weather" },
          { label: "Crowd Updates", key: "crowd" },
        ].map(({ label, key }) => (
          <div className="settings-toggle" key={key}>
            <div>
              <span>{label}</span>
              <p>Manage {label.toLowerCase()}</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={toggles[key]}
                onChange={() => handleToggle(key)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        ))}
      </section>

      {/* Support */}
      <section className="settings-section">
        <h3>Support</h3>
        <div className="settings-item">❓ Help & FAQ</div>
        <div className="settings-item">📜 Terms & Privacy</div>
      </section>

      {/* Footer */}
      <div className="settings-footer">
        <p className="app-name">TripPulse</p>
        <p className="version">Version 1.0.0</p>
        <button className="logout-btn" onClick={handleLogoutConfirm}>
          🚪 Log Out
        </button>
      </div>

      {/* Logout Confirmation */}
      {logoutConfirm && (
        <div className="logout-modal">
          <div className="logout-card">
            <h3>Log Out?</h3>
            <p>Are you sure you want to log out from TripPulse?</p>
            <div className="logout-actions">
              <button className="cancel-btn" onClick={() => setLogoutConfirm(false)}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleLogout}>
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
