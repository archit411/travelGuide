
import React, { useEffect, useState } from "react";
import { FiSearch, FiClock, FiMapPin } from "react-icons/fi";
import { FaStar, FaFilter } from "react-icons/fa";
import "./FoodPage.css";
import Navbar from "./Navbar";

export default function FoodPage() {
  const [city, setCity] = useState("Mumbai");
  const [locationError, setLocationError] = useState("");
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState(["Malai Chaap"]);
  const [restaurants, setRestaurants] = useState([]);

  // Dummy JSON data
  useEffect(() => {
    const data = [
      {
        id: 1,
        name: "Sadak Chaap",
        cuisines: "North Indian, Biryani, Rolls",
        priceForOne: 400,
        timeMin: 43,
        rating: 4.3,
        img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1400",
        offer: "50% OFF",
      },
      {
        id: 2,
        name: "Oye Kake",
        cuisines: "North Indian, Ice Cream, Desserts",
        priceForOne: 650,
        timeMin: 44,
        rating: 4.4,
        img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=1400",
        offer: "50% OFF",
      },
      {
        id: 3,
        name: "Radheshyam Express",
        cuisines: "North Indian, Biryani, Pizza",
        priceForOne: 200,
        timeMin: 36,
        rating: 4.1,
        img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1400",
        offer: "50% OFF",
      },
      {
        id: 4,
        name: "Spice Villa",
        cuisines: "South Indian, Street Food",
        priceForOne: 300,
        timeMin: 32,
        rating: 4.0,
        img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1400",
        offer: "30% OFF",
      },
      {
        id: 5,
        name: "Curry Corner",
        cuisines: "Indian, Chinese",
        priceForOne: 275,
        timeMin: 28,
        rating: 4.2,
        img: "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?q=80&w=1400",
        offer: "20% OFF",
      },
    ];
    setRestaurants(data);
  }, []);

  // Geolocation (same approach as homepage)
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Location not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const data = await res.json();
          const cityName =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.hamlet ||
            data.address?.suburb ||
            "";
          const stateName = data.address?.state || "";
          if (cityName && stateName) setCity(`${cityName}, ${stateName}`);
          else if (cityName) setCity(cityName);
        } catch (err) {
          setLocationError("Unable to resolve location");
        }
      },
      (err) => {
        setLocationError("Location permission denied");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  function toggleChip(label) {
    if (activeFilters.includes(label)) {
      setActiveFilters(activeFilters.filter((c) => c !== label));
    } else {
      setActiveFilters([...activeFilters, label]);
    }
  }

  // Simple client-side filtering (dummy)
  const visible = restaurants.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fp-root">
      {/* Top bar */}
      <header className="fp-topbar">
        <div className="fp-topbar-left">
          <div className="fp-logo-wrap">
            <img src="/logo.jpg" alt="TripEZ" className="fp-logo" />
          </div>

          <div className="fp-location">
            <FiMapPin className="fp-loc-ic" />
            <select
              className="fp-city-select"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value={city}>{city}</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bengaluru">Bengaluru</option>
            </select>
          </div>
        </div>

        <div className="fp-topbar-center">
          <div className="fp-search">
            <FiSearch className="fp-search-ic" />
            <input
              placeholder="Search for restaurant, cuisine or a dish"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="fp-topbar-right">
         
          <button className="nav-pill primary">+ Add</button>
        </div>
      </header>

      {/* Filters row & title */}
      <section className="fp-controls">
        <div className="fp-filters-row">
          <button className="filter-btn">
            <FaFilter />
            Filters
          </button>

          <div className="fp-chips">
            <button
              className={`chip ${activeFilters.includes("Malai Chaap") ? "chip-active" : ""}`}
              onClick={() => toggleChip("Malai Chaap")}
            >
              Malai Chaap <span className="chip-x">×</span>
            </button>

            <button
              className={`chip ${activeFilters.includes("Pure Veg") ? "chip-active" : ""}`}
              onClick={() => toggleChip("Pure Veg")}
            >
              Pure Veg
            </button>

            <button
              className={`chip ${activeFilters.includes("Rating") ? "chip-active" : ""}`}
              onClick={() => toggleChip("Rating")}
            >
              Rating
            </button>

            <button
              className={`chip ${activeFilters.includes("Cost") ? "chip-active" : ""}`}
              onClick={() => toggleChip("Cost")}
            >
              Cost
            </button>
          </div>
        </div>

        <h2 className="fp-title">Food Restaurants in {city}</h2>
      </section>

      {/* Cards grid */}
      <main className="fp-grid-wrap">
        <div className="fp-grid">
          {visible.map((r) => (
            <article className="fp-card" key={r.id}>
              <div className="fp-card-image">
                <img src={r.img} alt={r.name} />
                {r.offer && <span className="fp-offer">{r.offer}</span>}
              </div>

              <div className="fp-card-body">
                <div className="fp-card-top">
                  <h3 className="fp-restaurant-name">{r.name}</h3>
                  <div className="fp-rating">
                    {r.rating.toFixed(1)} <FaStar />
                  </div>
                </div>

                <div className="fp-cuisines">{r.cuisines}</div>

                <div className="fp-divider" />

                <div className="fp-meta-row">
                  <div className="fp-price">₹{r.priceForOne} for one</div>
                  <div className="fp-time">
                    <FiClock />
                    <span>{r.timeMin} min</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Footer (simple) */}
     <footer className="fp-footer">
        <div className="fp-footer-inner">
          <div>© {new Date().getFullYear()} TripEZ. All Rights Reserved.</div>
        </div>
      </footer>

     
      <Navbar active="food" />
    </div>
  );
}
