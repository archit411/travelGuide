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
  const [activeSection, setActiveSection] = useState("main");
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Henry",
    lastName: "Wilson",
    phone: "+91 9876543210",
    email: "henry.wilson@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    toast.success("Profile updated successfully ✅", {
      position: "top-center",
      autoClose: 1500,
      transition: Slide,
    });
  };

  const handleVerifyEmail = () => {
    toast.info("Verification link sent to your email 📩", {
      position: "top-center",
      autoClose: 2000,
      transition: Slide,
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    setLogoutConfirm(false);
    toast.success("You’ve been logged out successfully 👋", {
      position: "top-center",
      autoClose: 1800,
      transition: Slide,
    });
    setTimeout(() => {
      window.location.href = "/login";
    }, 1800);
  };

  return (
    <div className="profile-page no-scroll">
      <div className="profile-content">
        <h2 className="profile-title">
          {activeSection === "main" ? "Profile" : "Personal Information"}
        </h2>

        {/* Main Profile Section */}
        {activeSection === "main" && (
          <>
            <div className="profile-info-card">
              <img
                src="https://via.placeholder.com/70"
                alt="Profile"
                className="profile-img"
              />
              <div className="profile-text">
                <h3>Hello, {formData.firstName}</h3>
                <p>New work</p>
              </div>
            </div>

            <div className="profile-options">
              <div
                className="option"
                onClick={() => setActiveSection("personal-info")}
              >
                <div className="left">
                  <FiUser className="icon" />
                  <span>Personal Information</span>
                </div>
                <span className="arrow">›</span>
              </div>

              {/* <div className="option">
                <div className="left">
                  <FiGift className="icon" />
                  <span>Loyalty Program</span>
                </div>
                <span className="arrow">›</span>
              </div> */}

              <div className="option">
                <div className="left">
                  <FiBell className="icon" />
                  <span>Notifications</span>
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

            <div className="logout-section">
              <button
                className="logout-btn"
                onClick={() => setLogoutConfirm(true)}
              >
                🚪 Log Out
              </button>
            </div>
          </>
        )}

        {/* Personal Info Section */}
        {activeSection === "personal-info" && (
          <div className="personal-info">
            <h3 className="info-heading">Edit Your Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group email-group">
              <label>Email</label>
              <div className="email-field">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <button
                  className="verify-btn"
                  onClick={handleVerifyEmail}
                >
                  Verify
                </button>
              </div>
            </div>

            <h3 className="password-heading">Change Password (Optional)</h3>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
            </div>

            <div className="button-group">
              <button
                className="cancel-btn"
                onClick={() => setActiveSection("main")}
              >
                ← Back
              </button>
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation */}
      {logoutConfirm && (
        <div className="logout-modal">
          <div className="logout-card">
            <h3>Log Out?</h3>
            <p>Are you sure you want to log out?</p>
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
