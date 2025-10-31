import { useEffect, useState } from "react";
import {
  FiSearch,
  FiHome,
  FiBookmark,
  FiUser,
} from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import "./home.css";
import { useNavigate } from "react-router-dom";
import AddPost from "./AddStoryModal";


/* 🔹 Skeleton Loader */
function SkeletonCard() {
  return (
    <div className="skeleton-card shimmer">
      <div className="skeleton-img"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-subtext"></div>
    </div>
  );
}

/* 🔹 Place Card */
function PlaceCard({ place }) {
  const { name, description, imageUrl } = place;
  return (
    <div className="place-card-new">
      <div
        className="place-image"
        style={{
          backgroundImage: `url(${
            imageUrl ||
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200"
          })`,
        }}
      ></div>
      <div className="place-info">
        <h4>📍 {name}</h4>
        <p>{description || "No description available."}</p>
      </div>
    </div>
  );
}

/* 🌍 Main Component */
export default function HomePage() {
  const [active, setActive] = useState("home");
  const [topPlaces, setTopPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("");
  const [stories, setStories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  // 🗓️ Get current month
  useEffect(() => {
    const localMonth = new Date().toLocaleString("default", { month: "long" });
    setMonth(localMonth);
  }, []);

  // 🌍 Fetch top places for the month
  useEffect(() => {
    if (!month) return;

    const fetchTopPlaces = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/getTopPlacesByMonth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setTopPlaces(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPlaces();
  }, [month]);

  // ➕ Add new story
  const addStory = (story) => setStories((prev) => [story, ...prev]);

  // 🧭 Flatten places from response
  const places = topPlaces
    .flatMap((region) => [
      region.placeOne && {
        name: region.placeOne,
        description: region.placeOneDescription,
        imageUrl: region.placeOneImageUrl,
      },
      region.placeTwo && {
        name: region.placeTwo,
        description: region.placeTwoDescription,
        imageUrl: region.placeTwoImageUrl,
      },
    ])
    .filter(Boolean);

  return (
    <div className="tp">
      {/* 🌍 Header */}
      <header className="tp-header">
        <div className="tp-brand">
          <img className="brand-logo" src="src/assets/logo.png" alt="TripPulse" />
          <div>
            <h1>TripPulse</h1>
            <div className="brand-sub">Discover • Plan • Go</div>
          </div>
        </div>
        <button className="btn btn--primary" onClick={() => setShowAddModal(true)}>
          + Add Update
        </button>
      </header>

      {/* 🔍 Search Bar */}
      <div className="tp-search">
        <div className="search">
          <FiSearch />
          <input placeholder="Search destinations..." />
        </div>
      </div>

      {/* 📸 Stories Section */}
      {stories.length > 0 && (
        <div className="stories-section">
          <h3>Your Stories</h3>
          <div className="stories-grid">
            {stories.map((s, i) => (
              <div key={i} className="story-card">
                <img src={s.image} alt={s.location} />
                <div className="story-overlay">
                  <p className="story-loc">📍 {s.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🏞️ Top Places Section */}
      <section className="tp-highlights">
        <div className="section-head">
          <h2>{month ? `${month}'s Top Places` : "Loading..."}</h2>
        </div>

        <div className="place-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : places.map((place, i) => <PlaceCard key={i} place={place} />)}
        </div>
      </section>

      {/* 🇮🇳 Footer */}
      <footer className="tp-footer">🇮🇳 Made in India • ❤️ Crafted in Mumbai</footer>

      {/* 🧭 Bottom Navigation */}
      <nav className="tp-nav">
        {[
          { id: "home", label: "Home", icon: <FiHome />, path: "/homepage" },
          { id: "food", label: "Food", icon: <FaUtensils />, path: "/food" },
          { id: "saved", label: "Saved", icon: <FiBookmark />, path: "/saved" },
          { id: "profile", label: "Profile", icon: <FiUser />, path: "/profile" },
        ].map((item) => (
          <button
            key={item.id}
            className={`nav-btn ${active === item.id ? "active" : ""}`}
            onClick={() => {
              setActive(item.id);
              navigate(item.path);
            }}
          >
            <div className="nav-icon">{item.icon}</div>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* ➕ Add Post Modal */}
      {showAddModal && (
        <AddPost onClose={() => setShowAddModal(false)} onAddStory={addStory} />
      )}
    </div>
  );
}
