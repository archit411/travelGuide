import { useEffect, useState, useRef } from "react";
import {
  FiSearch,
  FiHome,
  FiBookmark,
  FiUser,
  FiX,
  FiUpload,
  FiCamera,
  FiImage,
} from "react-icons/fi";
import { FaUtensils, FaStar } from "react-icons/fa";
import "./home.css";
import { useNavigate } from "react-router-dom";

/* 🔹 Skeleton Loader */
function SkeletonCard() {
  return (
    <div className="skeleton-card shimmer">
      <div className="skeleton-img"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-subtext"></div>
    </div>
  );
}

/* 🔹 Place Card */
function PlaceCard({ place }) {
  const { name, description, imageUrl } = place;
  return (
    <div className="place-card-new">
      <div
        className="place-image"
        style={{
          backgroundImage: `url(${
            imageUrl ||
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200"
          })`,
        }}
      ></div>
      <div className="place-info">
        <h4>📍 {name}</h4>
        <p>{description || "No description available."}</p>
      </div>
    </div>
  );
}

/* 🔔 Custom Modern Alert Component */
function ModernAlert({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="alert-overlay" onClick={onClose}>
      <div className="alert-box" onClick={(e) => e.stopPropagation()}>
        <div className="alert-icon">📵</div>
        <p>{message}</p>
        <button onClick={onClose} className="btn btn--primary full">
          OK
        </button>
      </div>
    </div>
  );
}

/* 📸 Add Story Modal */
function AddStoryModal({ onClose, onAddStory }) {
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState("");
  const [temperature, setTemperature] = useState(
    `${Math.floor(Math.random() * 10) + 20}°C`
  );
  const [crowd, setCrowd] = useState("Low");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const startCamera = async () => {
    if (!isMobileDevice) {
      setAlertMsg("📱 Camera access is only available on mobile devices.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setAlertMsg("Unable to access camera. Please check permissions.");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
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

  // 🧹 Clean up camera when modal closes
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setPreview(URL.createObjectURL(file));
    } else {
      setAlertMsg("⚠️ File too large (max 10MB).");
    }
  };

  const handleSubmit = () => {
    if (!preview || !location.trim())
      return setAlertMsg(
        "Please upload or capture an image and add a valid location."
      );
    onAddStory({
      image: preview,
      location,
      temperature,
      crowd,
      comment,
      rating,
      likes: 0,
    });
    onClose();
  };

  return (
    <>
      <div className="popup-overlay">
        <div className="popup-card">
          <div className="popup-header">
            <button className="popup-close" onClick={onClose}>
              <FiX />
            </button>
            <h2>Add Update</h2>
            <p>Share your travel experience</p>
          </div>

          <div className="popup-body">
            {/* 📸 Camera or Upload */}
            {!isCameraActive ? (
              <>
                {preview ? (
                  <img src={preview} alt="Preview" className="upload-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <FiUpload size={32} />
                    <p>Click to upload or use camera</p>
                    <small>PNG, JPG up to 10MB</small>
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
                      accept="image/*"
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
                  <button className="btn btn--primary" onClick={capturePhoto}>
                    📸 Capture
                  </button>
                  <button className="btn btn--cancel" onClick={stopCamera}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* 🌍 Location */}
            <div className="form-section">
              <label>Destination</label>
              <input
                type="text"
                placeholder="Enter location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* 🌡️ Temperature */}
            <div className="form-section">
              <label>Current Temperature</label>
              <input
                type="text"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="e.g., 26°C"
              />
              <small>Auto-generated — editable if needed</small>
            </div>

            {/* 👥 Crowd Level */}
            <div className="form-section">
              <label>Crowd Level</label>
              <div className="crowd-options">
                {["Low", "Medium", "High"].map((level) => (
                  <button
                    key={level}
                    className={`crowd-chip ${crowd === level ? "active" : ""}`}
                    onClick={() => setCrowd(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* ⭐ Rating */}
            <div className="form-section">
              <label>Your Rating</label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((num) => (
                  <FaStar
                    key={num}
                    size={24}
                    onClick={() => setRating(num)}
                    color={num <= rating ? "#facc15" : "#d1d5db"}
                    style={{ cursor: "pointer", transition: "0.2s" }}
                  />
                ))}
              </div>
              <small>{rating ? `${rating}/5 stars` : "Tap a star to rate"}</small>
            </div>

            {/* 💬 Caption */}
            <div className="form-section">
              <label>Caption (Optional)</label>
              <textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={200}
              />
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

      {/* 🩵 Modern Alert Popup */}
      <ModernAlert message={alertMsg} onClose={() => setAlertMsg("")} />
    </>
  );
}

/* 🌍 Main Component */
export default function TripPulse() {
  const [active, setActive] = useState("home");
  const [topPlaces, setTopPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("");
  const [stories, setStories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
const navigate = useNavigate();
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setTopPlaces(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopPlaces();
  }, [month]);

  const addStory = (story) => setStories((prev) => [story, ...prev]);

  const places = topPlaces
    .flatMap((region) => [
      region.placeOne && {
        name: region.placeOne,
        description: region.placeOneDescription,
        imageUrl: region.placeOneImageUrl,
      },
      region.placeTwo && {
        name: region.placeTwo,
        description: region.placeTwoDescription,
        imageUrl: region.placeTwoImageUrl,
      },
    ])
    .filter(Boolean);

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
              <div key={i} className="story-card">
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
          <h2>{month ? `${month}'s Top Places` : "Loading..."}</h2>
        </div>

        <div className="place-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : places.map((place, i) => <PlaceCard key={i} place={place} />)}
        </div>
      </section>

      <footer className="tp-footer">🇮🇳 Made in India • ❤️ Crafted in Mumbai</footer>

      <nav className="tp-nav">
  {[
    { id: "home", label: "Home", icon: <FiHome />, path: "/homepage" },
    { id: "food", label: "Food", icon: <FaUtensils />, path: "/food" },
    { id: "saved", label: "Saved", icon: <FiBookmark />, path: "/saved" },
    { id: "profile", label: "Profile", icon: <FiUser />, path: "/profile" },
  ].map((item) => (
    <button
      key={item.id}
      className={`nav-btn ${active === item.id ? "active" : ""}`}
      onClick={() => {
        setActive(item.id);
        navigate(item.path); // 👈 Navigate to that route
      }}
    >
      <div className="nav-icon">{item.icon}</div>
      <span className="nav-label">{item.label}</span>
    </button>
  ))}
</nav>



      {showAddModal && (
        <AddStoryModal onClose={() => setShowAddModal(false)} onAddStory={addStory} />
      )}
    </div>
  );
}
