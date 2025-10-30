import React, { useState } from "react";
import {
  FiUser,
  FiGift,
  FiBell,
  FiLock,
  FiFileText,
  FiGlobe,
} from "react-icons/fi";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    sessionStorage.clear();

    setLogoutConfirm(false);

    toast.success("You’ve been logged out successfully 👋", {
      position: "top-center",
      autoClose: 2000,
      theme: "light",
      transition: Slide,
    });

    setTimeout(() => {
      window.location.href = "/login"; // redirect to login page
    }, 2000);
  };

  return (
    <div className="profile-page">
      <div className="profile-content">
        <h2 className="profile-title">Profile</h2>

        {/* Profile Info Card */}
        <div className="profile-info-card">
          <img
            src="https://via.placeholder.com/70"
            alt="Profile"
            className="profile-img"
          />
          <div className="profile-text">
            <h3>Hello, Henry</h3>
            <p>New work</p>
            <button className="edit-btn">Edit Profile</button>
          </div>
        </div>

        {/* Options List */}
        <div className="profile-options">
          <div className="option">
            <div className="left">
              <FiUser className="icon" />
              <span>Personal Information</span>
            </div>
            <span className="arrow">›</span>
          </div>

          <div className="option">
            <div className="left">
              <FiGift className="icon" />
              <span>Loyalty Program</span>
            </div>
            <span className="arrow">›</span>
          </div>

          <div className="option">
            <div className="left">
              <FiBell className="icon" />
              <span>Notifications</span>
            </div>
            <span className="arrow">›</span>
          </div>

          <div className="option">
            <div className="left">
              <FiLock className="icon" />
              <span>Privacy Policy</span>
            </div>
            <span className="arrow">›</span>
          </div>

          <div className="option">
            <div className="left">
              <FiFileText className="icon" />
              <span>Terms & Conditions</span>
            </div>
            <span className="arrow">›</span>
          </div>

          <div className="option">
            <div className="left">
              <FiGlobe className="icon" />
              <span>Language</span>
            </div>
            <span className="language">English ›</span>
          </div>
        </div>

        {/* Logout Section */}
        <div className="logout-section">
          <button className="logout-btn" onClick={() => setLogoutConfirm(true)}>
            🚪 Log Out
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {logoutConfirm && (
        <div className="logout-modal">
          <div className="logout-card">
            <h3>Log Out?</h3>
            <p>Are you sure you want to log out from TripPulse?</p>
            <div className="logout-actions">
              <button
                className="cancel-btn"
                onClick={() => setLogoutConfirm(false)}
              >
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
