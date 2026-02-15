import React, { useEffect, useState } from "react";
import { FiSearch, FiX, FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { searchPlaces } from "../utils/tripItineraryService";
import "./searchoverlay.css";

export default function SearchOverlay({ onClose, userLocation }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);

  // 🔹 Fetch popular places (backend)
  useEffect(() => {
    async function fetchPopularPlaces() {
      try {
        const res = await fetch("https://travelguide-1-21sw.onrender.com/api/getPopularPlaces");
        const data = await res.json();
        if (Array.isArray(data)) setPopularPlaces(data);
      } catch (err) {
        console.warn("Failed to fetch popular places:", err);
      }
    }
    fetchPopularPlaces();
  }, []);

  // 🔹 Search Suggestions Debounce
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (query.trim().length > 2) {
        try {
          const results = await searchPlaces(query);
          setSuggestions(results || []);
        } catch (err) {
          console.error("Search failed:", err);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  const handleSelectPlace = (place) => {
    // Navigate to destination page with state
    navigate(`/destination/${encodeURIComponent(place.display_name)}`, {
      state: {
        place: {
          name: place.display_name,
          img: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400"
        }
      }
    });
    onClose();
  };

  // 🔹 Fetch nearby places based on user's location (OpenStreetMap or backend)
  useEffect(() => {
    async function fetchNearby() {
      if (!userLocation) return;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.lat}&lon=${userLocation.lng}`
        );
        const data = await res.json();
        const city = data.address.city || data.address.town || data.address.village;

        // Fake nearby places for now (or replace with backend)
        setNearbyPlaces([
          { name: `${city} Fort`, image: "https://source.unsplash.com/400x300/?fort" },
          { name: `${city} Lake`, image: "https://source.unsplash.com/400x300/?lake" },
          { name: `${city} Temple`, image: "https://source.unsplash.com/400x300/?temple" },
        ]);
      } catch (err) {
        console.warn("Failed to fetch nearby:", err);
      }
    }
    fetchNearby();
  }, [userLocation]);

  return (
    <div className="search-overlay">
      <div className="search-modal fade-in">
        <button className="close-btn" onClick={onClose}>
          <FiX size={22} />
        </button>

        {/* 🔍 Search Input */}
        <div className="overlay-search">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />

          {/* 📝 Suggestions List */}
          {suggestions.length > 0 && (
            <div className="suggestions-list">
              {suggestions.map((place, idx) => (
                <div
                  key={idx}
                  className="suggestion-item"
                  onClick={() => handleSelectPlace(place)}
                >
                  <FiMapPin className="suggestion-icon" />
                  <span>{place.display_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🌍 Popular Places */}
        <div className="popular-section">
          <h3>🌟 Popular Places</h3>
          <div className="places-grid">
            {popularPlaces.slice(0, 5).map((p, i) => (
              <div key={i} className="place-card-mini">
                <img src={p.image_url || "https://source.unsplash.com/400x300/?travel"} alt={p.name} />
                <div className="place-name">{p.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 📍 Nearby Places */}
        {nearbyPlaces.length > 0 && (
          <div className="popular-section">
            <h3>📍 Nearby Places</h3>
            <div className="places-grid">
              {nearbyPlaces.map((p, i) => (
                <div key={i} className="place-card-mini">
                  <img src={p.image} alt={p.name} />
                  <div className="place-name">{p.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
