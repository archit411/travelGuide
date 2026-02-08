import React, { useEffect, useState } from "react";
import axios from "axios";
import ExploreDetails from "./ExploreDetails";

const ExploreTab = () => {
  const [places, setPlaces] = useState([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://travelguide-1-21sw.onrender.com/api/places/getPlaces",
        {}, // POST body empty
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPlaces(response.data);
    } catch (error) {
      console.error("Failed to load places", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Explore Places</h2>

      {loading && <p>Loading places...</p>}

      <div className="places-list">
        {places.map((place) => (
          <div
            key={place.id}
            className="place-card"
            onClick={() => setSelectedPlaceId(place.id)}
          >
            <img src={place.imageUrl} alt={place.name} width="200" />
            <h3>{place.name}</h3>
            <p>{place.description}</p>
          </div>
        ))}
      </div>

      {selectedPlaceId && (
        <ExploreDetails placeId={selectedPlaceId} />
      )}
    </div>
  );
};

export default ExploreTab;