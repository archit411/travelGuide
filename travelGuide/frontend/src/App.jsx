import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import HomePage from "./Pages/Homepage";
import TripPulseHome from "./Pages/Homepage";
import BackgroundSection from "./Pages/Homepage";
import SplashScreen from "./Pages/SplashScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/homepage" element={<BackgroundSection />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
