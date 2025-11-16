import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { FiHome, FiUser, FiSearch, FiX } from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";

export default function Navbar({ active, setShowAdd }) {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  // Update on window resize
  useEffect(() => {
    const listener = () =>
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, []);

  function handleNavigate(path, id) {
    if (!path) return;
    navigate(path);
  }

  return (
    <nav className="bottom-nav">

      {/* 🌐 DESKTOP NAV */}
      {!isMobile && (
        <div className="nav-web">
          {[
            { id: "home", label: "Home", icon: <FiHome />, path: "/homepage" },
            { id: "food", label: "Food", icon: <FaUtensils />, path: "/food" },
            { id: "feed", label: "Feed", icon: <FiSearch />, path: "/feed" },
          ].map((item) => (
            <button
              key={item.id}
              className={`nav-btn ${active === item.id ? "active" : ""}`}
              onClick={() => handleNavigate(item.path, item.id)}
            >
              <div className="nav-ic">{item.icon}</div>
              <div className="nav-label">{item.label}</div>
            </button>
          ))}
        </div>
      )}

      {/* 📱 MOBILE NAV */}
      {isMobile && (
        <div className="nav-mobile">
          {[
            { id: "home", label: "Home", icon: <FiHome />, path: "/homepage" },
            { id: "food", label: "Food", icon: <FaUtensils />, path: "/food" },
            { id: "upload", label: "Upload", icon: <FiX style={{ transform: "rotate(45deg)" }} /> },
            { id: "feed", label: "Feed", icon: <FiSearch />, path: "/feed" },
            { id: "profile", label: "Profile", icon: <FiUser />, path: "/profile" },
          ].map((item) => (
            <button
              key={item.id}
              className={`nav-btn ${item.id === "upload" ? "upload-btn" : ""} ${
                active === item.id ? "active" : ""
              }`}
              onClick={() => {
                if (item.id === "upload") {
                  if (setShowAdd) setShowAdd(true);
                  return;
                }
                handleNavigate(item.path, item.id);
              }}
            >
              <div className="nav-ic">{item.icon}</div>
              <div className="nav-label">{item.label}</div>
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
