import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiBell,
  FiFileText,
  FiGlobe,
} from "react-icons/fi";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState("main");
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    username: "",
    gender: "",
    city: "",
    state: "",
    country: "",
  });

  // 🔹 Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("Please login first");
          return;
        }

        const response = await fetch("http://localhost:8080/profile/getUserDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          setErrorMessage("Please login first");
          return;
        }

        const result = await response.json();

        if (result.status === "SUCCESS") {
          const data = result.data;
          setFormData({
            firstName: data.fName || "",
            lastName: data.lName || "",
            phone: data.msisdn || "",
            email: data.emailId || "",
            username: data.username || "",
            gender: data.gender || "",
            city: data.city || "",
            state: data.state || "",
            country: data.country || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        } else {
          setErrorMessage("Please login first");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setErrorMessage("Please login first");
      }
    };

    fetchUserDetails();
  }, []);

  // 🔹 Handle field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Save changes
  const handleSave = () => {
    toast.success("Profile updated successfully ✅", {
      position: "top-center",
      autoClose: 1500,
      transition: Slide,
    });
  };

  // 🔹 Verify Email button
  const handleVerifyEmail = () => {
    toast.info("Verification link sent to your email 📩", {
      position: "top-center",
      autoClose: 2000,
      transition: Slide,
    });
  };

  // 🔹 Logout handler
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
      {/* 🚨 Red error line on top if not logged in */}
      {errorMessage && (
        <div className="error-banner">
          {errorMessage}
        </div>
      )}

      <div className="profile-content">
        <h2 className="profile-title">
          {activeSection === "main" ? "Profile" : "Personal Information"}
        </h2>

        {/* Main Profile Section */}
        {activeSection === "main" && (
          <>
            <div className="profile-info-card">
              <img
                src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                alt="Default Profile"
                className="profile-img"
              />
              <div className="profile-text">
                <h3>Hello, {formData.firstName || "Guest"}</h3>
                <p>{formData.city || "No city info"}</p>
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
