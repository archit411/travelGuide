// File: /src/Pages/FeedPage.jsx
import React, { useEffect, useState } from "react";
import { FiSearch, FiMapPin, FiBookmark, FiPlus } from "react-icons/fi";
import { FaHeart, FaRegComment } from "react-icons/fa";
import "./FeedPage.css";
import Navbar from "./Navbar";

export default function FeedPage() {
  const [city, setCity] = useState("Mumbai");
  const [locationError, setLocationError] = useState("");
  const [query, setQuery] = useState("");

  // Dummy stories (circular avatars)
const [stories] = useState([
  {
    id: "you",
    name: "Your Story",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800",
    add: true
  },
  {
    id: 1,
    name: "travel_diaries",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800"
  },
  {
    id: 2,
    name: "wanderlust",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=800"
  },
  {
    id: 3,
    name: "globe_trotter",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800"
  },
  {
    id: 4,
    name: "explore_in",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800"
  },
  {
    id: 5,
    name: "nomad_life",
    avatar: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?q=80&w=800"
  },
  {
    id: 6,
    name: "mountain_seek",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800"
  },
  {
    id: 7,
    name: "beach_explorer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800"
  }
]);

  // Dummy explore posts
const [posts] = useState([
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1508898578281-774ac4893c0c?q=80&w=1400",
    likes: 189,
    comments: 8,
    user: "@globe_trotter"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400",
    likes: 320,
    comments: 24,
    user: "@wanderlust"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1400",
    likes: 98,
    comments: 12,
    user: "@heritage_trips"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1400",
    likes: 421,
    comments: 89,
    user: "@travel_diaries"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1493558103817-58b2924bce98?q=80&w=1400",
    likes: 72,
    comments: 4,
    user: "@beach_days"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1493558103817-58b2924bce98?q=80&w=1400",
    likes: 204,
    comments: 19,
    user: "@city_roamer"
  }
]);

  // Geolocation same approach as homepage
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Location not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const data = await res.json();
          const cityName =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.suburb ||
            "";
          const stateName = data.address?.state || "";
          if (cityName && stateName) setCity(`${cityName}, ${stateName}`);
          else if (cityName) setCity(cityName);
        } catch (err) {
          setLocationError("Unable to resolve location");
        }
      },
      (err) => {
        setLocationError("Location permission denied");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return (
    <div className="feed-root">
      {/* Topbar */}
      <header className="feed-topbar">
        <div className="feed-left">
          <img src="/logo.png" alt="TripEZ" className="feed-logo" />
          <div className="feed-location">
            <FiMapPin className="icon" />
            <select className="feed-city" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value={city}>{city}</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bengaluru">Bengaluru</option>
            </select>
          </div>
        </div>

        <div className="feed-center">
          <div className="feed-search">
            <FiSearch className="icon" />
            <input
              placeholder="Search for restaurant, place or user"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

      </header>

      {/* Stories */}
      <section className="stories-section">
        <div className="stories-container">
          <h3 className="stories-title">Stories</h3>
          <div className="stories-row">
            {stories.map((s) => (
              <div key={s.id} className="story-item">
                <div className={`story-ring ${s.add ? "you" : ""}`}>
                  <img src={s.avatar} alt={s.name} className="story-avatar" />
                  {s.add && (
                    <div className="add-badge">
                      <FiPlus />
                    </div>
                  )}
                </div>
                <div className="story-name">{s.name.length > 10 ? s.name.slice(0, 10) + "..." : s.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore grid */}
      <section className="explore-section">
        <h3 className="explore-title">Explore</h3>

        <div className="explore-grid">
          {posts.map((p) => (
            <div key={p.id} className="explore-card">
              <div className="explore-image">
                <img src={p.image} alt={p.user} />
                <div className="explore-overlay">
                  <div className="overlay-left">
                    <div className="overlay-metrics">
                      <FaHeart />
                      <span>{p.likes}</span>
                    </div>
                    <div className="overlay-metrics">
                      <FaRegComment />
                      <span>{p.comments}</span>
                    </div>
                    <div className="overlay-user">{p.user}</div>
                  </div>
                  <div className="overlay-right">
                    <button className="save-btn" aria-label="save post">
                      <FiBookmark />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="fp-footer">
              <div className="fp-footer-inner">
                <div>© {new Date().getFullYear()} TripEZ. All Rights Reserved.</div>
              </div>
            </footer>
      
           
            <Navbar active="feed" />
    </div>
  );
}
