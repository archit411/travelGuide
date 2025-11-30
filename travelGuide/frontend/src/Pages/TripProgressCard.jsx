import React, { useEffect, useState } from "react";
import "./TripProgressCard.css";
import {
  FiClock,
  FiMapPin,
  FiUsers,
  FiWind,
  FiCheckCircle,
} from "react-icons/fi";

// Distance util
function distanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function TripProgressCard({ trip, onComplete }) {
  const today = trip.days[0];
  const [userLoc, setUserLoc] = useState(null);
  const [visited, setVisited] = useState(
    JSON.parse(localStorage.getItem("visitedPlaces") || "{}")
  );

  const [geoCache, setGeoCache] = useState({}); 

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setUserLoc(null)
    );
  }, []);

  const fetchCoordinates = async (i, act) => {
    if (!act.location) return null;

    if (geoCache[act.location]) return geoCache[act.location];

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      act.location
    )}`;

    try {
      const resp = await fetch(url);
      const data = await resp.json();

      if (data.length === 0) return null;

      const loc = {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };

      setGeoCache((prev) => ({
        ...prev,
        [act.location]: loc,
      }));

      return loc;
    } catch (err) {
      console.log("Geocoding error:", err);
      return null;
    }
  };

  const sorted =
    userLoc && today?.activities
      ? [...today.activities].sort((a, b) => {
          const locA = a.lat ? a : geoCache[a.location];
          const locB = b.lat ? b : geoCache[b.location];

          const dA = locA
            ? distanceKm(userLoc.lat, userLoc.lon, locA.lat, locA.lon)
            : 9999;
          const dB = locB
            ? distanceKm(userLoc.lat, userLoc.lon, locB.lat, locB.lon)
            : 9999;

          return dA - dB;
        })
      : today.activities;

  return (
    <div className="trip-progress-card">
      <h2 className="tpc-title">Day 1 — Nearby Recommended Spots</h2>

      <div className="tpc-scroll">
        {sorted.map((act, i) => {
          const storedGeo = geoCache[act.location];

          let lat = act.lat || storedGeo?.lat;
          let lon = act.lon || storedGeo?.lon;

          if (!lat || !lon) fetchCoordinates(i, act);

          const dist =
            userLoc && lat && lon
              ? distanceKm(userLoc.lat, userLoc.lon, lat, lon).toFixed(1)
              : "—";

          return (
            <div key={i} className="tpc-card">
              {/* MAP REMOVED */}

              <div className="tpc-body">

                <h4>{act.activity || act.description}</h4>

                <p className="tpc-location">
                  <FiMapPin /> {act.location}
                </p>

                <div className="tpc-meta">
                  <span>
                    <FiClock /> {dist} km
                  </span>
                  {act.weather && (
                    <span>
                      <FiWind /> {act.weather}
                    </span>
                  )}
                  {act.crowd && (
                    <span>
                      <FiUsers /> {act.crowd}
                    </span>
                  )}
                </div>

                {lat && lon && (
                  <a
                    className="tpc-dir"
                    target="_blank"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`}
                  >
                    ➜ Navigate with Google Maps
                  </a>
                )}

                {lat && lon && (
                  <a
                    className="tpc-uber"
                    target="_blank"
                    href={`https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lon}`}
                  >
                    🚗 Book Uber
                  </a>
                )}

                {lat && lon && (
                  <a
                    className="tpc-ola"
                    target="_blank"
                    href={`https://olawebcdn.com/assets/ola-universal-link.html?lat=${lat}&lng=${lon}`}
                  >
                    🚕 Book Ola
                  </a>
                )}

                <button
                  className={`tpc-visit ${visited[i] ? "visited" : ""}`}
                  onClick={() => {
                    const updated = { ...visited, [i]: !visited[i] };
                    setVisited(updated);
                    localStorage.setItem(
                      "visitedPlaces",
                      JSON.stringify(updated)
                    );
                  }}
                >
                  {visited[i] ? (
                    <>
                      <FiCheckCircle /> Visited
                    </>
                  ) : (
                    "Mark Visited"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button className="tpc-complete-btn" onClick={onComplete}>
        Clear Trip
      </button>
    </div>
  );
}
