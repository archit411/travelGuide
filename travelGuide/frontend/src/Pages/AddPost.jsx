import { useState, useRef, useEffect } from "react";
import { FiX, FiUpload, FiCamera, FiImage } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import "./home.css";

/* 🔔 Custom Modern Alert Component */
function ModernAlert({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="alert-overlay" onClick={onClose}>
      <div className="alert-box" onClick={(e) => e.stopPropagation()}>
        <div className="alert-icon">📢</div>
        <p>{message}</p>
        <button onClick={onClose} className="btn btn--primary full">
          OK
        </button>
      </div>
    </div>
  );
}

/* 📸 Add Post Modal */
export default function AddPost({ onClose, onAddStory }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState("");
  const [temperature, setTemperature] = useState(
    `${Math.floor(Math.random() * 10) + 20}°C`
  );
  const [crowd, setCrowd] = useState("Low");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "captured_image.png", { type: "image/png" });
        setFile(file);
        setPreview(URL.createObjectURL(file));
      }
    });
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

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setPreview(URL.createObjectURL(file));
      setFile(file);
    } else {
      setAlertMsg("⚠️ File too large (max 10MB).");
    }
  };

  const handleSubmit = async () => {
    if (!file || !location.trim()) {
      setAlertMsg("Please upload/capture an image and add a valid destination.");
      return;
    }

    const token = localStorage.getItem("token"); // JWT token from login
    const username = localStorage.getItem("username") || "Anonymous"; // optional

    if (!token) {
      setAlertMsg("⚠️ Please log in again. Token missing.");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("caption", comment);
      formData.append("crowdLevel", crowd);
      formData.append("destination", location);
      formData.append("temprature", temperature.replace("°C", ""));
      formData.append("userRating", rating);
      formData.append("image", file);
      formData.append("username", username);

      const response = await fetch("http://localhost:8080/api/travel/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Upload response:", data);

      if (data.status === "SUCCESS") {
        onAddStory({
          image: data.image,
          location: data.destination,
          temperature: data.temprature + "°C",
          crowd: data.crowdLevel,
          comment: data.caption,
          rating: data.userRating,
          username: data.username,
          createdOn: data.createdOn,
          likes: 0,
        });
        setAlertMsg("✅ Post uploaded successfully!");
        setTimeout(() => onClose(), 1500);
      } else {
        setAlertMsg("❌ Failed to upload post. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setAlertMsg("⚠️ Server error occurred while uploading.");
    } finally {
      setIsLoading(false);
    }
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
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="camera-feed"
                />
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

            <div className="form-section">
              <label>Destination</label>
              <input
                type="text"
                placeholder="Enter location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

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
              <small>
                {rating ? `${rating}/5 stars` : "Tap a star to rate"}
              </small>
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
          </div>

          <div className="popup-footer">
            <button
              className="btn btn--primary full"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Post Update"}
            </button>
            <button className="btn btn--cancel full" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      <ModernAlert message={alertMsg} onClose={() => setAlertMsg("")} />
    </>
  );
}
