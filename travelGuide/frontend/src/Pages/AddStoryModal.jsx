import React, { useState, useEffect } from "react";
import { FiX, FiUpload, FiImage } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import "./home.css";

export default function AddPost({ onClose, onAddStory }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState("Delhi");
  const [btn, setBtn] = useState(false);
  const [temperature, setTemperature] = useState(
    `${Math.floor(Math.random() * 10) + 20}`
  );
  const [crowd, setCrowd] = useState("Low");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "aj_archit";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.size <= 10 * 1024 * 1024) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setSnackbarMsg("⚠️ File too large (max 10MB).");
    }
  };

  const handleTemperatureChange = (e) => {
    const input = e.target.value;
    if (/^\d*$/.test(input)) {
      setTemperature(input);
    } else {
      setSnackbarMsg("⚠️ Temperature should be numeric only.");
    }
  };

  const handleSubmit = async () => {
    if (!file) return setSnackbarMsg("⚠️ Please upload a photo.");
    if (!temperature.trim()) return setSnackbarMsg("⚠️ Temperature is required.");
    if (!crowd.trim()) return setSnackbarMsg("⚠️ Select crowd level.");
    if (rating === 0) return setSnackbarMsg("⚠️ Please give a rating.");

    if (!token) {
      setSnackbarMsg("❌ Missing token. Please login again.");
      return;
    }

    setBtn(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("caption", comment || "No caption");
      formData.append("crowdLevel", crowd);
      formData.append("destination", location);
      formData.append("temprature", temperature);
      formData.append("userRating", rating);
      formData.append("username", username);

      const res = await fetch(
        "http://localhost:8080/api/travel/upload",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();

      if (data.status === "SUCCESS" || res.ok) {
        setSnackbarMsg("✅ Story uploaded successfully!");
        onAddStory({
          image: preview,
          location,
          temperature,
          crowd,
          comment,
          rating,
        });
        setTimeout(onClose, 1500);
      } else {
        setSnackbarMsg("❌ Upload failed.");
        setBtn(false);
      }
    } catch {
      setSnackbarMsg("⚠️ Server error. Try later.");
      setBtn(false);
    }
  };

  return (
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
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              style={{
                maxHeight: "260px",
                width: "100%",
                objectFit: "cover",
                borderRadius: "14px",
              }}
            />
          ) : (
            <div className="upload-placeholder">
              <FiUpload size={32} />
              <p>Click below to add photo</p>
              <small>PNG, JPG up to 10MB</small>
            </div>
          )}

          {/* ✅ Upload Button with Inline CSS */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 18px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(37, 99, 235, 0.35)",
                transition: "all 0.25s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 12px 28px rgba(37, 99, 235, 0.45)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(37, 99, 235, 0.35)")
              }
            >
              <FiImage size={18} />
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div className="form-section">
            <label>Destination *</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                fontSize: "14px",
              }}
            >
              <option value="Delhi">Delhi</option>
            </select>
          </div>

          <div className="form-section">
            <label>Current Temperature (°C) *</label>
            <input
              type="text"
              value={temperature}
              onChange={handleTemperatureChange}
              placeholder="e.g. 26"
            />
          </div>

          <div className="form-section">
            <label>Crowd Level *</label>
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

          <div className="form-section">
            <label>Your Rating *</label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((num) => (
                <FaStar
                  key={num}
                  size={24}
                  onClick={() => setRating(num)}
                  color={num <= rating ? "#facc15" : "#d1d5db"}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
          </div>

          <div className="form-section">
            <label>Caption (Optional)</label>
            <textarea
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={200}
            />
          </div>

          {snackbarMsg && (
            <div
              className="snackbar inside-popup"
              onAnimationEnd={() => setSnackbarMsg("")}
            >
              {snackbarMsg}
            </div>
          )}
        </div>

        <div className="popup-footer">
          <button
            disabled={btn}
            className={`btn btn--primary full ${btn ? "disabled" : ""}`}
            onClick={handleSubmit}
          >
            {btn ? "Posting..." : "Post Update"}
          </button>
          <button className="btn btn--cancel full" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
