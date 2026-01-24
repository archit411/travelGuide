import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { registerSW } from "virtual:pwa-register";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { GoogleOAuthProvider } from "@react-oauth/google";


registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log("⚡ New version available!");
  },
  onOfflineReady() {
    console.log("✅ TripPulse is ready to work offline!");
  },
});

// Fix for mobile viewport height
function setVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', setVH);


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="189568540017-edlbo7rlh95m7ne2q4ls7u3tg3ea41hd.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
