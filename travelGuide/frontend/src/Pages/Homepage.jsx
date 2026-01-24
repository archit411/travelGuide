import React, { useEffect, useState, useRef } from "react";
import "./HomePage.css";
import "./Highlights.css";
import './activetrip.css';
import {
  FiPlus,
  FiUser,
  FiCompass,
  FiCalendar,
  FiNavigation,
  FiX,
  FiSearch,
  FiHome,
  FiStar,
} from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddPost from "./AddStoryModal";
import SearchOverlay from "./SearchOverlay";
import TripProgressCard from "./TripProgressCard";
import ItineraryView from "./ItineraryView";
import "./StoryViewer.css";
import TripPlannerModal from "./TripPlannerModal";
import Explore from "./Exploretab";
import PlacesList from "./Exploretab";
import Tabs from "./Tab";
import ExplorePlaces from "./Tab";

/* ---------------- Helpers ---------------- */
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

  useEffect(() => {
    const preventScroll = (e) => e.preventDefault();
    const scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";
    document.body.style.width = "100%";

    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      document.body.style.width = "";

      document.removeEventListener("touchmove", preventScroll);

      window.scrollTo(0, scrollY);
    };
  }, []);

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
      <div className="story-viewer-card" onClick={(e) => e.stopPropagation()}>
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

/* ================= MAIN HOME PAGE ================= */
export default function HomePage() {
  const navigate = useNavigate();

  const [activeTrip, setActiveTrip] = useState(
    JSON.parse(localStorage.getItem("activeTrip")) || null
  );
  const [showItineraryPage, setShowItineraryPage] = useState(false);
  const [currentDay, setCurrentDay] = useState(
  (parseInt(localStorage.getItem("currentDayIndex") || "0")) + 1
);


  const [stories, setStories] = useState([]);
  const [topPlaces, setTopPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);

  const [viewStory, setViewStory] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showTripPlanner, setShowTripPlanner] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState(null);

  const [city, setCity] = useState("Locating...");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
