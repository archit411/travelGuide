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
/* INLINE STYLES FOR TABS TO BE MOVED TO CSS */
const tabStyles = `
  .dest-tabs-container {
    display: flex;
    justify-content: space-around;
    background: white;
    padding: 12px 16px 0;
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 60px; /* Adjust based on navbar height */
    z-index: 90;
    margin-bottom: 20px;
  }
  
  .dest-tab {
    background: none;
    border: none;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.2s;
  }
  
  .dest-tab.active {
    color: #2563eb;
    border-bottom-color: #2563eb;
  }

  .crowd-analytics-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    margin-bottom: 24px;
  }
  
  .analytics-header { margin-bottom: 20px; }
  .analytics-header h3 { font-size: 20px; margin: 0 0 4px; }
  .subtitle { color: #64748b; font-size: 14px; margin: 0; }
  
  .verdict-banner {
    background: #f8fafc;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 24px;
    text-align: center;
  }
  
  .verdict-status {
    font-size: 18px;
    font-weight: 700;
    margin-top: 8px;
  }
  .verdict-status.feasible { color: #16a34a; }
  .verdict-status.crowded { color: #dc2626; }
  
  .crowd-bars {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .crowd-bar-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .cb-label { wudth: 60px; font-size: 14px; font-weight: 500; }
  
  .cb-track {
    flex: 1;
    height: 10px;
    background: #e2e8f0;
    border-radius: 99px;
    overflow: hidden;
  }
  
  .cb-fill { height: 100%; border-radius: 99px; }
  .cb-fill.low { background: #4ade80; }
  .cb-fill.medium { background: #facc15; }
  .cb-fill.high { background: #f87171; }
  
  .gallery-item-wrapper {
    position: relative;
    cursor: pointer;
    border-radius: 12px;
    overflow: hidden;
    height: 110px; /* Fixed height for grid */
  }
  
  .gallery-item-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
  
  .gallery-item-wrapper:hover img {
    transform: scale(1.05);
  }
  
  .gallery-crowd-badge {
    position: absolute;
    bottom: 8px;
    right: 8px;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    color: white;
    backdrop-filter: blur(4px);
  }
  
  .gallery-crowd-badge.low { background: rgba(34, 197, 94, 0.85); }
  .gallery-crowd-badge.medium { background: rgba(234, 179, 8, 0.85); }
  .gallery-crowd-badge.high { background: rgba(239, 68, 68, 0.85); }
`;


// Helper for crowd analysis simulation
const analyzeCrowdFromImage = (url) => {
  if (!url) return 'Medium';
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash) + url.charCodeAt(i);
    hash |= 0;
  }
  const levels = ['Low', 'Medium', 'High'];
  // Use absolute value and mod 3 to pick a level
  return levels[Math.abs(hash) % 3];
};

