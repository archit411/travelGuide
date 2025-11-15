import React, { useEffect, useRef, useState } from "react";
import { FiSearch, FiHome, FiUser, FiX } from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddPost from "./AddStoryModal";
import SearchOverlay from "./SearchOverlay";

// styles (ensure these files exist in src/Pages/styles/)
import "./Header.css";
import "./Hero.css";
import "./Highlights.css";
import "./Featured.css";
import "./PlaceCard.css";
import "./StoryCard.css";
import "./StoryViewer.css";
import "./Navigation.css";
import "./HomeLayout.css";

/* ----------------- Helpers ----------------- */
function timeAgo(isoOrMs) {
  if (!isoOrMs) return "Just now";
  const t = typeof isoOrMs === "number" ? isoOrMs : Date.parse(isoOrMs);
  if (Number.isNaN(t)) return "Just now";
  const sec = Math.floor((Date.now() - t) / 1000);
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}
function formatLocationShort(cityName, stateName) {
  if (!cityName) return "";
  if (!stateName) return cityName;

  const stateShort = stateName
    .split(" ")     // Handle names like "Madhya Pradesh"
    .map(w => w[0]) // Take first letter of each word
    .join("")       // MP, MH, UP, etc.
    .toUpperCase();

  return `${cityName}, ${stateShort}`;
}

/* Avatar initial bubble */
function Avatar({ name }) {
  const initial = name ? name.trim()[0].toUpperCase() : "T";
  return <div className="hl-avatar">{initial}</div>;
}

/* Crowd badge */
function CrowdBadge({ level }) {
  const text = (level || "").toString().toLowerCase();
  if (["high", "h"].includes(text)) return <span className="crowd high">High</span>;
  if (["medium", "med", "m"].includes(text)) return <span className="crowd medium">Medium</span>;
  return <span className="crowd low">Low</span>;
}

/* Small skeleton used while loading */
function SkeletonPlace({ style }) {
  return <div className="skeleton-place" style={style}></div>;
}

/* Place card for Featured section */
function PlaceCard({ place }) {
  const navigate = useNavigate();
  const image =
    place.imageUrl ||
    place.image_url1 ||
    place.image_url2 ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200";

  return (
    <div
      className="place-card featured-card"
      onClick={() =>
        navigate(`/destination/${encodeURIComponent(place.name || "place")}`, {
          state: { place },
        })
      }
    >
      <div className="place-bg" style={{ backgroundImage: `url(${image})` }} />
      <div className="place-overlay">
        <div className="place-inner">
          <div className="place-title">{place.name}</div>
          {place.description && <div className="place-sub">{place.description}</div>}
        </div>
      </div>
    </div>
  );
}

/* Highlight small rectangular story card */
function HighlightSmall({ story, openStory }) {
  const likes =
    typeof story.likes === "number"
      ? story.likes
      : story.userRating
        ? Math.round(story.userRating * 20)
        : Math.floor(Math.random() * 200) + 12;

  const image = story.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200";

  return (
    <div className="hl-small-card" onClick={() => openStory(story)}>
      <div className="hl-small-image" style={{ backgroundImage: `url(${image})` }} />
      <div className="hl-small-meta">
        {/* We show destination under the small card as requested */}
        <div className="hl-small-location">{story.destination || "Unknown"}</div>
      </div>
    </div>
  );
}

