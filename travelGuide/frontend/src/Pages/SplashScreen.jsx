import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./splash.css";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <img
          src="src/assets/logo.png"
          alt="TripPulse Logo"
          className="splash-logo"
        />
        <h1 className="splash-title">TripPulse</h1>
        <p className="splash-tagline">Discover • Plan • Go</p>
      </div>
    </div>
  );
}
