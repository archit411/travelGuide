import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiBookmark, FiUser } from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import "./BottomNav.css";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "home", path: "/", label: "Home", icon: <FiHome /> },
    { id: "food", path: "/food", label: "Food", icon: <FaUtensils /> },
    { id: "saved", path: "/saved", label: "Saved", icon: <FiBookmark /> },
    { id: "profile", path: "/profile", label: "Profile", icon: <FiUser /> },
  ];

  return (
    <nav className="tp-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-btn ${
            location.pathname === item.path ? "active" : ""
          }`}
          onClick={() => navigate(item.path)}
        >
          <div className="nav-icon">{item.icon}</div>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
