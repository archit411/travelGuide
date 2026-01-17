import React, { useEffect, useState } from "react";
import axios from "axios";
import ExploreDetails from "./ExploreDetails";

const ExploreTab = () => {
  const [places, setPlaces] = useState([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Tab load hone par getPlaces API hit hogi
  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token"); 

    const response = await axios.get(
      "http://localhost:8080/api/places/getPlaces",
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


  const handlePlaceClick = (placeId) => {
    setSelectedPlaceId(placeId);
  };

  return (
    <div>
      <h2>Explore</h2>

      {loading && <p>Loading places...</p>}

      {/* Places List */}
      <div className="places-list">
        {places.map((place) => (
          <div
            key={place.id}
            className="place-card"
            onClick={() => handlePlaceClick(place.id)}
          >
            {place.name}
          </div>
        ))}
      </div>

      {/* Details Section */}
      {selectedPlaceId && (
        <ExploreDetails placeId={selectedPlaceId} />
      )}
    </div>
  );
};

export default ExploreTab;
