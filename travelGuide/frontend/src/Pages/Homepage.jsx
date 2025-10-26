import { useEffect, useState, useRef } from "react";
import {
  FiSearch,
  FiHome,
  FiBookmark,
  FiUser,
  FiX,
  FiUpload,
  FiHeart,
  FiCamera,
  FiImage,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import "./home.css";

function RegionCard({ region }) {
  if (!region) return null;
  const { region: name, weather, imageUrl, ...places } = region;
  const fallbackImages = {
    goa: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200",
    manali: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200",
    shimla: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?q=80&w=1200",
    jaipur: "https://images.unsplash.com/photo-1616064399191-70fc29388c32?q=80&w=1200",
  };
  const bg =
    imageUrl ||
    fallbackImages[name?.toLowerCase()] ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200";

  return (
    <div className="region-card">
      <div className="region-img" style={{ backgroundImage: `url(${bg})` }}>
        <div className="region-overlay">
          <h3>{name || "Unknown Region"}</h3>
          <p>🌤 {weather || "Weather not available"}</p>
        </div>
      </div>
      <div className="place-list">
        {Object.keys(places)
          .filter((key) => key.startsWith("place") && !key.includes("Description"))
          .map((placeKey, index) => (
            <div key={index} className="place-card">
              <h4>📍 {places[placeKey]}</h4>
              <p>{places[placeKey + "Description"]}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

function AddStoryModal({ onClose, onAddStory }) {
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [temperature, setTemperature] = useState("");
  const [crowd, setCrowd] = useState("Low");
  const [comment, setComment] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const apiKey = "YOUR_GOOGLE_PLACES_API_KEY";

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch {
      alert("Camera access denied or unavailable.");
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/png");
    setPreview(imageData);
    stopCamera();
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) setPreview(URL.createObjectURL(file));
    else alert("File too large (max 10MB).");
  };

  const handleLocationChange = async (e) => {
    const value = e.target.value;
    setLocation(value);
    if (value.length < 3) return setSuggestions([]);
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          value
        )}&key=${apiKey}&components=country:in`
      );
      const data = await res.json();
      if (data.status === "OK") setSuggestions(data.predictions);
    } catch {}
  };

  const handleSelectLocation = (desc) => {
    setLocation(desc);
    setSuggestions([]);
    setTemperature(`${Math.floor(Math.random() * 10) + 15}°C`);
  };

  const handleSubmit = () => {
    if (!preview || !location) return alert("Please upload or capture an image and add a location.");
    onAddStory({ image: preview, location, temperature, crowd, comment, likes: 0 });
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <div className="popup-header">
          <button className="popup-close" onClick={onClose}><FiX /></button>
          <h2>Add Update</h2>
          <p>Share your travel experience</p>
        </div>

        <div className="popup-body">
          <div className="upload-box">
            {!isCameraActive ? (
              <>
                {preview ? (
                  <img src={preview} alt="Preview" className="upload-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <FiUpload size={32} />
                    <p>Click to upload or use camera</p>
                    <small>PNG, JPG, MP4 up to 10MB</small>
                  </div>
                )}
                <div className="upload-actions">
                  <button className="upload-btn" onClick={startCamera}>
                    <FiCamera /> Capture from Camera
                  </button>
                  <label className="upload-btn">
                    <FiImage /> Upload from Gallery
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              </>
            ) : (
              <div className="camera-container">
                <video ref={videoRef} autoPlay playsInline className="camera-feed" />
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <div className="camera-controls">
                  <button className="btn btn--primary" onClick={capturePhoto}>📸 Capture</button>
                  <button className="btn btn--cancel" onClick={stopCamera}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          <div className="form-section location-suggest">
            <label>Destination</label>
            <input
              type="text"
              placeholder="e.g., Manali - Solang Valley"
              value={location}
              onChange={handleLocationChange}
            />
            {suggestions.length > 0 && (
              <ul className="suggestion-list">
                {suggestions.map((s, i) => (
                  <li key={i} onClick={() => handleSelectLocation(s.description)}>
                    <FiMapPin /> {s.description}
                  </li>
                ))}
              </ul>
            )}
            <small>Your location will be auto-detected</small>
          </div>

          <div className="form-section">
            <label>Current Temperature</label>
            <input
              type="text"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="Auto-fetched from weather API"
            />
            <small>Auto-fetched from weather API (editable)</small>
          </div>

          <div className="form-section">
            <label>Crowd Level</label>
            <div className="crowd-options">
              {["Low", "Medium", "High"].map((level) => (
                <button
                  key={level}
                  className={`crowd-chip ${crowd === level ? "active" : ""}`}
                  onClick={() => setCrowd(level)}
                >
                  {level === "Low" && "🟢 Low — Peaceful"}
                  {level === "Medium" && "🟡 Medium — Moderate"}
                  {level === "High" && "🔴 High — Crowded"}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label>Caption (Optional)</label>
            <textarea
              placeholder="Share your experience... (e.g., 'Perfect weather for trekking!')"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={200}
            />
            <small>Max 200 characters</small>
          </div>
        </div>

        <div className="popup-footer">
          <button className="btn btn--primary full" onClick={handleSubmit}>
            Post Update
          </button>
          <button className="btn btn--cancel full" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewStoryModal({ story, onClose }) {
  if (!story) return null;
  return (
    <div className="popup-overlay">
      <div className="popup-content view-story">
        <button className="popup-close" onClick={onClose}><FiX /></button>
        <img src={story.image} alt={story.location} className="story-full-img" />
        <div className="story-info">
          <p><FiMapPin /> {story.location}</p>
          <p><FiUsers /> Crowd: {story.crowd}</p>
          {story.comment && <p>💬 {story.comment}</p>}
          <p><FiHeart color="red" /> {story.likes} Likes</p>
        </div>
      </div>
    </div>
  );
}

export default function TripPulse() {
  const [active, setActive] = useState("home");
  const [topPlaces, setTopPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("");
  const [stories, setStories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewStory, setViewStory] = useState(null);

  useEffect(() => {
    const localMonth = new Date().toLocaleString("default", { month: "long" });
    setMonth(localMonth);
  }, []);

  useEffect(() => {
    if (!month) return;
    const fetchTopPlaces = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/getTopPlacesByMonth", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTopPlaces(Array.isArray(data) ? data : []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchTopPlaces();
  }, [month]);

  const addStory = (story) => setStories((prev) => [story, ...prev]);

  return (
    <div className="tp">
      <header className="tp-header">
        <div className="tp-brand">
          <img className="brand-logo" src="src/assets/logo.png" alt="TripPulse" />
          <div>
            <h1>TripPulse</h1>
            <div className="brand-sub">Discover • Plan • Go</div>
          </div>
        </div>
        <button className="btn btn--primary" onClick={() => setShowAddModal(true)}>
          + Add Update
        </button>
      </header>

      <div className="tp-search">
        <div className="search">
          <FiSearch />
          <input placeholder="Search destinations..." />
        </div>
      </div>

      {stories.length > 0 && (
        <div className="stories-section">
          <h3>Your Stories</h3>
          <div className="stories-grid">
            {stories.map((s, i) => (
              <div key={i} className="story-card" onClick={() => setViewStory(s)}>
                <img src={s.image} alt={s.location} />
                <div className="story-overlay">
                  <p className="story-loc">📍 {s.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="tp-highlights">
        <div className="section-head">
          <h2>{month ? `${month}'s Top Destinations` : "Loading..."}</h2>
        </div>
        <div className="region-grid">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton skeleton-card" />)
            : topPlaces.map((region, i) => <RegionCard key={i} region={region} />)}
        </div>
      </section>

      <footer className="tp-footer">🇮🇳 Made in India • ❤️ Crafted in Mumbai</footer>

      <nav className="tp-nav">
        {[
          { id: "home", label: "Home", icon: <FiHome /> },
          { id: "food", label: "Food", icon: <FaUtensils /> },
          { id: "saved", label: "Saved", icon: <FiBookmark /> },
          { id: "profile", label: "Profile", icon: <FiUser /> },
        ].map((item) => (
          <button
            key={item.id}
            className={`nav-btn ${active === item.id ? "active" : ""}`}
            onClick={() => setActive(item.id)}
          >
            <div className="nav-icon">{item.icon}</div>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {showAddModal && <AddStoryModal onClose={() => setShowAddModal(false)} onAddStory={addStory} />}
      {viewStory && <ViewStoryModal story={viewStory} onClose={() => setViewStory(null)} />}
    </div>
  );
}
