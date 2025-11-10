import React, { useEffect } from "react";
import "./home.css"; // keep your main CSS

export default function ModernAlert({ message, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="snackbar">
      <div className="snackbar-content">
        <p className="snackbar-text">{message}</p>
      </div>
    </div>
  );
}
