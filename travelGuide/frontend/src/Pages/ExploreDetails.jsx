import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ExploreDetails.css";
import { fetchPlaceAIInfo } from "../utils/geminiService";
import { FiMapPin } from "react-icons/fi";

const ExploreDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);

  const [showAllNearby, setShowAllNearby] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);

  // AI-powered content states
  const [aiInfo, setAiInfo] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `http://localhost:8080/api/places/${id}/details`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setDetails(res.data);

    // Fetch AI info using the place name from details
    if (res.data && res.data.name) {
      fetchAIInfo(res.data.name);
    }
  };

  const fetchAIInfo = async (placeName) => {
    try {
      setAiLoading(true);
      setAiError(null);
      const data = await fetchPlaceAIInfo(placeName);

      if (data && data.error) {
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

  if (!details) return null;

  const nearbyPlacesToShow = showAllNearby
    ? details.nearByPlaces
    : details.nearByPlaces?.slice(0, 6);

  const activitiesToShow = showAllActivities
    ? details.thingsToDo
    : details.thingsToDo?.slice(0, 6);

  return (
    <div className="details-container">
      <div className="details-hero">
        <img src={details.imageUrl} alt={details.name} />
        <div className="details-hero-text">
          <h1>{details.name}</h1>
        </div>
      </div>

      <div className="details-description">
        <h2>About {details.name}</h2>
        <p>{details.description}</p>
      </div>

      <div className="details-stats">
        <div>
          <strong>{details.thingsToDo?.length || 0}+</strong>
          <span>Activities</span>
        </div>
        <div>
          <strong>{details.nearByPlaces?.length || 0}</strong>
          <span>Nearby Places</span>
        </div>
        <div>
          <strong>25–32°C</strong>
          <span>Avg Temp</span>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Nearby Places</h2>
        {details.nearByPlaces?.length > 6 && (
          <button
            className="view-all-btn"
            onClick={() => setShowAllNearby(!showAllNearby)}
          >
            {showAllNearby ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      <div className="details-grid">
        {nearbyPlacesToShow?.map((p) => (
          <div key={p.id} className="details-card">
            <h4>{p.name}</h4>
            <span>{p.distance} km</span>
            <p>{p.description}</p>
          </div>
        ))}
      </div>

      <div className="section-header">
        <h2 className="section-title">Things To Do</h2>
        {details.thingsToDo?.length > 6 && (
          <button
            className="view-all-btn"
            onClick={() => setShowAllActivities(!showAllActivities)}
          >
            {showAllActivities ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      <div className="details-grid">
        {activitiesToShow?.map((a) => (
          <div key={a.id} className="details-card">
            <h4>{a.activityName}</h4>
            <p>{a.description}</p>
          </div>
        ))}
      </div>

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
            <button className="retry-btn" onClick={() => fetchAIInfo(details.name)}>
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
  );
};

export default ExploreDetails;
