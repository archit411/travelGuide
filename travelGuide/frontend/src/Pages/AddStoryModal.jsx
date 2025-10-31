import React, { useState, useEffect, useRef } from "react";
import { FiX, FiUpload, FiCamera, FiImage } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2";
import ModernAlert from "./ModernAlert";
import "./home.css";

export default function AddPost({ onClose, onAddStory }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState("");
  const [btn, setBtn] = useState(false); // ✅ FIXED
  const [temperature, setTemperature] = useState(
    `${Math.floor(Math.random() * 10) + 20}`
  );
  const [crowd, setCrowd] = useState("Low");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const username = localStorage.getItem("username") || "aj_archit";
  const token = localStorage.getItem("token");
  const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const isWebView = (() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera || "";
    if (/(FBAN|FBAV|Instagram|Line|Twitter|Electron|wv)/i.test(userAgent)) return true;
    if (/; wv\)/.test(userAgent)) return true;
    if (window.navigator.standalone) return true;
    return false;
  })();

  const checkCameraPermission = async () => {
    if (!("permissions" in navigator)) return true;
    try {
      const result = await navigator.permissions.query({ name: "camera" });
      if (result.state === "denied") {
        setAlertMsg("⚠️ Please enable camera permission in browser settings.");
        return false;
      }
      return true;
    } catch {
      return true;
    }
  };

  const startCamera = async () => {
    if (!isMobileDevice && !isWebView) {
      setAlertMsg("📵 Camera is only available on mobile devices or in-app browsers.");
      document.querySelector('input[type="file"]')?.click();
      return;
    }

    const hasPermission = await checkCameraPermission();
    if (!hasPermission) return;

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
      setAlertMsg("Unable to access camera. Please check browser permissions.");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
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
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.size <= 10 * 1024 * 1024) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setAlertMsg("⚠️ File too large (max 10MB).");
    }
  };

  const handleSubmit = async () => {
    if (!file || !location.trim()) {
      setAlertMsg("Please upload or capture an image and add a valid location.");
      return;
    }

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please login again. Missing token.",
      });
      return;
    }

    setBtn(true); // ✅ Disable button immediately

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("caption", comment || "No caption");
      formData.append("crowdLevel", crowd);
      formData.append("destination", location);
      formData.append("temprature", temperature);
      formData.append("userRating", rating);
      formData.append("username", username);

      const res = await fetch("http://localhost:8080/api/travel/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Please login again.",
        });
        localStorage.removeItem("token");
        setBtn(false); // ✅ Re-enable on error
        return;
      }

      const data = await res.json();

      if (data.status === "SUCCESS" || res.ok) {
        Swal.fire({
          icon: "success",
          title: "Story Uploaded 🎉",
          text: "Your travel update was shared successfully!",
          timer: 2000,
          showConfirmButton: false,
        });

        onAddStory({
          image: preview,
          location,
          temperature,
          crowd,
          comment,
          rating,
        });
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: data.errorMsg || "Please try again.",
        });
        setBtn(false); // ✅ Re-enable on failure
      }
    } catch (err) {
      console.error("Upload error:", err);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to upload story. Please try again later.",
      });
      setBtn(false); // ✅ Re-enable on network error
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
          </div>

          <div className="popup-footer">
            <button
              disabled={btn} // ✅ disable while uploading
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

      <ModernAlert message={alertMsg} onClose={() => setAlertMsg("")} />
    </>
  );
}
