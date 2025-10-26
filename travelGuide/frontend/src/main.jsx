import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { registerSW } from "virtual:pwa-register";
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


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="189568540017-edlbo7rlh95m7ne2q4ls7u3tg3ea41hd.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
