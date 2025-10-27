import React, { useState } from "react";
import {
  FiSettings,
  FiCamera,
  FiMapPin,
  FiHeart,
  FiChevronLeft,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [toggles, setToggles] = useState({
    weather: true,
    crowd: true,
    story: true,
    recommendations: false,
  });

  const navigate = useNavigate();

  const handleToggle = (key) => {
    setToggles({ ...toggles, [key]: !toggles[key] });
  };

  const handleLogoutConfirm = () => {
    setLogoutConfirm(true); // Show slide-up modal
  };

  const handleLogout = () => {
    // 1️⃣ Clear session
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    sessionStorage.clear();

    // 2️⃣ Slide modal down + Toast
    setLogoutConfirm(false);
    toast.success("You’ve been logged out successfully 👋", {
      position: "top-center",
      autoClose: 1800,
      theme: darkMode ? "dark" : "light",
      transition: Slide,
    });

    // 3️⃣ Redirect after delay
    setTimeout(() => {
      navigate("/login");
    }, 1800);
  };

  return (
    <div className={`mobile-container ${darkMode ? "dark-mode" : ""}`}>
      {!showSettings ? (
        <>
          <header className="profile-header">
            <h2>Profile</h2>
            <FiSettings
              className="settings-icon"
              onClick={() => setShowSettings(true)}
            />
          </header>

          <section className="profile-card">
            <div className="avatar"></div>
            <h3>Priya Sharma</h3>
            <p className="username">@priya_travels</p>
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

          <section className="achievements">
            <h3>Achievements</h3>
            <div className="grid">
              <div className="badge-card">
                ⭐ Elite Traveler <span>100+ contributions</span>
              </div>
              <div className="badge-card">
                📸 Story Master <span>50+ stories shared</span>
              </div>
              <div className="badge-card">
                ❤️ Community Favorite <span>Highly rated posts</span>
              </div>
              <div className="badge-card">
                🌍 Explorer <span>20+ destinations</span>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="settings-page">
          <div className="settings-header">
            <FiChevronLeft
              className="back-icon"
              onClick={() => setShowSettings(false)}
            />
            <h2>Settings</h2>
          </div>

          <div className="settings-section">
            <h3>Account</h3>
            <div className="settings-item">
              <span>👤 Edit Profile</span>
              <p>Update your personal information</p>
            </div>
            <div className="settings-item">
              <span>🛡️ Privacy & Security</span>
              <p>Manage privacy preferences</p>
            </div>
          </div>

          <div className="settings-section">
            <h3>Notifications</h3>
            {[
              { label: "Weather Alerts", key: "weather" },
              { label: "Crowd Updates", key: "crowd" },
              { label: "Story Notifications", key: "story" },
              { label: "Recommendations", key: "recommendations" },
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
          </div>

          <div className="settings-section">
            <h3>Preferences</h3>
            <div className="settings-toggle">
              <div>
                <span>🌙 Dark Mode</span>
                <p>Toggle between light and dark themes</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h3>Travel Interests</h3>
            <p className="subtext">Help us personalize your experience</p>
            <div className="interest-tags">
              {[
                "Food",
                "Adventure",
                "Photography",
                "Culture",
                "Nature",
                "Nightlife",
                "Trekking",
              ].map((tag) => (
                <button key={tag} className="tag-btn">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-section">
            <h3>Support</h3>
            <div className="settings-item">❓ Help & FAQ</div>
            <div className="settings-item">📜 Terms & Privacy</div>
          </div>

          <div className="settings-footer">
            <p className="app-name">TripPulse</p>
            <p className="version">Version 1.0.0</p>
            <button className="logout-btn" onClick={handleLogoutConfirm}>
              🚪 Log Out
            </button>
          </div>
        </div>
      )}

      {/* 🟢 Logout Slide-Up Modal */}
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

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