// 🔥 Keep homepage in sync with current trip day
useEffect(() => {
  const syncDay = () => {
    const storedDay = parseInt(localStorage.getItem("currentDayIndex") || "0");
    setCurrentDay(storedDay + 1); // convert index → day number
  };

  // Run once when page is shown
  syncDay();

  // Run every time user focuses back on this tab/page
  window.addEventListener("focus", syncDay);

  return () => window.removeEventListener("focus", syncDay);
}, []);

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
        crowdLevel: p.placeOneCrowdLevel || "Low",
      },
      p.placeTwo && {
        name: p.placeTwo,
        desc: p.placeTwoDescription,
        img: p.image_url2,
        crowdLevel: p.placeTwoCrowdLevel || "Low",
      },
    ])
    .filter(Boolean);

  function openStory(story) {
    setViewStory({ stories: [story], index: 0 });
  }

  const handleGenerateItinerary = (itinerary) => {
    setGeneratedItinerary(itinerary);
    setShowTripPlanner(false);
    setShowItineraryPage(true);
  };

  useEffect(() => {
    if (generatedItinerary) {
      localStorage.setItem(
        "lastGeneratedItinerary",
        JSON.stringify(generatedItinerary)
      );
    }
  }, [generatedItinerary]);

  useEffect(() => {
    const saved = localStorage.getItem("lastGeneratedItinerary");
    if (saved && !activeTrip) {
      setGeneratedItinerary(JSON.parse(saved));
    }
  }, []);

  if (showItineraryPage && generatedItinerary) {
    return (
      <ItineraryView
        itinerary={generatedItinerary}
        onBack={() => setShowItineraryPage(false)}
        onStartTrip={() => {
          localStorage.setItem(
            "activeTrip",
            JSON.stringify(generatedItinerary)
          );
          localStorage.setItem("currentTripDay", 1);
          setCurrentDay(1);
          setActiveTrip(generatedItinerary);
          setShowItineraryPage(false);
          setGeneratedItinerary(null);
        }}
      />
    );
  }

  return (
    <div className="homepage-modern">
      {/* Modern Header */}
      <header className="header-modern">
        <div className="header-container">
          <div className="header-logo">
            <div className="logo-icon-modern">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <span className="logo-text-modern">
              TripEZ<span>.in</span>
            </span>
          </div>

          {!isMobile && (
            <nav className="header-nav-modern">
              {[
                { id: "home", label: "Home", path: "/homepage" },
                { id: "food", label: "Food", path: "/food" },
                { id: "feed", label: "Feed", path: "/feed" },
              ].map((item) => (
                <button
                  key={item.id}
                  className={`nav-link-modern ${active === item.id ? "active" : ""}`}
                  onClick={() => {
                    setActive(item.id);
                    navigate(item.path);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}

          <div className="header-actions">
            <div className="location-badge">
              <i className="fa-solid fa-location-arrow"></i>
              <span>{city}</span>
            </div>

            {!isMobile && (
              <button className="btn-primary-modern" onClick={() => setShowAdd(true)}>
                <FiPlus size={18} />
                <span>Add Story</span>
              </button>
            )}

            <button className="btn-secondary-modern" onClick={() => navigate("/profile")}>
              <FiUser size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover Your Next
              <span className="hero-highlight"> Adventure</span>
            </h1>
            <p className="hero-subtitle">
              Plan, explore, and share unforgettable travel experiences with TripEZ
            </p>

            <div className="hero-actions">
              <button className="btn-hero-primary" onClick={() => setShowTripPlanner(true)}>
                
                <span>⟡ Plan Your Trip with AI</span>
              </button>
              <button className="btn-hero-secondary" onClick={() => navigate("/feed")}>
                <FiSearch size={20} />
                <span>Discover Stories</span>
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-cards-stack">
              <div className="hero-card card-1">
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400" alt="Mountain" />
                <div className="card-overlay">
                  <h3>Himalayas</h3>
                  <p>Adventure awaits</p>
                </div>
              </div>
              <div className="hero-card card-2">
                <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400" alt="Beach" />
                <div className="card-overlay">
                  <h3>Goa Beaches</h3>
                  <p>Paradise found</p>
                </div>
              </div>
              <div className="hero-card card-3">
                <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400" alt="City" />
                <div className="card-overlay">
                  <h3>Delhi</h3>
                  <p>Cultural hub</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Bar */}
      <section className="quick-actions">
        <div className="actions-container">
          <div className="action-card" onClick={() => setShowTripPlanner(true)}>
            <div className="action-icon">
              <FiCompass size={24} />
            </div>
            <div className="action-content">
              <h3>Discover</h3>
              <p>Where to go?</p>
            </div>
          </div>

          <div className="action-divider"></div>

          <div className="action-card" onClick={() => setShowTripPlanner(true)}>
            <div className="action-icon">
              <FiCalendar size={24} />
            </div>
            <div className="action-content">
              <h3>Plan</h3>
              <p>When to travel?</p>
            </div>
          </div>

          <div className="action-divider"></div>

          <div className="action-card" onClick={() => navigate("/feed")}>
            <div className="action-icon">
              <FiNavigation size={24} />
            </div>
            <div className="action-content">
              <h3>Go</h3>
              <p>How to get there?</p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Trip Status */}
      {activeTrip && (
        <section className="active-trip-section">
          <div className="active-trip-card-modern" onClick={() => navigate("/active-trip")}>
            <div className="trip-status">
              <div className="day-indicator">
                <span className="day-number">D{currentDay}</span>
                <span className="day-label">Day</span>
              </div>
              <div className="trip-details">
                <h3 className="trip-destination">{activeTrip.destination}</h3>
                <p className="trip-dates">{activeTrip.startDate} → {activeTrip.endDate}</p>
              </div>
            </div>

            <div className="trip-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${((currentDay - 1) / activeTrip.days.length) * 100}%`
                  }}
                ></div>
              </div>
              <span className="progress-text">
                {currentDay - 1} of {activeTrip.days.length} days completed
              </span>
            </div>

            <div className="trip-arrow">
              <FiNavigation size={20} />
            </div>
          </div>
        </section>
      )}

      {/* Explore Section */}
      <section className="explore-section">
        <div className="section-container">
          <div className="section-header-modern">
            <h2>Explore Places</h2>
            <p>Discover amazing destinations across India</p>
          </div>
          <ExplorePlaces />
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="featured-section">
        <div className="section-container">
          <div className="section-header-modern">
            <h2>Featured Destinations</h2>
            <p>Handpicked places loved by travelers</p>
            <button className="view-all-btn" onClick={() => navigate("/feed")}>
              View All <FiNavigation size={16} />
            </button>
          </div>

          <div className="destinations-grid">
            {loadingPlaces ? (
              <div className="loading-skeleton">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton-card"></div>
                ))}
              </div>
            ) : places.length === 0 ? (
              <div className="empty-state">
                <FiCompass size={48} />
                <h3>No destinations available</h3>
                <p>Check back soon for amazing places!</p>
              </div>
            ) : (
              places.slice(0, 6).map((place, i) => (
                <div
                  className="destination-card-modern"
                  key={i}
                  onClick={() => {
                    navigate(`/destination/${encodeURIComponent(place.name)}`, {
                      state: { place: place },
                    });
                  }}
                >
                  <div className="destination-image">
                    <img src={place.img} alt={place.name} />
                    <div className="image-overlay"></div>
                  </div>
                  <div className="destination-content">
                    <h3>{place.name}</h3>
                    <p>{place.desc}</p>
                    <div className="destination-meta">
                      <span className="rating">⭐ 4.{Math.floor(Math.random() * 5) + 5}</span>
                      <span className="distance">📍 {Math.floor(Math.random() * 500) + 50}km</span>
                      <span className={`crowd-level ${place.crowdLevel?.toLowerCase()}`}>
                        👥 {place.crowdLevel}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Travel Stories */}
      <section className="stories-section">
        <div className="section-container">
          <div className="section-header-modern">
            <h2>Travel Stories</h2>
            <p>Real experiences from fellow travelers</p>
            <button className="view-all-btn" onClick={() => navigate("/feed")}>
              View All Stories <FiNavigation size={16} />
            </button>
          </div>

          <div className="stories-grid">
            {stories.slice(0, 4).map((story, idx) => (
              <div
                className="story-card-modern"
                key={idx}
                onClick={() => openStory(story)}
              >
                {/* <div className="story-image">
                  <img src={story.image} alt={story.destination} />
                  <div className="story-overlay">
                    <div className="story-user">
                      <div className="user-avatar">
                        {story.userName?.charAt(0) || "U"}
                      </div>
                      <span>{story.userName || "User"}</span>
                    </div>
                    <div className="story-time">{timeAgo(story.createdAt)}</div>
                  </div>
                </div> */}

                <div className="story-content">
                  <div className="story-location">
                    📍 {story.destination || "Unknown"}
                  </div>
                  <div className="story-text">
                    {story.caption?.length > 80
                      ? story.caption.slice(0, 80) + "..."
                      : story.caption || "No caption"}
                  </div>
                  <div className="story-stats">
                    <span>❤️ {story.likes || 0}</span>
                    <span>🌡 {story.temprature || "--"}°C</span>
                    <span className={`crowd-level ${story.crowdLevel?.toLowerCase()}`}>
                      {story.crowdLevel}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Ready for Your Next Adventure?</h2>
            <p>Join thousands of travelers planning their perfect trips with TripEZ</p>
            <button className="btn-cta" onClick={() => setShowTripPlanner(true)}>
              <span>Start Planning</span>
              <FiNavigation size={18} />
            </button>
          </div>
          <div className="cta-visual">
            <div className="cta-stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Destinations</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Travelers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100K+</span>
                <span className="stat-label">Stories</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      {!isMobile && (
        <footer className="footer-modern">
          <div className="footer-container-minimal">
            <div className="footer-brand">
              <div className="footer-logo">
                <i className="fa-solid fa-location-dot"></i>
                <span>TripEZ<span>.in</span></span>
              </div>
              <div className="footer-social">
                <a href="#" className="social-link">
                  <i className="fa-brands fa-instagram social-icon"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fa-brands fa-facebook social-icon"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fa-brands fa-twitter social-icon"></i>
                </a>
              </div>
            </div>

            <div className="footer-links-minimal">
              <div className="footer-section">
                <h4>Quick Links</h4>
                <a href="#">About</a>
                <a href="#">Help</a>
                <a href="#">Privacy</a>
              </div>

              <div className="footer-section">
                <h4>Contact</h4>
                <a href="#">Contact Us</a>
                <a href="#">Terms</a>
                <a href="#">Blog</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom-minimal">
            <p>&copy; 2026 TripEZ. All rights reserved.</p>
          </div>
        </footer>
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <nav className="mobile-nav-modern">
          <div className="mobile-nav-container">
            {/* Left buttons */}
            <button
              className={`mobile-nav-btn ${active === "home" ? "active" : ""}`}
              onClick={() => {
                setActive("home");
                navigate("/homepage");
              }}
            >
              <div className="nav-icon"><FiHome /></div>
              <span className="nav-label">Home</span>
            </button>

            <button
              className={`mobile-nav-btn ${active === "food" ? "active" : ""}`}
              onClick={() => {
                setActive("food");
                navigate("/food");
              }}
            >
              <div className="nav-icon"><FaUtensils /></div>
              <span className="nav-label">Food</span>
            </button>

            {/* Center floating add button */}
            <button
              className="mobile-nav-btn add-btn"
              onClick={() => setShowAdd(true)}
            >
              <div className="nav-icon"><FiPlus /></div>
            </button>

            {/* Right buttons */}
            <button
              className={`mobile-nav-btn ${active === "feed" ? "active" : ""}`}
              onClick={() => {
                setActive("feed");
                navigate("/feed");
              }}
            >
              <div className="nav-icon"><FiSearch /></div>
              <span className="nav-label">Feed</span>
            </button>

            <button
              className={`mobile-nav-btn ${active === "profile" ? "active" : ""}`}
              onClick={() => {
                setActive("profile");
                navigate("/profile");
              }}
            >
              <div className="nav-icon"><FiUser /></div>
              <span className="nav-label">Profile</span>
            </button>
          </div>
        </nav>
      )}

      {/* Mobile Hero Footer */}
      {isMobile && (
        <div className="mobile-hero-footer">
          <h1>
            India's most loved <br />
            travel companion <span>❤️</span>
          </h1>
          <div className="footer-line"></div>
          <p className="footer-brand">TripEZ</p>
        </div>
      )}

      {showTripPlanner && (
        <TripPlannerModal
          onClose={() => setShowTripPlanner(false)}
          onGenerateItinerary={handleGenerateItinerary}
        />
      )}

      {viewStory && (
        <StoryViewer
          stories={viewStory.stories}
          index={viewStory.index}
          onClose={() => setViewStory(null)}
        />
      )}

      {showAdd && (
        <AddPost
          onClose={() => setShowAdd(false)}
          onAddStory={(s) => setStories((prev) => [s, ...prev])}
        />
      )}
    </div>
  );
}