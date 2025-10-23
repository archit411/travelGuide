import { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiCloud,
  FiHeart,
  FiHome,
  FiBookmark,
  FiUser,
} from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import "./home.css";

const sampleCards = [
  {
    id: 1,
    user: "Priya Sharma",
    time: "2h ago",
    temp: "10°C",
    likes: 127,
    location: "Manali – Solang Valley",
    desc: "Perfect morning for paragliding! Clear skies and minimal crowd. Highly recommended!",
    crowd: "Low",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1470&auto=format&fit=crop",
  },
  {
    id: 2,
    user: "Rahul Verma",
    time: "4h ago",
    temp: "14°C",
    likes: 92,
    location: "Shimla – Ridge View",
    desc: "Weekend rush starting to build up. Evenings are getting colder!",
    crowd: "Moderate",
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1470&auto=format&fit=crop",
  },
  {
    id: 3,
    user: "Ananya Gupta",
    time: "6h ago",
    temp: "12°C",
    likes: 154,
    location: "Kullu – River Trail",
    desc: "Peaceful and scenic! Best for early morning walks.",
    crowd: "Low",
    img: "https://images.unsplash.com/photo-1600431521340-491eca880813?ixlib=rb-4.0.3&q=80&w=1470&auto=format&fit=crop",
  },
];

function HighlightCard({ data }) {
  return (
    <div className="highlight-card">
      <img src={data.img} alt={data.location} className="card-image" />
      <div className="card-gradient" />

      <div className="card-top">
        <div className="user-badge">
          <div className="user-circle">{data.user.charAt(0)}</div>
          <div>
            <h4>{data.user}</h4>
            <p>{data.time}</p>
          </div>
        </div>
        <span
          className={`crowd-pill ${
            data.crowd === "Low" ? "low" : data.crowd === "High" ? "high" : "moderate"
          }`}
        >
          {data.crowd}
        </span>
      </div>

      <div className="card-bottom">
        <div className="temp-like">
          <span className="temp-pill">
            <FiCloud /> {data.temp}
          </span>
          <span className="like-pill">
            <FiHeart /> {data.likes}
          </span>
        </div>
        <div className="card-info">
          <h3>{data.location}</h3>
          <p>{data.desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function TripPulse() {
  const [active, setActive] = useState("home");

  return (
    <div className="trip-feed">
      {/* Header */}
      <header className="tp-header">
        <div className="tp-logo">
          <img src="src/assets/logo.png" alt="TripPulse" />
          <div>
            <h1>TripPulse</h1>
            <p>Live Travel Companion</p>
          </div>
        </div>
        <button className="add-btn">
          <FiPlus /> Add Update
        </button>
      </header>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-bar">
          <FiSearch />
          <input placeholder="Search destinations..." />
        </div>
      </div>

      {/* Highlights */}
      <section className="section">
        <div className="section-head">
          <h2>Today's Highlights</h2>
          <span className="view-all">View All</span>
        </div>
        <div className="card-grid">
          {sampleCards.map((c) => (
            <HighlightCard key={c.id} data={c} />
          ))}
        </div>
      </section>

      {/* Hashtag Banner */}
      <div className="hashtag-banner">
        <img src="src/assets/travel.png" alt="Trending Hashtags" />
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          className={active === "home" ? "active" : ""}
          onClick={() => setActive("home")}
        >
          <FiHome />
        </button>
        <button
          className={active === "food" ? "active" : ""}
          onClick={() => setActive("food")}
        >
          <FaUtensils />
        </button>
        <button
          className={active === "saved" ? "active" : ""}
          onClick={() => setActive("saved")}
        >
          <FiBookmark />
        </button>
        <button
          className={active === "profile" ? "active" : ""}
          onClick={() => setActive("profile")}
        >
          <FiUser />
        </button>
      </nav>
      {/* Made in India Message */}
<div className="made-in-india">
  🇮🇳 Made in India • ❤️ Crafted in Mumbai
</div>

    </div>
  );
}
