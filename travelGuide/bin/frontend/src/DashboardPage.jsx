import React from "react";
import { useLocation } from "react-router-dom";
import Confetti from "react-confetti";
import "./Auth.css";

const DashboardPage = () => {
  const location = useLocation();
  const { username } = location.state || {};

  return (
    <div className="auth-container">
      <Confetti width={window.innerWidth} height={window.innerHeight} />
      <div className="auth-card">
        <h1 className="auth-title">🎉 Welcome, {username}! 🎉</h1>
        <p className="auth-footer">
          You have successfully logged in to the Travel Guide app.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
