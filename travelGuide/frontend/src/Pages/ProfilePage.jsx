import React, { useState, useEffect } from "react";
import { FiUser, FiBell, FiFileText, FiLock } from "react-icons/fi";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState(null);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    username: "",
    gender: "",
    city: "",
    state: "",
    country: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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

        const result = await response.json();
        if (result.status === "SUCCESS") {
          const data = result.data;
          setFormData((prev) => ({
            ...prev,
            firstName: data.fName || "",
            lastName: data.lName || "",
            phone: data.msisdn || "",
            email: data.emailId || "",
            username: data.username || "",
            gender: data.gender || "",
            city: data.city || "",
            state: data.state || "",
            country: data.country || "",
          }));
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

  const handlePasswordChange = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill all password fields ⚠️");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match ❌");
      return;
    }

    toast.success("Password changed successfully 🔒", {
      position: "top-center",
      autoClose: 1500,
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
    setTimeout(() => (window.location.href = "/login"), 1800);
  };

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // 🔹 Temporary verify button handler
  const handleVerifyEmail = () => {
    toast.info("Verification link sent to your email 📩", {
      position: "top-center",
      autoClose: 2000,
      transition: Slide,
    });
  };

  return (
    <div className="profile-page">
      {errorMessage && <div className="error-banner">{errorMessage}</div>}

      <div className="profile-content">
        <h2 className="profile-title">Profile</h2>

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

        {/* Tabs */}
        <div className="profile-options">
          {/* PERSONAL INFO */}
          <div className="option" onClick={() => toggleSection("personal-info")}>
            <div className="left">
              <FiUser className="icon" />
              <span>Personal Information</span>
            </div>
            <span className="arrow">{activeSection === "personal-info" ? "▼" : "›"}</span>
          </div>
          {activeSection === "personal-info" && (
            <div className="expandable-section">
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
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              </div>

              {/* EMAIL FIELD + VERIFY BUTTON */}
              <div className="form-group email-group">
                <label>Email</label>
                <div className="email-field">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <button type="button" className="verify-btn" onClick={handleVerifyEmail}>
                    Verify
                  </button>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input type="text" name="country" value={formData.country} onChange={handleChange} />
                </div>
              </div>

              {/* <div className="button-group">
                <button className="save-btn" onClick={handleSave}>
                  Save Changes
                </button>
              </div> */}
            </div>
          )}

          {/* CHANGE PASSWORD */}
          <div className="option" onClick={() => toggleSection("change-password")}>
            <div className="left">
              <FiLock className="icon" />
              <span>Change Password</span>
            </div>
            <span className="arrow">{activeSection === "change-password" ? "▼" : "›"}</span>
          </div>
          {activeSection === "change-password" && (
            <div className="expandable-section">
              <h3 className="info-heading">Change Password</h3>

              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="button-group">
                <button className="save-btn" onClick={handlePasswordChange}>
                  Update Password
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          <div className="option" onClick={() => toggleSection("notifications")}>
            <div className="left">
              <FiBell className="icon" />
              <span>Notifications</span>
            </div>
            <span className="arrow">{activeSection === "notifications" ? "▼" : "›"}</span>
          </div>
          {activeSection === "notifications" && (
            <div className="expandable-section">
              <p>Notification preferences coming soon 🔔</p>
            </div>
          )}

          {/* TERMS */}
          <div className="option" onClick={() => toggleSection("terms")}>
            <div className="left">
              <FiFileText className="icon" />
              <span>Terms & Conditions</span>
            </div>
            <span className="arrow">{activeSection === "terms" ? "▼" : "›"}</span>
          </div>
          {activeSection === "terms" && (
            <div className="expandable-section">
              <p>Here you can show your terms & conditions content 📄</p>
            </div>
          )}
        </div>

        <div className="logout-section">
          <button className="logout-btn" onClick={() => setLogoutConfirm(true)}>
            🚪 Log Out
          </button>
        </div>
      </div>

      {logoutConfirm && (
        <div className="logout-modal">
          <div className="logout-card">
            <h3>Log Out?</h3>
            <p>Are you sure you want to log out?</p>
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
