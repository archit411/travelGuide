import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Explore.css";

const ExploreDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);

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

  return (
    <div className="details-container">
      {/* Banner */}
      <div className="details-hero">
        <img src={details.imageUrl} alt={details.name} />
        <div className="details-hero-text">
          <h1>{details.name}</h1>
          <p>{details.description}</p>
        </div>
      </div>

      {/* Stats */}
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

      {/* Nearby Places */}
      <h2 className="section-title">Nearby Places</h2>
      <div className="details-grid">
        {details.nearByPlaces?.map((p) => (
          <div key={p.id} className="details-card">
            <h4>{p.name}</h4>
            <span>{p.distance} km</span>
            <p>{p.description}</p>
          </div>
        ))}
      </div>

      {/* Things To Do */}
      <h2 className="section-title">Top Things To Do</h2>
      <div className="details-grid">
        {details.thingsToDo?.map((a) => (
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
