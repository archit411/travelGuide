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
  FiMapPin,
} from "react-icons/fi";
import "./destination.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { fetchPlaceAIInfo } from "../utils/geminiService";

export default function DestinationPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const placeData = location.state?.place; // place object from card

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // AI-powered content states
  const [aiInfo, setAiInfo] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const placeName = placeData?.name || decodeURIComponent(id || "");

        if (!placeName || placeName === "undefined") {
          throw new Error("Invalid destination name.");
        }

        // ---------------------------------------
        // STEP 1 → Get latitude & longitude
        // ---------------------------------------
        let lat = null, lon = null;
        try {
          const coordsRes = await fetch(
            `http://localhost:8080/api/coords?place=${encodeURIComponent(placeName)}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (coordsRes.ok) {
            const coordsData = await coordsRes.json();
            lat = coordsData.lat;
            lon = coordsData.lon;
          }
        } catch (e) {
          console.warn("Coords fetch failed", e);
        }

        // ---------------------------------------
        // STEP 2 → Get weather using lat & lon
        // ---------------------------------------
        let weatherInfo = { temp: "--", desc: "No data" };
        if (lat && lon) {
          try {
            const weatherRes = await fetch(
              `http://localhost:8080/api/weather?lat=${lat}&lon=${lon}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (weatherRes.ok) {
              const weatherData = await weatherRes.json();
              if (weatherData?.current_weather) {
                weatherInfo = {
                  temp: weatherData.current_weather.temperature,
                  desc: weatherData.current_weather.description || "Clear",
                };
              }
            }
          } catch (e) {
            console.warn("Weather fetch failed", e);
          }
        }

        // ---------------------------------------
        // STEP 3 → Get stories for this destination
        // ---------------------------------------
        let storyImages = [];
        try {
          // Extract the primary city name: split by comma OR parenthesis
          // e.g. "Shimla (Himachal Pradesh)" -> "Shimla"
          // e.g. "Kyoto, Japan" -> "Kyoto"
          const shortName = placeName.split(/[,\(]/)[0].trim();

          const storiesRes = await fetch(
            `http://localhost:8080/api/travel/getPostsByDestination?destination=${encodeURIComponent(shortName)}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (storiesRes.ok) {
            const storiesData = await storiesRes.json();
            if (Array.isArray(storiesData)) {
              // Extract images from stories
              const fetchedImages = storiesData.map(s => s.image).filter(Boolean);

              // If the current placeName is more specific, maybe append those too
              // but containing search in backend should already cover most cases.
              storyImages = fetchedImages;
            }
          }
        } catch (e) {
          console.warn("Stories fetch failed", e);
        }

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
          temperature: weatherInfo.temp,
          weather: weatherInfo.desc,
          crowdLevel: placeData?.crowdLevel || "Medium",
          bestMonths: "October - March",
          gallery: [
            placeData?.img ||
            placeData?.imageUrl ||
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
            ...storyImages
          ],
          featured: [],
        });

        setLoading(false);

        // Fetch AI-powered information
        fetchAIInfo(placeName);

      } catch (err) {
        console.error("Destination load error:", err);
        setError(err.message || "Unable to load destination details.");
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, placeData]);

  // Function to fetch AI-powered place information
  const fetchAIInfo = async (placeName) => {
    console.log("Fetching AI info for place:", placeName);
    try {
      setAiLoading(true);
      setAiError(null);
      const data = await fetchPlaceAIInfo(placeName);
      console.log("AI Info received:", data);

      if (!data) {
        console.warn("AI data is null or undefined");
        throw new Error("No data received");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setAiInfo(data);
      setAiLoading(false);
    } catch (err) {
      console.error("AI info fetch error:", err);
      setAiError(err.message || "Failed to load AI recommendations");
      setAiLoading(false);
    }
  };

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

      {/* Debug: Check if AI section renders */}
      {/* {console.log("Render state - aiLoading:", aiLoading, "aiInfo:", aiInfo, "aiError:", aiError)} */}

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

        {/* AI-Powered Sections */}
        {aiLoading && (
          <div className="ai-section">
            <div className="ai-section-header">
              <h3 className="section-title">AI Recommendations</h3>
              <span className="ai-badge">✨ Powered by AI</span>
            </div>
            <div className="ai-loading">
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </div>
          </div>
        )}

        {aiError && (
          <div className="ai-section">
            <div className="ai-error">
              <p>{aiError}</p>
              <button className="retry-btn" onClick={() => fetchAIInfo(destination.name)}>
                Retry
              </button>
            </div>
          </div>
        )}

        {aiInfo && !aiLoading && !aiError && (
          <>
            {/* Places to Visit */}
            {aiInfo.placesToVisit && aiInfo.placesToVisit.length > 0 && (
              <div className="ai-section">
                <div className="ai-section-header">
                  <h3 className="section-title">Places to Visit</h3>
                  <span className="ai-badge">✨ AI Recommended</span>
                </div>
                <div className="ai-cards-grid">
                  {aiInfo.placesToVisit.map((place, idx) => (
                    <div key={idx} className="place-visit-card">
                      <div className="place-visit-header">
                        <h4 className="place-visit-name">{place.name}</h4>
                        {place.rating && (
                          <div className="place-visit-rating">
                            ⭐ {place.rating}
                          </div>
                        )}
                      </div>
                      <p className="place-visit-description">{place.description}</p>
                      <div className="place-visit-footer">
                        <span className="place-visit-cost">{place.estimatedCost || "Free"}</span>
                        {place.bestTime && (
                          <span className="best-time">🕐 {place.bestTime}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hotels */}
            {aiInfo.hotels && aiInfo.hotels.length > 0 && (
              <div className="ai-section">
                <div className="ai-section-header">
                  <h3 className="section-title">Budget-Friendly Hotels</h3>
                  <span className="ai-badge">✨ AI Recommended</span>
                </div>
                <div className="ai-cards-grid">
                  {aiInfo.hotels.map((hotel, idx) => (
                    <div key={idx} className="hotel-card">
                      <div className="hotel-header">
                        <h4 className="hotel-name">{hotel.name}</h4>
                        {hotel.rating && (
                          <div className="hotel-rating">
                            ⭐ {hotel.rating}
                          </div>
                        )}
                      </div>
                      {hotel.location && (
                        <div className="hotel-location">
                          <FiMapPin size={14} />
                          {hotel.location}
                        </div>
                      )}
                      <p className="hotel-description">{hotel.description}</p>
                      <div className="hotel-footer">
                        <span className="hotel-price">{hotel.priceRange}</span>
                        {hotel.budgetCategory && (
                          <span className={`budget-badge ${hotel.budgetCategory.toLowerCase().replace(/\s+/g, '-')}`}>
                            {hotel.budgetCategory}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Restaurants */}
            {aiInfo.restaurants && aiInfo.restaurants.length > 0 && (
              <div className="ai-section">
                <div className="ai-section-header">
                  <h3 className="section-title">Top Restaurants</h3>
                  <span className="ai-badge">✨ AI Recommended</span>
                </div>
                <div className="ai-cards-grid">
                  {aiInfo.restaurants.map((restaurant, idx) => (
                    <div key={idx} className="restaurant-card">
                      <div className="restaurant-header">
                        <h4 className="restaurant-name">{restaurant.name}</h4>
                        {restaurant.rating && (
                          <div className="restaurant-rating">
                            ⭐ {restaurant.rating}
                          </div>
                        )}
                      </div>
                      {restaurant.cuisine && (
                        <div className="restaurant-cuisine">{restaurant.cuisine}</div>
                      )}
                      <p className="restaurant-description">{restaurant.description}</p>
                      <div className="restaurant-footer">
                        <span className="restaurant-price">{restaurant.priceRange}</span>
                        {restaurant.mustTry && (
                          <span className="must-try">🍽️ {restaurant.mustTry}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}