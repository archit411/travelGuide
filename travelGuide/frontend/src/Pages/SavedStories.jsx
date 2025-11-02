import React from "react";
import "./SavedStories.css";

export default function SavedStories() {
  const stories = [
    {
      title: "A Night in the Himalayas",
      image:
        "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=900&q=60",
      desc: "Waking up to the sound of the mountains — an unforgettable experience in the Himalayas.",
      author: "Archit Jain",
      date: "12 Oct 2025",
    },
    {
      title: "Desert Dunes of Rajasthan",
      image:
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=60",
      desc: "Golden sunsets, camel rides, and starry nights in the Thar Desert.",
      author: "Divyanshu",
      date: "05 Sep 2025",
    },
    {
      title: "Beach Bliss in Goa",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=60",
      desc: "The waves, music, and serenity — everything that defines Goa in one trip.",
      author: "TravelGuide User",
      date: "21 Aug 2025",
    },
    {
      title: "Hidden Streets of Paris",
      image:
        "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=900&q=60",
      desc: "Exploring cafés, artists, and stories in the narrow alleys of Paris.",
      author: "Archit Jain",
      date: "28 Jul 2025",
    },
  ];

  return (
    <div className="saved-stories-page">
      <header className="stories-header">
        <h1>📖 Your Saved Stories</h1>
        <p>
          Relive your favorite journeys and adventures that inspired your travel
          dreams.
        </p>
      </header>

      <div className="stories-grid">
        {stories.map((story, index) => (
          <div className="story-card" key={index}>
            <div className="story-image">
              <img src={story.image} alt={story.title} />
            </div>
            <div className="story-content">
              <h2>{story.title}</h2>
              <p className="story-desc">{story.desc}</p>
              <div className="story-meta">
                <span>✍️ {story.author}</span>
                <span>📅 {story.date}</span>
              </div>
              <button className="read-btn">Read Story</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
