import React, { useEffect, useState } from "react";
import { FiMapPin, FiUsers } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import "./home.css"; // reuse same styling

export default function LiveStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("https://travelguide-1-21sw.onrender.com/api/travel/getUserPosts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return console.error("Failed to fetch user stories");

        const data = await res.json();
        if (Array.isArray(data)) {
          setStories(
            data.map((story) => ({
              image: story.image,
              location: story.destination,
              temperature: story.temprature,
              crowd: story.crowdLevel,
              comment: story.caption,
              rating: story.userRating,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching stories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStories();
  }, []);

  return (
    <div className="live-stories-page">
      <header className="tp-header">
        <div className="tp-brand">
          <h1>Live Stories</h1>
        </div>
      </header>

      <div className="tp-search">
        <div className="search">
          <FiMapPin />
          <input placeholder="Search by location..." />
        </div>
      </div>

      <section className="live-stories-grid">
        {loading ? (
          <p className="loading-text">Loading stories...</p>
        ) : stories.length === 0 ? (
          <p className="empty-text">No stories yet. Start sharing your travel experiences!</p>
        ) : (
          stories.map((story, index) => (
            <div key={index} className="story-card-view">
              <img src={story.image} alt={story.location} className="story-card-img" />
              <div className="story-card-content">
                <h3>📍 {story.location}</h3>
                <p className="story-card-caption">
                  {story.comment?.length > 100
                    ? story.comment.slice(0, 100) + "..."
                    : story.comment}
                </p>
                <div className="story-card-meta">
                  <span>🌡️ {story.temperature}°C</span>
                  <span>
                    <FiUsers /> {story.crowd}
                  </span>
                  <span>
                    <FaStar color="#facc15" /> {story.rating}/5
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
