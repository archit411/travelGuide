import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import SplashScreen from "./Pages/SplashScreen";
import ProfilePage from "./Pages/ProfilePage";
import TripPulseHome from "./Pages/Homepage";
import DestinationPage from "./Pages/Destination";
import LiveStories from "./Pages/LiveStories";
import FoodPage from "./Pages/FoodPage";
import SavedStories from "./Pages/SavedStories";
import Layout from "../src/Pages/Layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Splash screen */}
        <Route path="/" element={<SplashScreen />} />

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/*All routes inside Layout will show BottomNav */}
        <Route element={<Layout />}>
          <Route path="/homepage" element={<TripPulseHome />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/food" element={<FoodPage />} />
          <Route path="/saved" element={<SavedStories />} />
        </Route>

        {/*Routes without BottomNav */}
        <Route path="/destination/:id" element={<DestinationPage />} />
        <Route path="/livestories" element={<LiveStories />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
