import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ExploreDetails.css";

const ExploreDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);

  const [showAllNearby, setShowAllNearby] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);

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
    </div>
  );
};

export default ExploreDetails;
