import { useEffect, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiHome,
  FiBookmark,
  FiUser,
  FiHeart,
  FiChevronRight,
} from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import "./home.css";

function RegionCard({ region }) {
  if (!region) return null; // ✅ prevents undefined errors

  const { region: name, weather, ...places } = region;

  return (
    <div className="region-card">
      <h3 className="region-title">{name || "Unknown Region"}</h3>
      <p className="region-weather">🌤 {weather || "Weather not available"}</p>

      <div className="place-list">
        {Object.keys(places)
          .filter((key) => key.startsWith("place") && !key.includes("Description"))
          .map((placeKey, index) => (
            <div key={index} className="place-item">
              <h4>{places[placeKey] || "Untitled Place"}</h4>
              <p>{places[placeKey + "Description"] || "No description provided."}</p>
            </div>
          ))}
      </div>
    </div>
  );
}



function RegionSkeleton() {
  return (
    <div className="region-card skeleton-card">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-place"></div>
      <div className="skeleton skeleton-place"></div>
    </div>
  );
}

export default function TripPulse() {
  const [active, setActive] = useState("home");
  const [topPlaces, setTopPlaces] = useState([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("");

  // 🕒 Get current month
  useEffect(() => {
    const localMonth = new Date().toLocaleString("default", { month: "long" });
    setMonth(localMonth);
  }, []);

  // 🌐 Fetch all regions
  useEffect(() => {
    if (!month) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/getTopPlacesByMonth", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` //attach jwt token 
          },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        // Display cards one by one (progressive loading)
        let i = 0;
        const interval = setInterval(() => {
          if (i < data.length) {
            setTopPlaces((prev) => [...prev, data[i]]);
            i++;
          } else {
            clearInterval(interval);
            setLoading(false);
          }
        }, 400); // show new card every 400ms for smooth loading
      } catch (err) {
        console.error("Error fetching places:", err);
        setTopPlaces([]);
        setLoading(false);
      }
    };

    fetchData();
  }, [month]);

  return (
    <div className="tp">
      {/* Header */}
      <header className="tp-header">
        <div className="tp-brand">
          <img className="brand-logo" src="src/assets/logo.png" alt="TripPulse" />
          <div>
            <h1>TripPulse</h1>
            <div className="brand-sub">Discover • Plan • Go</div>
          </div>
        </div>

        <button className="btn btn--primary">
          <span className="btn__icon">+</span> Add Update
        </button>
      </header>

      {/* Search */}
      <div className="tp-search">
        <div className="search">
          <FiSearch />
          <input placeholder="Search destinations..." />
        </div>
      </div>

      <hr className="tp-divider" />

      {/* 🧭 All Regions Section */}
      <section className="tp-highlights">
        <div className="section-head">
          <h2>{month ? `${month}'s Top Destinations` : "Loading..."}</h2>
        </div>
<div className="region-grid">
  {loading
    ? Array.from({ length: 3 }).map((_, i) => <RegionSkeleton key={i} />)
    : topPlaces
        .filter((r) => r && typeof r === "object") // ✅ only valid data
        .map((region, i) => <RegionCard key={i} region={region} />)}
</div>

      </section>

      {/* Footer */}
      <footer className="tp-footer">🇮🇳 Made in India • ❤️ Crafted in Mumbai</footer>

      {/* Bottom Navigation */}
      <nav className="tp-nav">
        {[
          { id: "home", label: "Home", icon: <FiHome /> },
          { id: "food", label: "Food", icon: <FaUtensils /> },
          { id: "saved", label: "Saved", icon: <FiBookmark /> },
          { id: "profile", label: "Profile", icon: <FiUser /> },
        ].map((item) => (
          <button
            key={item.id}
            className={`nav-btn ${active === item.id ? "active" : ""}`}
            onClick={() => setActive(item.id)}
          >
            <div className="nav-icon">{item.icon}</div>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
