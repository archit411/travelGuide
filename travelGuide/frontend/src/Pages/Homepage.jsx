import { useEffect, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiHome,
  FiBookmark,
  FiUser,
} from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import "./home.css";

function RegionCard({ region }) {
  if (!region) return null;

  const { region: name, weather, imageUrl, ...places } = region;

  // 🖼️ fallback image by region name
  const fallbackImages = {
    goa: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200",
    manali: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200",
    shimla: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?q=80&w=1200",
    jaipur: "https://images.unsplash.com/photo-1616064399191-70fc29388c32?q=80&w=1200",
  };

  const bg =
    imageUrl ||
    fallbackImages[name?.toLowerCase()] ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200";

  return (
    <div className="region-card">
      {/* 🏞️ Top Image */}
      <div
        className="region-img"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="region-overlay">
          <h3>{name || "Unknown Region"}</h3>
          <p>🌤 {weather || "Weather not available"}</p>
        </div>
      </div>

      {/* 📍 Places */}
      <div className="place-list">
        {Object.keys(places)
          .filter((key) => key.startsWith("place") && !key.includes("Description"))
          .map((placeKey, index) => (
            <div key={index} className="place-card">
              <h4>📍 {places[placeKey] || "Untitled Place"}</h4>
              <p>
                {places[placeKey + "Description"] ||
                  "No description provided."}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

// 💀 Skeleton Placeholder
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
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("");

  // 🕒 Get current month
  useEffect(() => {
    const localMonth = new Date().toLocaleString("default", { month: "long" });
    setMonth(localMonth);
  }, []);

  // 🌐 Fetch ALL regions cleanly
  useEffect(() => {
    if (!month) return;

    const fetchData = async () => {
      setLoading(true);
      setTopPlaces([]);

      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/api/getTopPlacesByMonth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          console.error("❌ Unauthorized - check your JWT token or backend CORS.");
          setTopPlaces([]);
          setLoading(false);
          return;
        }

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (Array.isArray(data)) {
          console.log(`✅ Loaded ${data.length} regions`);
          setTopPlaces(data);
        } else {
          console.warn("⚠️ Unexpected API format:", data);
          setTopPlaces([]);
        }
      } catch (err) {
        console.error("Error fetching places:", err);
        setTopPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month]);

  return (
    <div className="tp">
      {/* 🔝 Header */}
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

      {/* 🔍 Search */}
      <div className="tp-search">
        <div className="search">
          <FiSearch />
          <input placeholder="Search destinations..." />
        </div>
      </div>

      <hr className="tp-divider" />

      {/* 🌍 Region Cards Section */}
      <section className="tp-highlights">
        <div className="section-head">
          <h2>{month ? `${month}'s Top Destinations` : "Loading..."}</h2>
        </div>

        <div className="region-grid">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <RegionSkeleton key={i} />)
            : topPlaces.map((region, i) => (
                <RegionCard key={i} region={region} />
              ))}
        </div>
      </section>

      {/* 🇮🇳 Footer */}
      <footer className="tp-footer">
        🇮🇳 Made in India • ❤️ Crafted in Mumbai
      </footer>

      {/* 🧭 Bottom Nav */}
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
