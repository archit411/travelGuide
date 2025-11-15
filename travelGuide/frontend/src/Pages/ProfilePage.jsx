import React, { useState, useEffect } from "react";
import { FiUser, FiBell, FiFileText, FiLock } from "react-icons/fi";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState(null);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

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

  // 🔹 Fetch user details on mount
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

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    // Enable button only when all fields filled and passwords match
    const allFilled =
      updatedForm.currentPassword.trim() !== "" &&
      updatedForm.newPassword.trim() !== "" &&
      updatedForm.confirmPassword.trim() !== "";
    const passwordsMatch = updatedForm.newPassword === updatedForm.confirmPassword;

    setIsPasswordValid(allFilled && passwordsMatch);
  };

  // 🔹 Save Personal Info (for future backend API)
  const handleSaveInfo = () => {
    toast.success("Personal information updated successfully ✅", {
      position: "top-center",
      autoClose: 1500,
      transition: Slide,
    });
  };

  // 🔹 Change Password API call
  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first ❌");
        return;
      }

      const url = `http://localhost:8080/profile/changePassword?oldPass=${encodeURIComponent(
        formData.currentPassword
      )}&newPass=${encodeURIComponent(formData.newPassword)}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.status === "SUCCESS") {
        toast.success(result.description || "Password changed successfully 🔒", {
          position: "top-center",
          autoClose: 1500,
          transition: Slide,
        });
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsPasswordValid(false);
      } else {
        toast.error(result.description || "Password change failed ❌", {
          position: "top-center",
          autoClose: 2000,
          transition: Slide,
        });
      }
    } catch (error) {
      console.error("Error while changing password:", error);
      toast.error("Something went wrong ❌", {
        position: "top-center",
        autoClose: 2000,
        transition: Slide,
      });
    }
  };
// 🔹 Logout
const handleLogout = () => {
  localStorage.clear();
  setLogoutConfirm(false);

  toast.info("You’ve been logged out 👋", {
    position: "bottom-center",
    autoClose: 1800,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    transition: Slide,
    style: {
      backgroundColor: "#333",
      color: "#fff",
      borderRadius: "8px",
      fontSize: "15px",
      textAlign: "center",
      padding: "12px 18px",
    },
  });

  // Redirect after toast disappears
  setTimeout(() => {
    window.location.href = "/login";
  }, 1800);
};

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
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

        {/* Tabs Section */}
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
              <h3 className="info-heading">Your Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} readOnly />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} readOnly />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} readOnly />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" value={formData.city} readOnly />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input type="text" name="state" value={formData.state} readOnly />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input type="text" name="country" value={formData.country} readOnly />
                </div>
              </div>
            </div>
          )}

          {/* CHANGE PERSONAL INFO */}
          <div className="option" onClick={() => toggleSection("edit-personal-info")}>
            <div className="left">
              <FiUser className="icon" />
              <span>Change Personal Information</span>
            </div>
            <span className="arrow">{activeSection === "edit-personal-info" ? "▼" : "›"}</span>
          </div>

          {activeSection === "edit-personal-info" && (
            <div className="expandable-section">
              <h3 className="info-heading">Update Your Details</h3>

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
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="button-group">
                <button className="save-btn" onClick={handleSaveInfo}>
                  Save Changes
                </button>
              </div>
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
                <button
                  className={`save-btn ${!isPasswordValid ? "disabled-btn" : ""}`}
                  onClick={handlePasswordChange}
                  disabled={!isPasswordValid}
                >
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

          {/* ABOUT ME / TERMS */}
          <div className="option" onClick={() => toggleSection("terms")}>
            <div className="left">
              <FiFileText className="icon" />
              <span>About Me / Terms & Conditions</span>
            </div>
            <span className="arrow">{activeSection === "terms" ? "▼" : "›"}</span>
          </div>
          {activeSection === "terms" && (
            <div className="expandable-section">
              <p>
                At TripEasy, travel planning is simple, smart, and fun! 🌍
                Discover breathtaking destinations, plan your perfect getaway, and go explore — all in one place.
                No more endless tabs or confusing maps — just Discover • Plan • Go ✈️💼🌄
                From hidden gems to iconic spots, TripEasy makes every trip smoother and more memorable.
                So pack light, dream big, and let TripEasy handle the rest! 💫
              </p>
            </div>
          )}
        </div>

     <div className="logout-option" onClick={() => setLogoutConfirm(true)}>
  <div className="logout-left">
    <i className="fa-solid fa-right-from-bracket logout-icon"></i>
    <span>Log Out</span>
  </div>
   <span className="arrow">{activeSection === "terms" ? "▼" : "›"}</span>
</div>

      </div>

      {logoutConfirm && (
  <div className="logout-modal">
    <div className="logout-card">
      <h3>Log Out?</h3>
      <p>Are you sure you want to log out from tripEZ?</p>
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
