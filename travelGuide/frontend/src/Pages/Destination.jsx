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
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function DestinationPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const placeData = location.state?.place; // ✅ Get place object if passed
  const [destination, setDestination] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // ✅ Use clicked place data or fallback mock
  useEffect(() => {
    if (placeData) {
      setDestination({
        name: placeData.name,
        state: placeData.state || "India",
        imageUrl:
          placeData.imageUrl ||
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
        about:
          placeData.description ||
          "Explore the beauty and culture of this amazing destination.",
        temperature: 25,
        weather: "Sunny",
        crowdLevel: "Medium",
        bestMonths: "October - March",
        gallery: [placeData.imageUrl],
        featured: [],
      });
    } else {
      // fallback for direct route (no state)
      setDestination({
        name: decodeURIComponent(id),
        state: "India",
        imageUrl:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
        about:
          "Discover breathtaking views, vibrant culture, and unforgettable experiences.",
        temperature: 25,
        weather: "Sunny",
        crowdLevel: "Medium",
        bestMonths: "October - March",
        gallery: [],
        featured: [],
      });
    }
  }, [id, placeData]);

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

      {/* ===== Content ===== */}
      <div className="dest-content">
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
            {destination.gallery?.length > 0 && (
              <>
                <h3 className="section-title">Gallery</h3>
                <div className="image-gallery">
                  {destination.gallery.map((img, i) => (
                    <img key={i} src={img} alt={`Gallery ${i}`} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