import { fetchPlaceAIInfo } from "../utils/geminiService";
import StoryViewer from "./StoryViewer";

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

  const [viewStory, setViewStory] = useState(null); // { stories: [], index: 0 }
  const [activeTab, setActiveTab] = useState("info"); // 'info' | 'crowd'

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
            `https://travelguide-1-21sw.onrender.com/api/coords?place=${encodeURIComponent(placeName)}`,
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
              `https://travelguide-1-21sw.onrender.com/api/weather?lat=${lat}&lon=${lon}`,
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
        let galleryItems = [];

        // Add the main place image as the first gallery item
        galleryItems.push({
          image: placeData?.img || placeData?.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
          destination: placeName,
          caption: placeData?.desc || "Main view of " + placeName,
          user: "TripEZ"
        });

        try {
          // Extract the primary city name
          const shortName = placeName.split(/[,\(]/)[0].trim();

          const storiesRes = await fetch(
            `https://travelguide-1-21sw.onrender.com/api/travel/getPostsByDestination?destination=${encodeURIComponent(shortName)}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (storiesRes.ok) {
            const storiesData = await storiesRes.json();
            if (Array.isArray(storiesData)) {
              // Map stories to gallery items
              const storyItems = storiesData.map(s => ({
                image: s.image,
                imageUrl: s.image, // compatibility
                destination: s.destination || placeName,
                caption: s.caption,
                user: s.userName,
                // keep original story data if needed
                ...s
              })).filter(s => s.image);

              galleryItems = [...galleryItems, ...storyItems];
            }
          }
        } catch (e) {
          console.warn("Stories fetch failed", e);
        }

        // ---------------------------------------
        // Analyze Crowd Stats
        // ---------------------------------------
        let lowCount = 0;
        let mediumCount = 0;
        let highCount = 0;

        galleryItems = galleryItems.map(item => {
          // Use existing status from API/upload if available, else simulate
          const status = item.crowdLevel || item.crowdStatus || analyzeCrowdFromImage(item.image || item.imageUrl);

          if (status === 'Low') lowCount++;
          else if (status === 'Medium') mediumCount++;
          else if (status === 'High') highCount++;

          return { ...item, crowdStatus: status };
        });

        const totalItems = galleryItems.length;
        const lowPct = totalItems ? Math.round((lowCount / totalItems) * 100) : 0;
        const medPct = totalItems ? Math.round((mediumCount / totalItems) * 100) : 0;
        const highPct = totalItems ? Math.round((highCount / totalItems) * 100) : 0; // Remainder if needed

        // Determine verdict
        let verdict = "Moderate Crowd";
        if (highPct > 50) verdict = "Crowded";
        else if (lowPct > 50) verdict = "Feasible to Visit";

        const crowdStats = {
          total: totalItems,
          low: lowPct,
          medium: medPct,
          high: highPct,
          verdict: verdict
        };

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
          crowdLevel: crowdStats.verdict, // Override or fallback
          crowdStats: crowdStats,
          bestMonths: "October - March",
          gallery: galleryItems,
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
      <style>{tabStyles}</style>
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
      <div className="dest-tabs-container">
        <button
          className={`dest-tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Place Info
        </button>
        <button
          className={`dest-tab ${activeTab === 'crowd' ? 'active' : ''}`}
          onClick={() => setActiveTab('crowd')}
        >
          Crowd Status
        </button>
      </div>

      {/* ===== Content Section ===== */}
      <div className="dest-content">

        {activeTab === 'info' && (
          <div className="tab-pane fade-in">
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
                <p>{destination.crowdStats?.verdict || destination.crowdLevel}</p>
              </div>
            </div>

            {destination.gallery?.length > 0 && (
              <>
                <h3 className="section-title">Gallery</h3>
                <div className="image-gallery">
                  {destination.gallery.map((item, i) => (
                    <div
                      key={i}
                      className="gallery-item-wrapper"
                      onClick={() => setViewStory({ stories: destination.gallery, index: i })}
                    >
                      <img
                        src={item.image || item.imageUrl}
                        alt={`Gallery ${i}`}
                      />
                      <div className={`gallery-crowd-badge ${item.crowdStatus?.toLowerCase() || 'medium'}`}>
                        {item.crowdStatus || 'Medium'}
                      </div>
                    </div>
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
        )}


        {/* ===== Crowd Status Tab ===== */}
        {activeTab === 'crowd' && (
          <div className="tab-pane fade-in">
            <div className="crowd-analytics-card">
              <div className="analytics-header">
                <h3>Crowd Trend Analysis</h3>
                <p className="subtitle">Based on analysis of {destination.crowdStats?.total || 0} gallery photos</p>
              </div>

              <div className="verdict-banner">
                <p>Current Verdict</p>
                <div className={`verdict-status ${destination.crowdStats?.verdict === 'Feasible to Visit' || destination.crowdStats?.verdict === 'Low' ? 'feasible' :
                  destination.crowdStats?.verdict === 'Crowded' || destination.crowdStats?.verdict === 'High' ? 'crowded' : ''
                  }`}>
                  {destination.crowdStats?.verdict || destination.crowdLevel}
                </div>
              </div>

              <div className="crowd-bars">
                <div className="crowd-bar-item">
                  <span className="cb-label">Low</span>
                  <div className="cb-track">
                    <div className={`cb-fill low`} style={{ width: `${destination.crowdStats?.low || 0}%` }}></div>
                  </div>
                  <span className="cb-value">{destination.crowdStats?.low || 0}%</span>
                </div>
                <div className="crowd-bar-item">
                  <span className="cb-label">Medium</span>
                  <div className="cb-track">
                    <div className={`cb-fill medium`} style={{ width: `${destination.crowdStats?.medium || 0}%` }}></div>
                  </div>
                  <span className="cb-value">{destination.crowdStats?.medium || 0}%</span>
                </div>
                <div className="crowd-bar-item">
                  <span className="cb-label">High</span>
                  <div className="cb-track">
                    <div className={`cb-fill high`} style={{ width: `${destination.crowdStats?.high || 0}%` }}></div>
                  </div>
                  <span className="cb-value">{destination.crowdStats?.high || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ===== Story Viewer Overlay ===== */}
      {viewStory && (
        <StoryViewer
          stories={viewStory.stories}
          index={viewStory.index}
          onClose={() => setViewStory(null)}
        />
      )}

    </div>
  );
}
