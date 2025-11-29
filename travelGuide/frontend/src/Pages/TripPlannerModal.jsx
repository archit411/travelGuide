import React, { useState } from "react";
import { FiArrowRight, FiLoader, FiX } from "react-icons/fi";
import { generateItinerary } from "../utils/tripItineraryService";
import "./TripPlannerModal.css";
//Testing
export default function TripPlannerModal({ onClose, onGenerateItinerary }) {
  const [step, setStep] = useState("discover");
const [people, setPeople] = useState(2);

  // Discover
  const [destination, setDestination] = useState("");
  const [interests, setInterests] = useState("Adventure");

  // Plan
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState(3);

  // Go
  const [budget, setBudget] = useState("Medium");
  const [transport, setTransport] = useState("Self Drive");
  const [crowdLevel, setCrowdLevel] = useState("Medium");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    if (!destination || !startDate) {
      setError("Please provide destination and start date.");
      return;
    }

  const payload = {
  destination,
  duration: parseInt(duration),
  startDate,
  budget,
  interests,
  crowdLevel,
  transport,
  people: parseInt(people)   
};


    setLoading(true);
    try {
      const itinerary = await generateItinerary(payload);
      onGenerateItinerary(itinerary);
    } catch (e) {
      setError(e.message || "Failed to generate itinerary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="trip-planner-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FiX size={20} />
        </button>

        <div className="modal-header">
          <h2>Plan Your Trip</h2>
          <p>Discover • Plan • Go</p>
        </div>

        {step === "discover" && (
          <div className="step-content">
            <h3>Where to?</h3>
            <div className="form-group">
              <label>Destination *</label>
              <input
                className="input-field"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Goa, Jaipur"
              />
            </div>

            <div className="form-group">
              <label>Travel Style</label>
              <select
                className="input-field"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              >
                <option>Adventure</option>
                <option>Culture & History</option>
                <option>Beach & Relaxation</option>
                <option>Food & Cuisine</option>
                <option>Nature & Trekking</option>
                <option>Luxury & Comfort</option>
                <option>Budget Backpacking</option>
              </select>
            </div>

            <button
              className="step-btn"
              onClick={() => setStep("plan")}
              disabled={!destination}
            >
              Next <FiArrowRight />
            </button>
          </div>
        )}

        {step === "plan" && (
          <div className="step-content">
            <h3>When & How long?</h3>

            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                className="input-field"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Duration (days): {duration}</label>
              <input
                type="range"
                min="1"
                max="30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="input-slider"
              />
              <div className="form-group">
  <label>No. of People</label>
  <input
    type="number"
    className="input-field"
    min="1"
    value={people}
    onChange={(e) => setPeople(e.target.value)}
  />
</div>

            </div>

            <div className="step-nav">
              <button className="step-btn back" onClick={() => setStep("discover")}>
                ← Back
              </button>
              <button
                className="step-btn"
                onClick={() => setStep("go")}
                disabled={!startDate}
              >
                Next <FiArrowRight />
              </button>
            </div>
          </div>
        )}

        {step === "go" && (
          <div className="step-content">
            <h3>Budget & Transport</h3>

            <div className="form-group">
              <label>Budget</label>
              <div className="budget-options">
                {["Budget", "Medium", "Luxury"].map((b) => (
                  <button
                    key={b}
                    className={`budget-btn ${budget === b ? "active" : ""}`}
                    onClick={() => setBudget(b)}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Transport</label>
              <select
                className="input-field"
                value={transport}
                onChange={(e) => setTransport(e.target.value)}
              >
                <option>Self Drive</option>
                <option>Public Transport</option>
                <option>Flights</option>
                <option>Mixed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Crowd Level</label>
              <select
                className="input-field"
                value={crowdLevel}
                onChange={(e) => setCrowdLevel(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div className="step-nav">
              <button className="step-btn back" onClick={() => setStep("plan")}>
                ← Back
              </button>
              <button
                className="step-btn generate"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FiLoader className="spinner" /> Generating...
                  </>
                ) : (
                  "Generate Itinerary"
                )}
              </button>
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}