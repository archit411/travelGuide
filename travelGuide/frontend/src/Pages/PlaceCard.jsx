import React from "react";
import { useNavigate } from "react-router-dom";
import './ExploreDetails.css';
const PlaceCard = ({ place }) => {
  const navigate = useNavigate();

  return (
    <div
      className="place-card"
      onClick={() => navigate(`/explore/${place.id}`)}
    >
      <img
        className="place-image"
        src={place.imageUrl}
        alt={place.name}
      />

      <div className="place-info">
        <h3 className="place-name">{place.name}</h3>
        <p className="place-desc">{place.description}</p>
      </div>
    </div>
  );
};

export default PlaceCard;
