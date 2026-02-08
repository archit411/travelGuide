import React, { useEffect, useState, useRef } from "react";
import "./HomePage.css";
import "./Highlights.css";
import './activetrip.css';
import { motion, AnimatePresence } from "framer-motion";
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
  FiChevronDown,
  FiHeart,
} from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddPost from "./AddStoryModal";
import SearchOverlay from "./SearchOverlay";
import TripProgressCard from "./TripProgressCard";
import ItineraryView from "./ItineraryView";
import { searchPlaces } from "../utils/tripItineraryService";
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

  const [active, setActive] = useState("home");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Hero Search / Location States
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [heroSearch, setHeroSearch] = useState("");
  const [heroSuggestions, setHeroSuggestions] = useState([]);

  const [city, setCity] = useState("Locating...");
  const [locInput, setLocInput] = useState("");
  const [locSuggestions, setLocSuggestions] = useState([]);
  const [showAIWelcome, setShowAIWelcome] = useState(true);

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

  // Hero Search Debounce
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (heroSearch.length > 2) {
        try {
          const res = await searchPlaces(heroSearch);
          setHeroSuggestions(res || []);
        } catch (err) {
          console.error("Search error:", err);
        }
      } else {
        setHeroSuggestions([]);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [heroSearch]);

  // Location Search Debounce
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (locInput.length > 2) {
        try {
          const res = await searchPlaces(locInput);
          setLocSuggestions(res || []);
        } catch (err) {
          console.error("Loc search error:", err);
        }
      } else {
        setLocSuggestions([]);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [locInput]);

  const handleSelectHeroSuggestion = (place) => {
    setHeroSearch("");
    setShowSearchModal(false);
    navigate(`/destination/${encodeURIComponent(place.display_name)}`, {
      state: { place: { name: place.display_name, img: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400" } }
    });
  };

  const handleSelectLocation = (place) => {
    setCity(place.display_name.split(',')[0]);
    setShowLocationModal(false);
    setLocInput("");
    setLocSuggestions([]);
  };

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

  /* State for request Params (for regenerate) */
  const [lastRequestParams, setLastRequestParams] = useState(null);

  const handleGenerateItinerary = (itinerary, requestParams) => {
    setGeneratedItinerary(itinerary);
    setLastRequestParams(requestParams);
    setShowTripPlanner(false);
    setShowItineraryPage(true);
  };

  const handleRegenerate = () => {
    // Open planner with previous data
    setShowItineraryPage(false);
    setShowTripPlanner(true);
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
        onRegenerate={handleRegenerate}
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
      {/* Trip Planner Modal with Initial Data */}
      {showTripPlanner && (
        <TripPlannerModal
          onClose={() => {
            setShowTripPlanner(false);
            setShowAIWelcome(true);
          }}
          onGenerateItinerary={handleGenerateItinerary}
          initialData={lastRequestParams}
        />
      )}
      {/* Modern Header */}
      {/* Header - Hidden on mobile in favor of hero-embedded navigation */}
      {!isMobile && (
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

            <div className="header-actions">
              <div className="location-badge">
                <i className="fa-solid fa-location-arrow"></i>
                <span>{city}</span>
              </div>

              <button className="btn-primary-modern" onClick={() => setShowAdd(true)}>
                <FiPlus size={18} />
                <span>Add Story</span>
              </button>

              <button className="btn-secondary-modern" onClick={() => navigate("/profile")}>
                <FiUser size={18} />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Hero Section */}
      {isMobile ? (
        <section className="hero-mobile-premium">
          <div className="hero-mobile-bg">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200" alt="Travel Background" />
            <div className="hero-mobile-overlay"></div>
          </div>

          <div className="hero-mobile-top">
            <div className="mobile-header-left">

              <div className="mobile-location-wrapper">
                <div className="mobile-city-name" onClick={() => {
                  console.log("Opening Location Modal");
                  setShowLocationModal(true);
                }}>
                  {city} <FiChevronDown style={{ color: '#3b82f6' }} size={14} />
                </div>
                <div className="mobile-location-label">Your Location</div>
              </div>
            </div>

            <div className="mobile-header-right-new">


            </div>
          </div>

          <div className="hero-mobile-main">
            <h1 className="hero-mobile-title">
              Discover your next travel destination
            </h1>
            <p className="hero-mobile-subtitle">Travel Stories & Inspirations</p>

            <div className="hero-mobile-search-wrapper">
              <motion.div
                className="hero-mobile-search-bar-white"
                onClick={() => {
                  console.log("Opening Search Modal");
                  setShowSearchModal(true);
                }}
                whileTap={{ scale: 0.96 }}
              >
                <FiSearch className="mobile-search-icon-grey" />
                <div className="mobile-search-placeholder">
                  Search for <strong>Delhi</strong>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      ) : (
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
                  <span>✨ Plan Your Trip with Trez</span>
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
      )}

      {/* Premium Floating AI Assistant (Modern App Style) */}
      {isMobile && (
        <div className="mobile-ai-bot-container">
          <AnimatePresence>
            {showAIWelcome && (
              <motion.div
                className="ai-welcome-card"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="ai-card-content">
                  <span className="ai-sparkle">✨</span>
                  <p>Hi, I am <strong>Trez</strong>! Need help planning your next {city} trip?</p>
                  <button className="ai-ask-btn" onClick={() => {
                    setShowTripPlanner(true);
                    setShowAIWelcome(false);
                  }}>
                    Plan with AI
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            className="ai-floating-bot"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setShowTripPlanner(true);
              setShowAIWelcome(false);
            }}
          >
            <div className="bot-visual">
              <div className="bot-face">
                <div className="bot-eyes">
                  <div className="eye"></div>
                  <div className="eye"></div>
                </div>
                <div className="bot-smile"></div>
              </div>
              <div className="bot-glow"></div>
            </div>
          </motion.button>
        </div>
      )}

      {/* Quick Actions Bar - Hidden on Mobile */}
      {!isMobile && (
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
      )}

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
            {/* <h2>{isMobile ? "Where You Should Go Next?" : "Explore Places"}</h2> */}
            <p>{isMobile ? "" : "Discover amazing destinations across India"}</p>
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
            {/* <button className="view-all-btn" onClick={() => navigate("/feed")}>
              View All <FiNavigation size={16} />
            </button> */}
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
                      {/* <span className="rating">⭐ 4.{Math.floor(Math.random() * 5) + 5}</span> */}
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
            {/* <button className="view-all-btn" onClick={() => navigate("/feed")}>
              View All Stories <FiNavigation size={16} />
            </button> */}
          </div>

          <div className="stories-grid">
            {stories.slice(0, 6).map((story, idx) => (
              <div
                className="story-card-modern"
                key={idx}
                onClick={() => openStory(story)}
              >
                {/* <div className="story-image">
                  <img src={story.image} alt={story.destination} />
                  <div className="story-overlay">
                    <div className="story-user-minimal">
                      <div className="user-avatar-tiny">
                        {story.userName?.charAt(0) || "U"}
                      </div>
                      <span>{story.userName || "User"}</span>
                    </div>
                    <div className="story-date-minimal">{timeAgo(story.createdAt)}</div>
                  </div>
                </div>  */}

                <div className="story-content">
                  <div className="story-location-minimal">
                    📍 {story.destination || "Unknown"}
                  </div>
                  <div className="story-text-minimal">
                    {story.caption?.length > 60
                      ? story.caption.slice(0, 60) + "..."
                      : story.caption || "No caption"}
                  </div>
                  <div className="story-stats-minimal">
                    <div className="stat-pill"><FiStar size={12} /> {Math.floor(Math.random() * 2) + 4}.{Math.floor(Math.random() * 9)}</div>
                    <div className="stat-pill">🌡 {story.temprature || "--"}°C</div>
                    <div className={`crowd-level-mini ${story.crowdLevel?.toLowerCase()}`}>
                      {story.crowdLevel}
                    </div>
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

      {!isMobile && (
        <footer className="footer-modern">
          <div className="footer-container-minimal">
            <div className="footer-column-minimal">
              <div className="header-logo" style={{ marginBottom: '16px' }}>
                <div className="logo-icon-modern">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <span className="logo-text-modern">
                  TripEZ<span>.in</span>
                </span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.6', maxWidth: '300px' }}>
                Your ultimate companion for discovering, planning and sharing amazing travel experiences across India and beyond.
              </p>
            </div>
            <div className="footer-links-grid">
              <div className="footer-column">
                <h4>Platform</h4>
                <a href="#">Explore</a>
                <a href="#">Food Guide</a>
                <a href="#">Trip Planner</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Contact</a>
                <a href="#">Terms</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom-minimal">
            <p>&copy; 2026 TripEZ. All rights reserved.</p>
          </div>
        </footer>
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

      {/* Location Picker Popup */}
      {showLocationModal && (
        <div className="fixed-overlay-premium" onClick={() => setShowLocationModal(false)}>
          <motion.div
            className="modal-popup-premium"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-premium">
              <h3>Select Location</h3>
              <button className="close-pill-btn" onClick={() => setShowLocationModal(false)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="modal-body-premium">
              <div className="premium-input-wrapper">
                <FiCompass className="input-icon" />
                <input
                  autoFocus
                  placeholder="Search for a city..."
                  value={locInput}
                  onChange={(e) => setLocInput(e.target.value)}
                />
              </div>
              <div className="suggestions-list-premium">
                {locSuggestions.length > 0 ? (
                  locSuggestions.map((p, i) => (
                    <div className="suggestion-item-premium" key={i} onClick={() => handleSelectLocation(p)}>
                      <FiNavigation className="item-icon" />
                      <div className="item-text">
                        <span className="main-name">{p.display_name.split(',')[0]}</span>
                        <span className="sub-name">{p.display_name.split(',').slice(1).join(',')}</span>
                      </div>
                    </div>
                  ))
                ) : locInput.length > 0 ? (
                  <div className="empty-suggestions">No cities found</div>
                ) : (
                  <div className="helper-text">Try searching for "Mumbai", "Paris", or "Tokyo"</div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Destination Search Popup */}
      {showSearchModal && (
        <div className="fixed-overlay-premium" onClick={() => setShowSearchModal(false)}>
          <motion.div
            className="modal-popup-premium"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-premium">
              <h3>Find Destination</h3>
              <button className="close-pill-btn" onClick={() => setShowSearchModal(false)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="modal-body-premium">
              <div className="premium-input-wrapper">
                <FiSearch className="input-icon" />
                <input
                  autoFocus
                  placeholder="Where do you want to go?"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                />
              </div>
              <div className="suggestions-list-premium">
                {heroSuggestions.length > 0 ? (
                  heroSuggestions.map((p, i) => (
                    <div className="suggestion-item-premium" key={i} onClick={() => handleSelectHeroSuggestion(p)}>
                      <FiStar className="item-icon" />
                      <div className="item-text">
                        <span className="main-name">{p.display_name.split(',')[0]}</span>
                        <span className="sub-name">{p.display_name.split(',').slice(1).join(',')}</span>
                      </div>
                    </div>
                  ))
                ) : heroSearch.length > 0 ? (
                  <div className="empty-suggestions">No places found</div>
                ) : (
                  <div className="helper-text">Enter a place name like "Taj Mahal" or "Switzerland"</div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}