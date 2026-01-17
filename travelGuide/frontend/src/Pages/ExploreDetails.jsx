import React, { useEffect, useState } from "react";
import axios from "axios";

const ExploreDetails = ({ placeId }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [placeId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `http://localhost:8080/api/places/${placeId}/details`
      );

      setDetails(response.data);
    } catch (error) {
      console.error("Failed to load details", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading details...</p>;
  if (!details) return null;

  return (
    <div>
      <h3>Explore {details.name}</h3>

      <ul>
        {details.nearByPlaces.map((place) => (
          <li key={place.id}>
            {place.name} – {place.distance} km
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExploreDetails;
