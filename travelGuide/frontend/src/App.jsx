import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import SplashScreen from "./Pages/SplashScreen";
import ProfilePage from "./Pages/ProfilePage";
import TripPulseHome from "./Pages/Homepage"; // Home component
import DestinationPage from "./Pages/Destination";
import LiveStories from "./Pages/LiveStories";
import FoodPage from "./Pages/FoodPage";
import SavedStories from "./Pages/SavedStories";

function App() {
  return (
    <Router>
      <Routes>
        {/* Splash screen */}
        <Route path="/" element={<SplashScreen />} />

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* App main routes */}
        <Route path="/homepage" element={<TripPulseHome />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/food" element={<FoodPage />} />
        <Route path="/saved" element={<SavedStories />} />
<Route path="/destination/:id" element={<DestinationPage />} />
<Route path="/livestories" element={<LiveStories/>} />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
