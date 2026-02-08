import React, { useState, useEffect } from "react";
import { FiX, FiUpload, FiImage, FiMapPin, FiCheckCircle, FiThermometer } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { searchPlaces, getWeather, uploadTravelPost } from "../utils/tripItineraryService";
import "./AddStoryModal.css";

export default function AddPost({ onClose, onAddStory }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [temperature, setTemperature] = useState("");
  const [crowd, setCrowd] = useState("Medium");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  // Autocomplete State
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "aj_archit";

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  // Debounce Search for Destination
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (location.length > 2 && showDestSuggestions) {
        try {
          const results = await searchPlaces(location);
          setDestSuggestions(results || []);
        } catch (err) {
          console.error("Search error", err);
        }
      } else {
        setDestSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [location, showDestSuggestions]);

  const handleSelectPlace = async (place) => {
    setLocation(place.display_name);
    setShowDestSuggestions(false);

    if (place.lat && place.lon) {
      try {
        const data = await getWeather(place.lat, place.lon);
        // data.current_weather.temperature usually comes as a number
        if (data && data.current_weather) {
          setTemperature(data.current_weather.temperature.toString());
        }
      } catch (err) {
        console.error("Failed to fetch weather", err);
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.size <= 10 * 1024 * 1024) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setSnackbarMsg("⚠️ File too large (max 10MB).");
    }
  };

  const handleSubmit = async () => {
    if (!file) return setSnackbarMsg("⚠️ Please upload a photo.");
    if (!location.trim()) return setSnackbarMsg("⚠️ Destination is required.");
    if (!temperature || !temperature.toString().trim()) return setSnackbarMsg("⚠️ Temperature is required.");
    if (rating === 0) return setSnackbarMsg("⚠️ Please give a rating.");

    if (!token) {
      setSnackbarMsg("❌ Missing token. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("caption", comment || "No caption");
      formData.append("crowdLevel", crowd);
      formData.append("destination", location.trim());
      formData.append("temprature", temperature);
      formData.append("userRating", rating);
      formData.append("username", username);

      const data = await uploadTravelPost(formData);
      const result = Array.isArray(data) ? data[0] : data;

      if (result?.status === "SUCCESS") {
        setSnackbarMsg("✅ Story uploaded successfully!");
        if (onAddStory) {
          onAddStory({
            image: preview,
            destination: location,
            caption: comment,
            temprature: temperature,
            crowdLevel: crowd,
            userName: username,
            createdAt: new Date().toISOString(),
            likes: 0
          });
        }
        setTimeout(onClose, 1500);
      } else {
        setSnackbarMsg(`❌ ${result?.status || "Upload failed."}`);
        setLoading(false);
      }
    } catch (err) {
      setSnackbarMsg(`⚠️ ${err.message || "Server error. Try later."}`);
      setLoading(false);
    }
  };

  return (
    <div className="add-story-overlay" onClick={onClose}>
      <motion.div
        className="add-story-card"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Header */}
        <div className="modal-header">
          <h2>New Adventure</h2>
          <p>Share your latest travel story with the world</p>
          <button className="close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">

          {/* Upload Section */}
          <div className="upload-area">
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="image-preview" />
                <label className="reupload-btn">
                  <FiImage /> Change Photo
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                </label>
              </>
            ) : (
              <label className="upload-placeholder">
                <div style={{ background: '#e0e7ff', padding: '16px', borderRadius: '50%' }}>
                  <FiUpload size={32} color="#4f46e5" />
                </div>
                <span style={{ fontWeight: 600 }}>Click to Upload Photo</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Supports JPG, PNG (Max 10MB)</span>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              </label>
            )}
          </div>

          {/* Destination Autocomplete */}
          <div className="form-group">
            <span className="form-label">Where was this?</span>
            <div className="icon-input-wrapper">
              <FiMapPin className="input-icon" />
              <input
                className="form-input"
                placeholder="Search destination (e.g. Kyoto, Bali)"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setShowDestSuggestions(true);
                }}
                onFocus={() => setShowDestSuggestions(true)}
              />
            </div>
            {showDestSuggestions && destSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {destSuggestions.map((place, idx) => (
                  <li key={idx} className="suggestion-item" onClick={() => handleSelectPlace(place)}>
                    <FiMapPin size={14} style={{ marginRight: 8, opacity: 0.6 }} />
                    {place.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Temperature */}
            <div className="form-group">
              <span className="form-label">Temperature (°C)</span>
              <div className="icon-input-wrapper">
                <FiThermometer className="input-icon" />
                <input
                  type="number"
                  className="form-input"
                  placeholder="25"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                />
              </div>
            </div>

            {/* Crowd Level */}
            <div className="form-group">
              <span className="form-label">Crowd Level</span>
              <div className="chips-container">
                {["Low", "Medium", "High"].map(level => (
                  <div
                    key={level}
                    className={`chip ${crowd === level ? "active" : ""}`}
                    onClick={() => setCrowd(level)}
                  >
                    {level}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="form-group">
            <span className="form-label">Rate your experience</span>
            <div className="star-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="star-icon" onClick={() => setRating(star)}>
                  {star <= rating ? (
                    <FaStar size={32} color="#facc15" />
                  ) : (
                    <FaRegStar size={32} color="#cbd5e1" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Caption */}
          <div className="form-group">
            <span className="form-label">Caption</span>
            <textarea
              className="form-textarea"
              placeholder="Tell us more about this moment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
            />
            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
              {comment.length}/500
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Publishing..." : "Share Story"}
          </button>
          <button className="cancel-btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>

        {/* Snackbar */}
        <AnimatePresence>
          {snackbarMsg && (
            <motion.div
              className="snackbar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onAnimationEnd={() => !loading && setTimeout(() => setSnackbarMsg(""), 3000)}
            >
              {snackbarMsg.includes("✅") ? <FiCheckCircle /> : null}
              {snackbarMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
