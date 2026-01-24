import React, { useEffect, useState } from "react";
import axios from "axios";
import PlaceCard from "./PlaceCard";

const ExplorePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8080/api/places/getPlaces",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPlaces(res.data);
    } catch (err) {
      console.error("Failed to load places", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="explore-container">
      <div className="explore-header">
        <h1>Explore Places</h1>
        <p>Discover top destinations, attractions & experiences</p>
      </div>

      <div className="places-scroll">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="place-skeleton" />
            ))
          : places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
      </div>
    </section>
  );
};

export default ExplorePlaces;
