import React, { useState, useEffect } from "react";
import {
  FiArrowLeft,
  FiBookmark,
  FiShare2,
  FiUsers,
  FiMapPin,
  FiInfo,
  FiCalendar,
  FiThermometer,
  FiSmile,
  FiCloud,
} from "react-icons/fi";
import "./destination.css";
import { useNavigate, useParams } from "react-router-dom";

export default function DestinationPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);

  // Mock destination
  useEffect(() => {
    const mockData = {
      id: 1,
      name: "Manali",
      state: "Himachal Pradesh",
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      temperature: 12,
      weather: "Partly Cloudy",
      crowdLevel: "Medium",
      about:
        "Manali is a high-altitude Himalayan resort town known for its cool climate, snow-capped mountains, and adventure activities. A popular destination for both summer and winter tourism.",
      bestMonths: "May - June, Oct - Feb",
      gallery: [
        "https://images.unsplash.com/photo-1617104176392-f1a8a1dbb5e5",
        "https://images.unsplash.com/photo-1589394811462-1b2d8b3b55f2",
        "https://images.unsplash.com/photo-1549887534-4e3a2a5b3c52",
      ],
      featured: [
        {
          name: "Solang Valley",
          description:
            "Adventure hub perfect for paragliding, zorbing, and skiing.",
          distance: 14,
          stories: 89,
          image:
            "https://images.unsplash.com/photo-1600787911210-31dcb594b9dc?auto=format&fit=crop&w=1200&q=80",
        },
        {
          name: "Rohtang Pass",
          description:
            "High mountain pass with breathtaking snow-covered views.",
          distance: 51,
          stories: 124,
          image:
            "https://images.unsplash.com/photo-1583142305722-6e3e9b9ff9cf?auto=format&fit=crop&w=1200&q=80",
        },
        {
          name: "Hadimba Temple",
          description:
            "Ancient temple surrounded by serene cedar forests and calm vibes.",
          distance: 2,
          stories: 67,
          image:
            "https://images.unsplash.com/photo-1610534551213-2ed74f0fdd09?auto=format&fit=crop&w=1200&q=80",
        },
        {
          name: "Old Manali",
          description:
            "Bohemian cafes, local culture, and peaceful riverside stays.",
          distance: 3,
          stories: 156,
          image:
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
        },
      ],
    };
    setDestination(mockData);
  }, [id]);

  // Fetch uploaded travel stories for this destination
  useEffect(() => {
    async function fetchStories() {
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
        if (Array.isArray(data)) {
          const filtered = data.filter(
            (s) =>
              s.destination?.toLowerCase().trim() ===
              id?.toLowerCase().trim()
          );
          setStories(filtered);
        }
      } catch (err) {
        console.error("Error fetching live stories:", err);
      } finally {
        setLoadingStories(false);
      }
    }

    fetchStories();
  }, [id]);

  if (!destination)
    return (
      <div className="dest-loading">
        <p>Loading destination...</p>
      </div>
    );

  return (
    <div className="destination-page">
      {/* ===== Hero Banner ===== */}
      <div className="dest-banner-container">
        <div
          className="dest-banner-image"
          style={{ backgroundImage: `url(${destination.imageUrl})` }}
        >
          <div className="dest-banner-overlay">
            <div className="dest-banner-top">
              <button className="banner-icon-btn" onClick={() => navigate(-1)}>
                <FiArrowLeft />
              </button>
              <div className="banner-actions">
                <button className="banner-icon-btn">
                  <FiBookmark />
                </button>
                <button className="banner-icon-btn">
                  <FiShare2 />
                </button>
              </div>
            </div>

            <div className="banner-info">
              <h2>{destination.name}</h2>
              <p>{destination.state}</p>
              <div className="banner-tags">
                <span className="weather-tag">
                  <FiCloud /> {destination.temperature}°C • {destination.weather}
                </span>
                <span className="crowd-tag">
                  👥 {destination.crowdLevel} Crowds
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Tabs ===== */}
      <div className="dest-tabs">
        {["Overview", "Live Stories", "Crowd Calendar", "Food & Stay"].map(
          (tab) => (
            <button
              key={tab}
              className={`tab-btn ${
                activeTab === tab.toLowerCase().replace(/ /g, "")
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab(tab.toLowerCase().replace(/ /g, ""))
              }
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* ===== Tab Content ===== */}
      <div className="dest-content">
        {/* ===== Overview Section ===== */}
        {activeTab === "overview" && (
          <>
            <div className="about-card">
              <div className="about-header">
                <div className="icon-circle info">
                  <FiInfo />
                </div>
                <h3>About {destination.name}</h3>
              </div>
              <p>{destination.about}</p>
            </div>

            <h3 className="section-title">Travel Information</h3>
            <div className="travel-info-grid">
              <div className="travel-card">
                <div className="icon-circle green">
                  <FiCalendar />
                </div>
                <h4>Best Months</h4>
                <p>{destination.bestMonths}</p>
              </div>
              <div className="travel-card">
                <div className="icon-circle blue">
                  <FiThermometer />
                </div>
                <h4>Current Weather</h4>
                <p>
                  {destination.temperature}°C <br /> {destination.weather}
                </p>
              </div>
              <div className="travel-card">
                <div className="icon-circle yellow">
                  <FiSmile />
                </div>
                <h4>Crowd Status</h4>
                <p>{destination.crowdLevel} Crowds</p>
              </div>
            </div>

            {/* Gallery */}
            {destination.gallery && destination.gallery.length > 0 && (
              <>
                <h3 className="section-title">Gallery</h3>
                <div className="image-gallery">
                  {destination.gallery.map((img, i) => (
                    <img key={i} src={img} alt={`Gallery ${i}`} />
                  ))}
                </div>
              </>
            )}

            {/* Nearby Attractions */}
            {destination.featured && destination.featured.length > 0 && (
              <>
                <h3 className="section-title">Nearby Attractions</h3>
                <div className="featured-list">
                  {destination.featured.map((p, i) => (
                    <div key={i} className="featured-card">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="featured-img"
                      />
                      <div className="featured-details">
                        <h4>{p.name}</h4>
                        <p>{p.description}</p>
                        <div className="featured-meta">
                          <span>
                            <FiMapPin /> {p.distance} km
                          </span>
                          <span>
                            <FiUsers /> {p.stories} stories
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ===== Live Stories Section ===== */}
        {activeTab === "livestories" && (
          <div className="live-stories-section">
            <h3>Traveler Stories from {destination.name}</h3>

            {loadingStories ? (
              <p className="loading-text">Loading stories...</p>
            ) : stories.length === 0 ? (
              <p className="empty-text">
                No live stories yet. Be the first to share your experience!
              </p>
            ) : (
              <div className="live-stories-grid">
                {stories.map((story, i) => (
                  <div key={i} className="story-card-view">
                    <img
                      src={story.image}
                      alt={story.destination}
                      className="story-card-img"
                    />
                    <div className="story-card-content">
                      <h4>📍 {story.destination}</h4>
                      <p className="story-card-caption">
                        {story.caption?.length > 100
                          ? story.caption.slice(0, 100) + "..."
                          : story.caption}
                      </p>
                      <div className="story-card-meta">
                        <span>🌡️ {story.temprature}°C</span>
                        <span>👥 {story.crowdLevel}</span>
                        <span>⭐ {story.userRating}/5</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
