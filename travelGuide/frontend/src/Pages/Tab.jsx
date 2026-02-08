import React, { useEffect, useState } from "react";
import PlaceCard from "./PlaceCard";
import { getExplorePlaces } from "../utils/tripItineraryService";

const ExplorePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const data = await getExplorePlaces();
      // Handle the case where backend might return [null] or empty list
      const validPlaces = Array.isArray(data) ? data.filter(p => p && p.id) : [];
      setPlaces(validPlaces);
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
