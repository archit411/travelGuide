import React, { useState, useEffect, useRef } from "react";
import { FiX, FiUpload, FiCamera, FiImage } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import "./home.css";

export default function AddPost({ onClose, onAddStory }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState("");
  const [btn, setBtn] = useState(false);
  const [temperature, setTemperature] = useState(`${Math.floor(Math.random() * 10) + 20}`);
  const [crowd, setCrowd] = useState("Low");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "aj_archit";
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      setSnackbarMsg("📷 Unable to access camera. Check permissions.");
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
    canvas.toBlob((blob) => {
      if (!blob) return;
      const newFile = new File([blob], "captured_image.png", { type: "image/png" });
      setFile(newFile);
      setPreview(URL.createObjectURL(newFile));
      stopCamera();
    });
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
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

  // ✅ Destination Validation (Only alphabets and spaces)
  const handleLocationChange = (e) => {
    const input = e.target.value;
    if (/^[A-Za-z\s]*$/.test(input)) {
      setLocation(input);
    } else {
      setSnackbarMsg("⚠️ Destination should contain only alphabets.");
    }
  };

  // ✅ Temperature Validation (Only numbers)
  const handleTemperatureChange = (e) => {
    const input = e.target.value;
    if (/^\d*$/.test(input)) {
      setTemperature(input);
    } else {
      setSnackbarMsg("⚠️ Temperature should be numeric only.");
    }
  };

  const handleSubmit = async () => {
    if (!file) return setSnackbarMsg("⚠️ Please upload or capture a photo.");
    if (!location.trim()) return setSnackbarMsg("⚠️ Destination is required.");
    if (!temperature.trim()) return setSnackbarMsg("⚠️ Temperature is required.");
    if (!crowd.trim()) return setSnackbarMsg("⚠️ Please select crowd level.");
    if (rating === 0) return setSnackbarMsg("⚠️ Please give a rating.");

    if (!token) {
      setSnackbarMsg("❌ Missing token. Please log in again.");
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

      const res = await fetch("https://travelguide-1-21sw.onrender.com/api/travel/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

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
        setSnackbarMsg("❌ Upload failed. Please try again.");
        setBtn(false);
      }
    } catch {
      setSnackbarMsg("⚠️ Server error. Try again later.");
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
            <img src={preview} alt="Preview" className="upload-preview medium-preview" />
          ) : (
            <div className="upload-placeholder">
              <FiUpload size={32} />
              <p>Click below to add photo</p>
              <small>PNG, JPG up to 10MB</small>
            </div>
          )}

          <div className="upload-actions">
            {isMobile && (
              <button className="upload-btn" onClick={startCamera}>
                <FiCamera /> Take Photo
              </button>
            )}
            <label className="upload-btn">
              <FiImage /> Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          {videoRef.current && (
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

          {/* ✅ Destination field - alphabets only */}
          <div className="form-section">
            <label>Destination *</label>
            <input
              type="text"
              placeholder="Enter location..."
              value={location}
              onChange={handleLocationChange}
            />
          </div>

          {/* ✅ Temperature field - numeric only */}
          <div className="form-section">
            <label>Current Temperature (°C) *</label>
            <input
              type="text"
              value={temperature}
              onChange={handleTemperatureChange}
              placeholder="e.g., 26"
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
            <small>{rating ? `${rating}/5 stars` : "Tap a star to rate"}</small>
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
            <div className="snackbar inside-popup" onAnimationEnd={() => setSnackbarMsg("")}>
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
