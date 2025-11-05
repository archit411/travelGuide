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
import "@fortawesome/fontawesome-free/css/all.min.css";

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

/* 🌍 Haversine formula to calculate distance in km */
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1); // km
}

/* 🔹 Place Card with travel modes */
function PlaceCard({ place, userLocation }) {
  const navigate = useNavigate();
  const { name, description, imageUrl, lat, lng } = place;
  const [distance, setDistance] = useState(null);

  // ✅ Accurate distance calculation
  function preciseDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  }

  useEffect(() => {
    async function fetchCoordsAndDistance() {
      if (!userLocation || !name) return;

      let placeLat = lat;
      let placeLng = lng;

      // 🧭 Try cached coordinates first
      const cached = localStorage.getItem(`coords_${name}`);
      if (cached) {
        const { lat: cachedLat, lng: cachedLng } = JSON.parse(cached);
        placeLat = cachedLat;
        placeLng = cachedLng;
      }

      // 🌍 If missing, fetch from OpenStreetMap
      if (!placeLat || !placeLng) {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              name
            )}`
          );
          const data = await res.json();
          if (data[0]) {
            placeLat = parseFloat(data[0].lat);
            placeLng = parseFloat(data[0].lon);
            localStorage.setItem(
              `coords_${name}`,
              JSON.stringify({ lat: placeLat, lng: placeLng })
            );
          }
        } catch (err) {
          console.warn("Could not fetch coordinates for:", name);
        }
      }

      // ✅ Calculate distance
      if (placeLat && placeLng) {
        const km = preciseDistance(
          userLocation.lat,
          userLocation.lng,
          placeLat,
          placeLng
        );
        setDistance(km);
      }
    }

    fetchCoordsAndDistance();
  }, [userLocation, name, lat, lng]);

  // ✈️ Derived travel mode distances
  const carDistance = distance ? (distance * 1.3).toFixed(0) : null;
  const trainDistance = distance ? (distance * 1.1).toFixed(0) : null;
  const flightDistance = distance ? (distance / 1.05).toFixed(0) : null;

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
        <h4 className="place-title">📍 {name}</h4>

        {/* ✅ Show travel modes only when distance known */}
        {distance && (
          <div className="travel-modes">
            <div className="mode">
              <i className="fa-solid fa-car"></i> {carDistance} km
            </div>
            <div className="mode">
              <i className="fa-solid fa-train"></i> {trainDistance} km
            </div>
            <div className="mode">
              <i className="fa-solid fa-plane"></i> {flightDistance} km
            </div>
          </div>
        )}

        <p className="place-desc">{description || "No description available."}</p>
      </div>
    </div>
  );
}


/* 🔹 Story Viewer */
function StoryViewer({ stories, currentIndex, onClose }) {
  const [index, setIndex] = useState(currentIndex);
  const [animKey, setAnimKey] = useState(Date.now());
  const currentStory = stories[index];

  // Auto switch story
  useEffect(() => {
    const timer = setTimeout(() => {
      if (index < stories.length - 1) setIndex(index + 1);
      else onClose();
    }, 15000);
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => setAnimKey(Date.now()), [index]);

  if (!currentStory) return null;

  return (
    <div className="story-viewer-overlay" onClick={onClose}>
      <div
        className="story-viewer-card fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="story-close-btn" onClick={onClose}>
          <FiX size={22} />
        </button>

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

        <img
          src={currentStory.image}
          alt={currentStory.location}
          className="story-viewer-image"
        />

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
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  /* 📅 Detect month */
  useEffect(() => {
    const localMonth = new Date().toLocaleString("default", { month: "long" });
    setMonth(localMonth);
  }, []);

  /* 🌍 Fetch user location */
  const fetchUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setLocation(coords);

        // Reverse geocode (OpenStreetMap)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`
          );
          const data = await res.json();

          const cityName =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.suburb;
          const stateName = data.address.state || "";
          const countryName = data.address.country || "";

          setCity(cityName);
          setLocation((prev) => ({
            ...prev,
            state: stateName,
            country: countryName,
          }));
        } catch (err) {
          console.warn("Reverse geocoding failed:", err);
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
  };

  useEffect(() => {
    fetchUserLocation();
  }, []);

  /* 🗺️ Fetch stories and top places */
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

  const places = topPlaces
    .flatMap((region) => [
      region.placeOne && {
        name: region.placeOne,
        description: region.placeOneDescription,
        imageUrl: region.image_url1,
        lat: region.latitude1,
        lng: region.longitude1,
      },
      region.placeTwo && {
        name: region.placeTwo,
        description: region.placeTwoDescription,
        imageUrl: region.image_url2,
        lat: region.latitude2,
        lng: region.longitude2,
      },
    ])
    .filter(Boolean);

  return (
    <div className="tp">
      {/* 🌍 Header */}
      <header className="tp-header">
        <div className="tp-brand">
          <img className="brand-logo" src="src/assets/logo.jpeg" alt="TripPulse" />
          <div>
            <h1>TripEasy4U</h1>
            <div className="brand-sub">Discover • Plan • Go</div>
          </div>
        </div>
      </header>

      {/* 📍 Location Display */}
      <div className="location-wrapper">
        {locationError ? (
          <p className="error-text">⚠️ {locationError}</p>
        ) : city ? (
          <div className="location-chip fade-in">
            <i className="fa-solid fa-location-dot location-pin"></i>
            <span className="location-text">
              {city}
              {location?.state ? `, ${location.state}` : ""}
              {location?.country ? `, ${location.country}` : ""}
            </span>
          </div>
        ) : (
          <div className="location-chip loading">Detecting your location...</div>
        )}
      </div>

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
          <div className="story-card your-story" onClick={() => setShowAddModal(true)}>
            <div className="add-icon">＋</div>
          </div>
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
            : places.map((place, i) => (
                <PlaceCard key={i} place={place} userLocation={location} />
              ))}
        </div>
      </section>

      <footer className="tp-footer">🇮🇳 Made in India • ❤️ Crafted in Mumbai</footer>

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

      {showAddModal && (
        <AddPost onClose={() => setShowAddModal(false)} onAddStory={addStory} />
      )}

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
