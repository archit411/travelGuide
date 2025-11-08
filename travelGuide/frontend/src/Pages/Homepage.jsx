import { useEffect, useState } from "react";
import {
  FiSearch,
  FiHome,
  FiBookmark,
  FiUser,
  FiX,
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
  const navigate = useNavigate();
  const { name, description, imageUrl } = place;

  return (
    <div
      className="place-card-new"
      onClick={() => navigate(`/destination/${encodeURIComponent(name)}`)}
    >
      <div
        className="place-image"
        style={{
          backgroundImage: `url(${
            imageUrl?.trim() ||
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

/* 🔹 Story Viewer */
function StoryViewer({ stories, currentIndex, onClose }) {
  const [index, setIndex] = useState(currentIndex);
  const [animKey, setAnimKey] = useState(Date.now());
  const currentStory = stories[index];

  // ⏱ Auto move to next story
  useEffect(() => {
    const timer = setTimeout(() => {
      if (index < stories.length - 1) setIndex(index + 1);
      else onClose();
    }, 15000);
    return () => clearTimeout(timer);
  }, [index]);

  // 🔁 Reset animation when story changes
  useEffect(() => setAnimKey(Date.now()), [index]);

  if (!currentStory) return null;

  return (
    <div className="story-viewer-overlay" onClick={onClose}>
      <div
        className="story-viewer-card fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ❌ Close Button */}
        <button className="story-close-btn" onClick={onClose}>
          <FiX size={22} />
        </button>

        {/* 🔹 Progress Bars */}
        <div className="multi-progress">
          {stories.map((_, i) => (
            <div key={i} className="progress-track">
              {i < index && <div className="progress-filled done"></div>}
              {i === index && (
                <div
                  key={animKey}
                  className="progress-filled active"
                  onAnimationEnd={() => {
                    if (index < stories.length - 1) setIndex(index + 1);
                    else onClose();
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* 🖼 Story Image */}
        <img
          src={currentStory.image}
          alt={currentStory.location}
          className="story-viewer-image"
        />

        {/* 📍 Info Overlay */}
        <div className="story-info-overlay">
          <h3>📍 {currentStory.location}</h3>
          {currentStory.comment && (
            <p className="story-caption">
              {currentStory.comment.length > 100
                ? currentStory.comment.slice(0, 100) + "..."
                : currentStory.comment}
            </p>
          )}
          <div className="story-meta">
            {currentStory.temperature && (
              <span>🌡️ {currentStory.temperature}°C</span>
            )}
            {currentStory.crowd && <span>👥 {currentStory.crowd}</span>}
            {currentStory.rating > 0 && (
              <span>⭐ {currentStory.rating}/5</span>
            )}
          </div>
        </div>

        {/* ⬅➡ Tap zones */}
        <div
          className="tap-left"
          onClick={() => index > 0 && setIndex(index - 1)}
        ></div>
        <div
          className="tap-right"
          onClick={() =>
            index < stories.length - 1 ? setIndex(index + 1) : onClose()
          }
        ></div>
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
  const [selectedStory, setSelectedStory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const localMonth = new Date().toLocaleString("default", { month: "long" });
    setMonth(localMonth);
  }, []);

  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:8080/api/travel/getUserPosts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return console.error("Failed to fetch user stories");

        const data = await res.json();
        if (Array.isArray(data)) {
          setStories(
            data.map((story) => ({
              image: story.image,
              location: story.destination,
              temperature: story.temprature,
              crowd: story.crowdLevel,
              comment: story.caption,
              rating: story.userRating,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching stories:", err);
      }
    };

    fetchUserStories();
  }, []);

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

  const addStory = (story) => setStories((prev) => [story, ...prev]);

  // ✅ FIXED: Map correct image URLs (image_url1, image_url2)
  const places = topPlaces
    .flatMap((region) => [
      region.placeOne && {
        name: region.placeOne,
        description: region.placeOneDescription,
        imageUrl: region.image_url1,
      },
      region.placeTwo && {
        name: region.placeTwo,
        description: region.placeTwoDescription,
        imageUrl: region.image_url2,
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
      </header>

      {/* 🔍 Search Bar */}
      <div className="tp-search">
        <div className="search">
          <FiSearch />
          <input placeholder="Search destinations..." />
        </div>
      </div>

      {/* 📸 Stories Section */}
      <div className="stories-section">
        <h3>Your Stories</h3>
        <div className="stories-grid">
          {/* 🟣 Add Story Bubble */}
          <div
            className="story-card your-story"
            onClick={() => setShowAddModal(true)}
          >
            <div className="add-icon">＋</div>
          </div>

          {/* 🔹 User Stories */}
          {stories.map((s, i) => (
            <div
              key={i}
              className="story-card"
              onClick={() => setSelectedStory({ index: i, stories })}
            >
              <img src={s.image} alt={s.location} />
              <div className="story-overlay">
                <p className="story-loc">{s.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🏞️ Top Places */}
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

      {/* ➕ Add Story Modal */}
      {showAddModal && (
        <AddPost onClose={() => setShowAddModal(false)} onAddStory={addStory} />
      )}

      {/* 👀 Story Viewer */}
      {selectedStory && (
        <StoryViewer
          stories={selectedStory.stories}
          currentIndex={selectedStory.index}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </div>
  );
}
