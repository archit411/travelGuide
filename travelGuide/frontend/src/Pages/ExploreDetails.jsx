import React, { useEffect, useState } from "react";
import axios from "axios";

const ExploreDetails = ({ placeId }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (placeId) {
      fetchDetails(placeId);
    }
  }, [placeId]);

  const fetchDetails = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:8080/api/places/${id}/details`,
        {}, // POST body empty
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
      <h2>{details.name}</h2>
      <p>{details.description}</p>

      <h3>Nearby Places</h3>
      <ul>
        {details.nearByPlaces?.map((place) => (
          <li key={place.id}>
            <strong>{place.name}</strong> – {place.distance} km
            <br />
            <small>{place.description}</small>
          </li>
        ))}
      </ul>

      <h3>Things To Do</h3>
      <ul>
        {details.thingsToDo?.map((activity) => (
          <li key={activity.id}>
            <strong>{activity.activityName}</strong>
            <br />
            <small>{activity.description}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExploreDetails;