/* Story viewer modal (keeps your behavior) */
function StoryViewer({ stories, index: startIndex = 0, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const [progress, setProgress] = useState(stories.map((_, i) => (i < startIndex ? 100 : 0)));
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef(null);
  const duration = 15000;

  useEffect(() => {
    if (!stories || !stories.length) return;
    setLoaded(false);
    setProgress((p) => p.map((_, i) => (i < index ? 100 : i === index ? 0 : 0)));

    if (timerRef.current) clearInterval(timerRef.current);

    const img = new Image();
    img.src = stories[index].image;
    img.onload = () => {
      setLoaded(true);
      const start = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        const pct = Math.min((elapsed / duration) * 100, 100);
        setProgress((prev) => prev.map((val, i) => (i === index ? pct : val)));
        if (pct >= 100) {
          clearInterval(timerRef.current);
          if (index < stories.length - 1) setIndex((i) => i + 1);
          else onClose();
        }
      }, 100);
    };

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [index, stories]);

  function handleTap(e) {
    const x = e.clientX;
    const w = window.innerWidth;
    clearInterval(timerRef.current);
    if (x < w / 3) setIndex((i) => Math.max(0, i - 1));
    else if (x > (w * 2) / 3) setIndex((i) => Math.min(stories.length - 1, i + 1));
  }

  if (!stories || !stories.length) return null;

  const current = stories[index];

  return (
    <div className="story-viewer-overlay" onClick={onClose}>
      <div className="story-viewer-card" onClick={(e) => e.stopPropagation()}>
        <button className="story-close-btn" onClick={onClose}>
          <FiX size={18} />
        </button>

        <div className="multi-progress">
          {stories.map((_, i) => (
            <div key={i} className="progress-track">
              <div className={`progress-filled ${i < index ? "done" : ""}`} style={{ width: `${progress[i] || 0}%` }} />
            </div>
          ))}
        </div>

        <div className="story-image-wrapper" onClick={handleTap}>
          <img className={`story-viewer-image ${loaded ? "loaded" : ""}`} src={current.image} alt={current.destination} />
          <div className="story-info-overlay">
            <h3>📍 {current.destination}</h3>
            {current.caption && <p className="story-caption">{current.caption}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------- Main HomePage ----------------- */
export default function HomePage() {
  const navigate = useNavigate();

  const [active, setActive] = useState("home");
  const [month, setMonth] = useState("");
  const [stories, setStories] = useState([]);
  const [topPlaces, setTopPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);

  const [location, setLocation] = useState(null);
  const [city, setCity] = useState("");
  const [locationError, setLocationError] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [viewStory, setViewStory] = useState(null); // { stories: [...], index: 0 }
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => setMonth(new Date().toLocaleString("default", { month: "long" })), []);

  /* Geolocation and reverse geocode */
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`);
          const data = await res.json();
          const cityName =
  data.address.city ||
  data.address.town ||
  data.address.village ||
  data.address.suburb ||
  "";

const stateName = data.address.state || "";

// Final format → "Thane, Maharashtra"
const formattedLocation =
  cityName && stateName ? `${cityName}, ${stateName}` : cityName || stateName;

setCity(formattedLocation);

        } catch (err) {
          console.warn("reverse failed", err);
        }
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError("Location permission denied.");
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError("Location unavailable.");
            break;
          case err.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError("An unknown location error occurred.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  /* Fetch stories -> Today's Highlights */
  useEffect(() => {
    async function loadStories() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("https://travelguide-1-21sw.onrender.com/api/travel/getUserPosts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          console.error("failed fetch stories", res.status);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          const normalized = data.map((s) => ({
            image: s.image || s.imageUrl || s.image_url || "",
            destination: s.destination || s.title || "Unknown",
            temprature: s.temprature || s.temperature || null,
            crowdLevel: s.crowdLevel || s.crowd || "low",
            caption: s.caption || s.description || "",
            userRating: s.userRating || s.rating || 0,
            likes: s.likes || s.likeCount || null,
            userName: s.userName || s.username || s.author || "Traveler",
            createdAt: s.createdAt || s.createdAtMillis || s.timestamp || null,
          }));
          setStories(normalized);
        }
      } catch (err) {
        console.error("error stories", err);
      }
    }
    loadStories();
  }, []);

  /* Fetch top places */
  useEffect(() => {
    if (!month) return;
    async function loadPlaces() {
      setLoadingPlaces(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://travelguide-1-21sw.onrender.com/api/getTopPlacesByMonth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          console.error("failed top places", res.status);
          setTopPlaces([]);
          return;
        }
        const data = await res.json();
        setTopPlaces(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("error top places", err);
      } finally {
        setLoadingPlaces(false);
      }
    }
    loadPlaces();
  }, [month]);

  /* map topPlaces -> flattened place list */
  const places = topPlaces
    .flatMap((region) => [
      region.placeOne && { name: region.placeOne, description: region.placeOneDescription, imageUrl: region.image_url1 },
      region.placeTwo && { name: region.placeTwo, description: region.placeTwoDescription, imageUrl: region.image_url2 },
    ])
    .filter(Boolean);

  function openStory(story) {
    // To reuse viewer which expects array, pass single-story array.
    setViewStory({ stories: [story], index: 0 });
  }

  function openStoryWithList(indexInList = 0) {
    setViewStory({ stories: stories, index: indexInList });
  }

  return (
    <div className="home-root">
<div className="header-container">

  {/* Top */}
  <div className="header-top">
    <div className="header-left">
      <img src="/logo.jpeg" className="header-logo-big" alt="logo" />
      <span className="header-main-brand">tripEZ</span>
    </div>

    <div className="header-actions">
      <button className="add-post-btn" onClick={() => setShowAdd(true)}>
        <FiX style={{ transform: "rotate(45deg)" }} size={16} /> Add Post
      </button>
      <div className="profile-circle">
        <i className="fa-solid fa-user"></i>
      </div>
    </div>
  </div>

  {/* TRIPEZ */}
     <div className="loc-row">
        {locationError ? (
          <div className="loc-error">⚠️ {locationError}</div>
        ) : city ? (
          <div className="loc-chip"><i className="fa-solid fa-location-arrow fa-bounce" style={{color: "#3b82f6"}}></i> {city}</div>
        ) : (
          <div className="loc-chip loading">Detecting your location...</div>
        )}
      </div>

  {/* Grid */}
  <div className="header-main-grid">
    
    {/* Left */}
    <div className="header-left-col">
      <h1 className="header-heading-large">
        Plan Your<br />
        <span className="escape-text-big">Escape</span>
      </h1>
    </div>

    {/* Right */}
    <div className="header-right-col">

      <div className="search-options-row">
        <div className="search-card medium">
          <i className="fa-regular fa-compass icon-blue-outline"></i>
          <div>
            <div className="search-label">Discover</div>
            <div className="search-placeholder">Where?</div>
          </div>
        </div>

        <div className="search-card medium">
          <i className="fa-regular fa-calendar icon-blue-outline"></i>
          <div>
            <div className="search-label">Plan</div>
            <div className="search-placeholder">When?</div>
          </div>
        </div>

        <div className="search-card medium">
          <i className="fa-solid fa-location-arrow icon-blue-outline"></i>
          <div>
            <div className="search-label">Go</div>
            <div className="search-placeholder">How?</div>
          </div>
        </div>
      </div>

      <button className="header-search-btn extra-wide">
        <i className="fa-solid fa-magnifying-glass"></i>
        Search
      </button>

    </div>
  </div>
</div>

{/* ---------------- END HEADER ---------------- */}

{/* ---------------- END FIGMA HEADER ---------------- */}



      {/* Location chip */}
   

      {/* --- TOP PLACES (moved earlier) --- */}
      <section className="featured">
        <div className="section-head">
          <h2>Featured Destinations</h2>
        </div>
        <p className="featured-sub">
          Handpicked travel experiences to the most iconic, breathtaking, and exciting places. Discover your next adventure and
          start making memories today.
        </p>

        <div className="featured-grid">
          {loadingPlaces ? Array.from({ length: 6 }).map((_, i) => <SkeletonPlace key={i} />) : places.map((p, i) => <PlaceCard key={i} place={p} />)}
        </div>
      </section>

      {/* ---------------------- TODAY'S HIGHLIGHTS (UPDATED UI) ---------------------- */}
      <section className="highlights-section">
        <div className="section-header">
          <h2>Today's Highlights</h2>
        </div>

        <div className="highlights-scroll">
          {stories.map((s, idx) => (
            <div className="highlight-card" key={idx}>

              {/* Image */}
              <div
                className="highlight-image"
                style={{ backgroundImage: `url(${s.image})` }}
              ></div>

              {/* Text Info */}
              <div className="highlight-info">
                <h4>{s.location}</h4>

                <p>{s.caption?.length > 80 ? s.caption.slice(0, 80) + "..." : s.caption}</p>

                <div className="highlight-meta">
                  {s.temperature && <span>🌡 {s.temperature}°C</span>}
                  {s.crowd && <span>👥 {s.crowd}</span>}
                  {s.rating > 0 && <span>⭐ {s.rating}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      <footer className="home-footer">🇮🇳 Made in India • ❤️ Crafted in Mumbai</footer>

      <nav className="bottom-nav">

  {/* WEB VIEW NAV */}
  {/* <div className="nav-web only-web">
    {[
      { id: "home", label: "Home", icon: <FiHome />, path: "/homepage" },
      { id: "food", label: "Food", icon: <FaUtensils />, path: "/food" },
      { id: "feed", label: "Feed", icon: <FiSearch />, path: "/feed" },
    ].map((item) => (
      <button
        key={item.id}
        className={`nav-btn ${active === item.id ? "active" : ""}`}
        onClick={() => {
          setActive(item.id);
          navigate(item.path);
        }}
      >
        <div className="nav-ic">{item.icon}</div>
        <div className="nav-label">{item.label}</div>
      </button>
    ))}
  </div> */}

  {/* MOBILE VIEW NAV */}
  <nav className="bottom-nav">
  {/* WEB NAV ONLY */}
  {window.innerWidth > 768 && (
    <div className="nav-web">
      {[
        { id: "home", label: "Home", icon: <FiHome />, path: "/homepage" },
        { id: "food", label: "Food", icon: <FaUtensils />, path: "/food" },
        { id: "feed", label: "Feed", icon: <FiSearch />, path: "/feed" },
      ].map((item) => (
        <button
          key={item.id}
          className={`nav-btn ${active === item.id ? "active" : ""}`}
          onClick={() => {
            setActive(item.id);
            navigate(item.path);
          }}
        >
          <div className="nav-ic">{item.icon}</div>
          <div className="nav-label">{item.label}</div>
        </button>
      ))}
    </div>
  )}

  {/* MOBILE NAV ONLY */}
  {window.innerWidth <= 768 && (
    <div className="nav-mobile">
      {[
        { id: "home", label: "Home", icon: <FiHome />, path: "/homepage" },
        { id: "food", label: "Food", icon: <FaUtensils />, path: "/food" },
        { id: "upload", label: "Upload", icon: <FiX style={{ transform: "rotate(45deg)" }} /> },
        { id: "story", label: "Story", icon: <FiSearch />, path: "/feed" },
        { id: "profile", label: "Profile", icon: <FiUser />, path: "/profile" },
      ].map((item) => (
        <button
          key={item.id}
          className={`nav-btn ${item.id === "upload" ? "upload-btn" : ""} ${active === item.id ? "active" : ""}`}
          onClick={() => {
            if (item.id === "upload") {
              setShowAdd(true);
              return;
            }
            setActive(item.id);
            navigate(item.path);
          }}
        >
          <div className="nav-ic">{item.icon}</div>
          <div className="nav-label">{item.label}</div>
        </button>
      ))}
    </div>
  )}
</nav>


</nav>




      {showAdd && <AddPost onClose={() => setShowAdd(false)} onAddStory={(st) => setStories((p) => [st, ...p])} />}
      {viewStory && <StoryViewer stories={viewStory.stories} index={viewStory.index} onClose={() => setViewStory(null)} />}
      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} userLocation={location} />}
    </div>
  );
}
