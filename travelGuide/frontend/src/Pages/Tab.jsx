import React, { useEffect, useState } from "react";
import axios from "axios";
import PlaceCard from "./PlaceCard";

const ExplorePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:8080/api/places/getPlaces",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPlaces(res.data);
      console.log("data 1",res.data);
    } catch (err) {
      console.error("Failed to load places", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="explore-container">
      <h1 className="explore-title">Explore Places</h1>
      <p className="explore-subtitle">
        Discover top destinations, attractions & experiences
      </p>

      {loading && <p>Loading places...</p>}

      <div className="places-horizontal-scroll">
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </div>
  );
};

export default ExplorePlaces;
