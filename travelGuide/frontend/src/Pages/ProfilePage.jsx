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

  /* ---------------- Avatar Picker ---------------- */
  const [avatarModal, setAvatarModal] = useState(false);
  const [avatarList] = useState([
    "/p1.png",
    "/p2.png"
  ]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

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
  // Load avatar from localStorage on mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem("userAvatar");
    if (savedAvatar) {
      setSelectedAvatar(savedAvatar);
    }
  }, []);

  /* ---------------- Fetch User Details ---------------- */
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("Please login first");
          return;
        }

        const response = await fetch("https://travelguide-1-21sw.onrender.com/profile/getUserDetails", {
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

  /* ---------------- Handle Input ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    const allFilled =
      updatedForm.currentPassword.trim() !== "" &&
      updatedForm.newPassword.trim() !== "" &&
      updatedForm.confirmPassword.trim() !== "";

    const passwordsMatch = updatedForm.newPassword === updatedForm.confirmPassword;

    setIsPasswordValid(allFilled && passwordsMatch);
  };

  const handleSaveInfo = () => {
    toast.success("Personal information updated successfully ✅", {
      position: "top-center",
      autoClose: 1500,
      transition: Slide,
    });
  };

  /* ---------------- Password Change ---------------- */
  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first ❌");
        return;
      }

      const url = `https://travelguide-1-21sw.onrender.com/profile/changePassword?oldPass=${encodeURIComponent(
        formData.currentPassword
      )}&newPass=${encodeURIComponent(formData.newPassword)}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.status === "SUCCESS") {
        toast.success("Password changed successfully 🔒", {
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
        toast.error("Password change failed ❌", {
          position: "top-center",
          autoClose: 2000,
          transition: Slide,
        });
      }
    } catch {
      toast.error("Something went wrong ❌", {
        position: "top-center",
        autoClose: 2000,
        transition: Slide,
      });
    }
  };

  /* ---------------- Logout ---------------- */
  const handleLogout = () => {
    localStorage.clear();
    setLogoutConfirm(false);

    toast.info("You’ve been logged out 👋", {
      position: "bottom-center",
      autoClose: 1800,
      hideProgressBar: true,
      transition: Slide,
    });

    setTimeout(() => {
      window.location.href = "/login";
    }, 1800);
  };

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  /* ============================================================
                      RENDER UI
  ============================================================ */
  return (
    <div className="profile-page">

      {errorMessage && <div className="error-banner">{errorMessage}</div>}

      <div className="profile-content">
        <h2 className="profile-title">Profile</h2>

        {/* ---------------- Profile Card ---------------- */}
        <div className="profile-info-card">
          <img
            src={selectedAvatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
            alt="Profile"
            className="profile-img"
            onClick={() => setAvatarModal(true)}
            style={{ cursor: "pointer" }}
          />

          <div className="profile-text">
            <h3>Hello, {formData.firstName || "Guest"}</h3>
            <p>{formData.city || "No city info"}</p>
          </div>
        </div>

        {/* ---------------- Options Section ---------------- */}
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
                  <input type="text" value={formData.firstName} readOnly />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" value={formData.lastName} readOnly />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" value={formData.email} readOnly />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" value={formData.city} readOnly />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input type="text" value={formData.state} readOnly />
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <input type="text" value={formData.country} readOnly />
                </div>
              </div>
            </div>
          )}

          {/* EDIT PERSONAL INFO */}
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
                  <input name="firstName" value={formData.firstName} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input name="lastName" value={formData.lastName} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input name="city" value={formData.city} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input name="state" value={formData.state} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <input name="country" value={formData.country} onChange={handleChange} />
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
                  disabled={!isPasswordValid}
                  onClick={handlePasswordChange}
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

          {/* TERMS */}
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
                TripEZ makes travel easier.
                Discover great places, plan smarter, and explore with real insights from real travelers.
                Fast, simple, and reliable — everything you need for your next trip in one clean app.

                TripEZ — Discover. Plan. Go.
              </p>
            </div>
          )}
        </div>

        {/* LOGOUT */}
        <div className="logout-option" onClick={() => setLogoutConfirm(true)}>
          <div className="logout-left">
            <i className="fa-solid fa-right-from-bracket logout-icon"></i>
            <span>Log Out</span>
          </div>
        </div>
      </div>

      {/* ---------------- Logout Modal ---------------- */}
      {logoutConfirm && (
        <div className="logout-modal">
          <div className="logout-card">
            <h3>Log Out?</h3>
            <p>Are you sure you want to log out from TripEZ?</p>

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

      {/* ---------------- Avatar Picker Modal (Proper Position) ---------------- */}
      {avatarModal && (
        <div className="avatar-modal-overlay" onClick={() => setAvatarModal(false)}>
          <div className="avatar-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Select Your Avatar</h3>

            <div className="avatar-grid">
              {avatarList.map((av, i) => (
                <div
                  key={i}
                  className={`avatar-option ${selectedAvatar === av ? "selected" : ""}`}
                  onClick={() => setSelectedAvatar(av)}
                >
                  <img src={av} alt="avatar" />
                </div>
              ))}
            </div>

            <button
              className="avatar-save-btn"
              onClick={() => {
                if (selectedAvatar) {
                  localStorage.setItem("userAvatar", selectedAvatar);
                  toast.success("Avatar updated!");
                }
                setAvatarModal(false);
              }}
            >
              Save
            </button>

          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
