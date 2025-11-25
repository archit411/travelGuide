import React, { useState, useEffect } from "react";
import {
  FiArrowLeft,
  FiBookmark,
  FiShare2,
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
  const placeData = location.state?.place; // place object from card

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token"); // JWT Token

        const placeName = placeData?.name || decodeURIComponent(id);

        // ---------------------------------------
        // STEP 1 → Get latitude & longitude
        // ---------------------------------------
        const coordsRes = await fetch(
          `http://localhost:8080/api/coords?place=${placeName}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const coordsData = await coordsRes.json();
        console.log("Coordinates ==> ", coordsData);

        const lat = coordsData.lat;
        const lon = coordsData.lon;

        // ---------------------------------------
        // STEP 2 → Get weather using lat & lon
        // ---------------------------------------
        const weatherRes = await fetch(
          `http://localhost:8080/api/weather?lat=${lat}&lon=${lon}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const weatherData = await weatherRes.json();
        console.log("Weather ==> ", weatherData);

        // ---------------------------------------
        // Build Destination Data for UI
        // ---------------------------------------
        setDestination({
          name: placeName,
          state: placeData?.state || "India",
          imageUrl:
            placeData?.img ||
            placeData?.imageUrl ||
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
          about:
            placeData?.desc ||
            placeData?.description ||
            "Discover breathtaking views, vibrant culture, and unforgettable experiences.",
          temperature: weatherData.current_weather.temperature,
          weather: weatherData.current_weather.description,
          crowdLevel: "Medium",
          bestMonths: "October - March",
          gallery: [
            placeData?.img ||
            placeData?.imageUrl ||
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
          ],
          featured: [],
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Unable to load destination details.");
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, placeData]);

  // ---------------------------------------------
  // LOADING VIEW
  // ---------------------------------------------
  if (loading)
    return (
      <div className="dest-loading">
        <div className="dest-loader"></div>
        <p>Loading destination...</p>
      </div>
    );

  // ---------------------------------------------
  // ERROR VIEW
  // ---------------------------------------------
  if (error)
    return (
      <div className="dest-error">
        <p>{error}</p>
      </div>
    );

  // Check if destination data exists before rendering
  if (!destination)
    return (
      <div className="dest-error">
        <p>No destination data available</p>
      </div>
    );

  // ---------------------------------------------
  // MAIN UI
  // ---------------------------------------------
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
                  <FiCloud /> {destination.temperature}°C •{" "}
                  {destination.weather}
                </span>
                <span className="crowd-tag">👥 {destination.crowdLevel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Overview Section ===== */}
      <div className="dest-content">
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
            <p>{destination.crowdLevel}</p>
          </div>
        </div>

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
      </div>
    </div>
  );
}