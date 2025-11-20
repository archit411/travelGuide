import React, { useEffect, useState, useRef } from "react";
import "./HomePage.css";
import "./Highlights.css";
import {
  FiPlus,
  FiUser,
  FiCompass,
  FiCalendar,
  FiNavigation,
  FiX,
  FiSearch,
  FiHome,
} from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddPost from "./AddStoryModal";
import SearchOverlay from "./SearchOverlay";
// import "./StoryCard.css";
import "./StoryViewer.css";
/* ----------------- Helpers ----------------- */
function timeAgo(t) {
  if (!t) return "Just now";
  const sec = Math.floor((Date.now() - Date.parse(t)) / 1000);
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

function StoryViewer({ stories, index: startIndex = 0, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const [progress, setProgress] = useState(
    stories.map((_, i) => (i < startIndex ? 100 : 0))
  );
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef(null);
  const duration = 15000;

  /* -------------------------------------------------
      🔥 FULL SCROLL LOCK (Desktop + Mobile + iOS)
  --------------------------------------------------- */
  useEffect(() => {
    const preventScroll = (e) => e.preventDefault();

    // Lock screen (desktop + android)
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    // Lock touch scroll (iOS + Android)
    document.addEventListener("touchmove", preventScroll, {
      passive: false,
    });

    return () => {
      // Reset scroll behavior
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
      document.body.style.width = "auto";

      // Re-enable touch scroll
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  /* ------------------------------------------------- */

  useEffect(() => {
    if (!stories || !stories.length) return;
    setLoaded(false);
    setProgress((p) =>
      p.map((_, i) => (i < index ? 100 : i === index ? 0 : 0))
    );

    if (timerRef.current) clearInterval(timerRef.current);

    const img = new Image();
    img.src = stories[index].image;

    img.onload = () => {
      setLoaded(true);
      const start = Date.now();

      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        const pct = Math.min((elapsed / duration) * 100, 100);

        setProgress((prev) =>
          prev.map((val, i) => (i === index ? pct : val))
        );

        if (pct >= 100) {
          clearInterval(timerRef.current);
          if (index < stories.length - 1) setIndex((i) => i + 1);
          else onClose();
        }
      }, 100);
    };

    return () => clearInterval(timerRef.current);
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
      <div
        className="story-viewer-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="story-close-btn" onClick={onClose}>
          <FiX size={18} />
        </button>

        <div className="multi-progress">
          {stories.map((_, i) => (
            <div key={i} className="progress-track">
              <div
                className={`progress-filled ${i < index ? "done" : ""}`}
                style={{ width: `${progress[i] || 0}%` }}
              />
            </div>
          ))}
        </div>

        <div className="story-image-wrapper" onClick={handleTap}>
          <img
            className={`story-viewer-image ${loaded ? "loaded" : ""}`}
            src={current.image}
            alt={current.destination}
          />

          <div className="story-info-overlay">
            <h3>📍 {current.destination}</h3>
            {current.caption && (
              <p className="story-caption">{current.caption}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ----------------- Home Page ----------------- */
export default function HomePage() {
  const navigate = useNavigate();

  const [stories, setStories] = useState([]);
  const [topPlaces, setTopPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);

  const [viewStory, setViewStory] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showSearch] = useState(false);

  const [city, setCity] = useState("Locating...");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [active, setActive] = useState("home");

  /* Responsive listener */
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Location */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const data = await res.json();
          setCity(data.address.city || data.address.state || "Unknown");
        } catch {
          setCity("Unknown");
        }
      },
      () => setCity("Unknown")
    );
  }, []);

  /* Fetch stories */
  /* Fetch stories only first time using sessionStorage */
useEffect(() => {
  async function loadStories() {
    const cached = sessionStorage.getItem("stories");
    if (cached) {
      setStories(JSON.parse(cached));
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/travel/getUserPosts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const formatted = data.map((s) => ({
        image: s.image,
        destination: s.destination,
        caption: s.caption,
        userName: s.userName,
        createdAt: s.createdAt,
        temprature: s.temprature,
        crowdLevel: s.crowdLevel,
        likes: s.likes,
      }));

      setStories(formatted);
      sessionStorage.setItem("stories", JSON.stringify(formatted));
    } catch (e) {
      console.log("Error loading stories", e);
    }
  }

  loadStories();
}, []);


  /* Fetch top places */
/* Fetch top places only first time using sessionStorage */
useEffect(() => {
  async function loadPlaces() {
    const cached = sessionStorage.getItem("topPlaces");
    if (cached) {
      setTopPlaces(JSON.parse(cached));
      setLoadingPlaces(false);
      return;
    }

    setLoadingPlaces(true);

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

      setTopPlaces(data);
      sessionStorage.setItem("topPlaces", JSON.stringify(data));
    } catch (e) {
      console.log("Failed loading places", e);
    }

    setLoadingPlaces(false);
  }

  loadPlaces();
}, []);


  const places = topPlaces
    .flatMap((p) => [
      p.placeOne && {
        name: p.placeOne,
        desc: p.placeOneDescription,
        img: p.image_url1,
      },
      p.placeTwo && {
        name: p.placeTwo,
        desc: p.placeTwoDescription,
        img: p.image_url2,
      },
    ])
    .filter(Boolean);

  /* Story viewer handlers */
  function openStoryWithList(indexInList) {
setViewStory({
  stories: [{
  image: stories[indexInList]?.image || "/noimage.png",
  destination: stories[indexInList]?.destination || "Unknown",
  caption: stories[indexInList]?.caption || "",
}], // fresh copy
  index: 0,
  key: Date.now()                           // force React to remake component
});

}
function openStory(story) {
    // To reuse viewer which expects array, pass single-story array.
    setViewStory({ stories: [story], index: 0 });
  }
  return (
    <div className="homepage-light">

      {/* ---------- HEADER ---------- */}
      <header className="header-main">
        <div className="trip-header-inner">
          <div className="trip-logo">
            <div className="logo-circle">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <span className="logo-text">TripEZ<span>.in</span></span>
          </div>

          <div className="trip-header-right">
            <div className="trip-loc-pill">
              <i className="fa-solid fa-location-arrow"></i>
              {city}
            </div>

            <button className="trip-add-btn" onClick={() => setShowAdd(true)}>
              <FiPlus /> Add Post
            </button>

            <button
              className="trip-profile-btn"
              onClick={() => navigate("/profile")}
            >
              <FiUser />
            </button>
          </div>
        </div>
      </header>

      {/* ---------- SEARCH BAR ---------- */}
      <div className="dpg-wrapper">
        <div className="dpg-bar">
          <div className="dpg-item">
            <FiCompass className="dpg-icon" />
            <div>
              <div className="dpg-title">Discover</div>
              <div className="dpg-sub">Where?</div>
            </div>
          </div>
          <div className="dpg-divider"></div>

          <div className="dpg-item">
            <FiCalendar className="dpg-icon" />
            <div>
              <div className="dpg-title">Plan</div>
              <div className="dpg-sub">When?</div>
            </div>
          </div>

          <div className="dpg-divider"></div>
          <div className="dpg-item">
            <FiNavigation className="dpg-icon" />
            <div>
              <div className="dpg-title">Go</div>
              <div className="dpg-sub">How?</div>
            </div>
          </div>
        </div>

        <button className="create-trip-btn">
          <FiCompass /> Create a Trip
        </button>
      </div>

      {/* ---------- FEATURED DESTINATIONS ---------- */}
      <section className="section">
        <div className="section-head">
          <div>Featured Destinations</div>
          <span className="view-all">View All</span>
        </div>

        <div className="featured-grid">
          {places.map((p, i) => (
            <div
              className="place-card"
              key={i}
              onClick={() =>
                navigate(`/destination/${encodeURIComponent(p.name)}`, {
                  state: { place: p },
                })
              }
            >
              <div
                className="place-img"
                style={{ backgroundImage: `url(${p.img})` }}
              />
              <div className="place-overlay">
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- HIGHLIGHTS ---------- */}
       <section className="highlights-section">
        <div className="section-header">
          <div>Today's Highlights</div>
          <span className="view-all">View All</span>
        </div>

        <div className="highlights-scroll">
          {stories.map((story, idx) => (
            <div className="highlight-card" key={idx} onClick={() => openStory(story)}>

              {/* FULL IMAGE */}
              <div
                className="highlight-image"
                style={{ backgroundImage: `url(${story.image})` }}
              ></div>

              {/* TOP — Avatar + Name + Crowd */}
              <div className="hl-top-row">
                <div className="hl-user-info">
                  <div className="hl-avatar">{story.userName?.charAt(0) || "U"}</div>
                  <div className="hl-user-text">
                    <div className="hl-name">{story.userName || "User"}</div>
                    <div className="hl-time">{timeAgo(story.createdAt)}</div>
                  </div>
                </div>

                <div className={`hl-crowd ${story.crowdLevel?.toLowerCase()}`}>
                  {story.crowdLevel}
                </div>
              </div>

              {/* MIDDLE BADGES */}
              <div className="hl-badges-row">
                <div className="hl-badge">🌡 {story.temprature || "--"}°C</div>
                <div className="hl-badge">❤️ {story.likes || 0}</div>
              </div>

              {/* BOTTOM TEXT */}
              <div className="hl-text-block">
                <div className="hl-title">{story.destination || "Unknown"}</div>
                <div className="hl-desc">
                  {story.caption?.length > 70
                    ? story.caption.slice(0, 70) + "..."
                    : story.caption || "No caption"}
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* ---------- NAV ---------- */}
      <nav className="bottom-nav">
        {!isMobile && (
          <div className="nav-web">
            {[
              {
                id: "home",
                label: "Home",
                icon: <FiHome />,
                path: "/homepage",
              },
              {
                id: "food",
                label: "Food",
                icon: <FaUtensils />,
                path: "/food",
              },
              {
                id: "feed",
                label: "Feed",
                icon: <FiSearch />,
                path: "/feed",
              },
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

        {isMobile && (
          <div className="nav-mobile">
            {[
              {
                id: "home",
                label: "Home",
                icon: <FiHome />,
                path: "/homepage",
              },
              {
                id: "food",
                label: "Food",
                icon: <FaUtensils />,
                path: "/food",
              },
              {
                id: "upload",
                label: "Upload",
                icon: <FiX style={{ transform: "rotate(45deg)" }} />,
              },
              {
                id: "story",
                label: "Story",
                icon: <FiSearch />,
                path: "/feed",
              },
              {
                id: "profile",
                label: "Profile",
                icon: <FiUser />,
                path: "/profile",
              },
            ].map((item) => (
              <button
                key={item.id}
                className={`nav-btn ${
                  item.id === "upload" ? "upload-btn" : ""
                } ${active === item.id ? "active" : ""}`}
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
{!isMobile && (
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-left">
             
              <div>
                <h2>TripEZ</h2>
                <p>Discover destinations, plan your trips & explore the world.</p>
              </div>
            </div>

            <div>
              <h3>Company</h3>
              <p>About</p>
              <p>Features</p>
              <p>Works</p>
              <p>Career</p>
            </div>

            <div>
              <h3>Resources</h3>
              <p>Free Guides</p>
              <p>Travel Tips</p>
              <p>Blog</p>
              <p>Community</p>
            </div>

            <div>
              <h3>Newsletter</h3>
              <div className="footer-input">
                <input placeholder="Enter your email" />
                <button>Subscribe</button>
              </div>
            </div>
          </div>

          <p className="footer-bottom">© 2025 TripEZ. All Rights Reserved.</p>
        </footer>
      )}
{isMobile && (
  <div className="travel-hero-footer">
    <h1>
      India’s most loved <br />
      travel companion <span>❤️</span>
    </h1>

    <div className="thf-line"></div>

    <p className="thf-brand">TripEZ</p>
  </div>
)}
      {/* ---------- STORY VIEWER ---------- */}
      {viewStory && <StoryViewer stories={viewStory.stories} index={viewStory.index} onClose={() => setViewStory(null)} />}


      {/* ---------- ADD POST ---------- */}
      {showAdd && (
        <AddPost
          onClose={() => setShowAdd(false)}
          onAddStory={(s) => setStories((prev) => [s, ...prev])}
        />
      )}
    </div>
  );
}
