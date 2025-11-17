import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useIsMobile from "../isMobile";
import "./splash.css";

export default function SplashScreen() {
  const navigate = useNavigate();
  const isMobile = useIsMobile(768);

  useEffect(() => {
    if (!isMobile) {
      navigate("/login", { replace: true });
      return;
    }

    const timer = setTimeout(() => navigate("/onboarding"), 2200);
    return () => clearTimeout(timer);
  }, [isMobile, navigate]);

  return (
    <div className="splash-wrapper">
      {/* Aesthetic travel background */}
      <img
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1500&q=80"
        className="splash-bg"
        alt="aesthetic background"
      />

      {/* light blur for premium feel */}
      <div className="bg-blur"></div>

      {/* Centered logo */}
      <img
        src="/logo2.png"
        className="splash-logo"
        alt="Tripez logo"
      />
    </div>
  );
}
