import React from "react";

export default function ModernAlert({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="alert-overlay" onClick={onClose}>
      <div className="alert-box" onClick={(e) => e.stopPropagation()}>
        <div className="alert-icon">📵</div>
        <p>{message}</p>
        <button onClick={onClose} className="btn btn--primary full">
          OK
        </button>
      </div>
    </div>
  );
}
