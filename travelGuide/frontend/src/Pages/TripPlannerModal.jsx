import React, { useState, useEffect } from "react";
import {
  FiArrowRight,
  FiX,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiActivity,
  FiClock,
  FiCompass,
  FiSun,
  FiTruck,
  FiNavigation,
  FiCreditCard
} from "react-icons/fi";
import {
  MdFlight,
  MdDirectionsCar,
  MdDirectionsBus,
  MdTrain,
  MdHiking,
  MdBeachAccess,
  MdRestaurant,
  MdHistoryEdu,
  MdLocalOffer,
  MdPedalBike,
  MdMoped
} from "react-icons/md";
import { FaPiggyBank, FaGem, FaCarSide, FaShuttleVan, FaBus, FaPlane } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { generateItinerary, searchPlaces } from "../utils/tripItineraryService";
import ProcessingAnimation from "./ProcessingAnimation";
import "./TripPlannerModal.css";
import loadingAnimation from "../lottie/loadingAnimation.json";

export default function TripPlannerModal({ onClose, onGenerateItinerary, initialData }) {
  const [step, setStep] = useState(1); // 1: Discover, 2: Plan, 3: Go
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showProcessing, setShowProcessing] = useState(false);
  const [showPlaneTransition, setShowPlaneTransition] = useState(false);

  // Lock Body Scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // -- STATE FIELDS --
  const [destination, setDestination] = useState(initialData?.destination || "");
  const [interests, setInterests] = useState(initialData?.interests || "Adventure");
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [duration, setDuration] = useState(initialData?.duration || 3);
  const [people, setPeople] = useState(initialData?.people || 2);
  const [budget, setBudget] = useState(initialData?.budget || "Medium");
  const [transport, setTransport] = useState(initialData?.transport || "Self Drive");
  const [crowdLevel, setCrowdLevel] = useState(initialData?.crowdLevel || "Medium");

  // -- AUTOCOMPLETE STATE --
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  // Debounce Search for Destination
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (destination.length > 2 && showDestSuggestions) {
        try {
          const results = await searchPlaces(destination);
          setDestSuggestions(results || []);
        } catch (err) {
          console.log("Search error", err);
        }
      } else {
        setDestSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [destination, showDestSuggestions]);


  // -- NEW STATE --
  const [includeFlights, setIncludeFlights] = useState(initialData?.includeFlights || false);
  const [originCity, setOriginCity] = useState(initialData?.originCity || "");

  // -- OPTIONS DATA --
  const interestOptions = [
    { label: "Adventure", icon: <MdHiking /> },
    { label: "Relaxation", icon: <MdBeachAccess /> },
    { label: "Culture", icon: <MdHistoryEdu /> },
    { label: "Foodie", icon: <MdRestaurant /> },
    { label: "Nature", icon: <FiSun /> },
    { label: "Luxury", icon: <MdLocalOffer /> }, // using ticket/tag as luxury placeholder or can use another
  ];

  /* Updated Logical Icons for Budget */
  const budgetOptions = [
    { label: "Budget", icon: <FaPiggyBank />, desc: "Pocket Friendly" },
    { label: "Medium", icon: <FiCreditCard />, desc: "Balanced" },
    { label: "Luxury", icon: <FaGem />, desc: "Premium" },
  ];

  const transportOptions = [
    { label: "Self Drive", icon: <MdDirectionsCar /> },
    { label: "Public", icon: <MdDirectionsBus /> },
    { label: "Flights", icon: <MdFlight /> },
    { label: "Mixed", icon: <FiNavigation /> },
  ];

  const crowdOptions = [
    { label: "Low", desc: "Quiet" },
    { label: "Medium", desc: "Balanced" },
    { label: "High", desc: "Lively" },
  ];

  // -- HELPER: PEOPLE VISUAL --
  const getPeopleVisual = (count) => {
    if (count === 1) return { icon: <MdPedalBike size={48} />, label: "Solo Traveler" };
    if (count === 2) return { icon: <MdMoped size={48} />, label: "Duo / Couple" };
    if (count <= 5) return { icon: <FaCarSide size={48} />, label: "Small Group" };
    if (count <= 8) return { icon: <FaShuttleVan size={48} />, label: "Large Group" };
    return { icon: <FaBus size={48} />, label: "Party Bus!" };
  };

  // -- LOGIC --
  const handleGenerate = async () => {
    setError("");

    if (!destination || !startDate) {
      setError("Please provide destination and start date.");
      return;
    }

    // Flight validation
    if (includeFlights && !originCity) {
      setError("Please enter your origin city for flight estimates.");
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
      people: parseInt(people),
      includeFlights,
      originCity: includeFlights ? originCity : null
    };

    // If flights are selected, show plane animation first
    if (includeFlights) {
      setShowPlaneTransition(true);
      await new Promise(r => setTimeout(r, 2500)); // wait for plane flyby
      setShowPlaneTransition(false);
    }

    setShowProcessing(true);

    try {
      const itinerary = await generateItinerary(payload);
      setTimeout(() => {
        setShowProcessing(false);
        onGenerateItinerary(itinerary, payload);
      }, 3500);
    } catch (e) {
      setShowPlaneTransition(false);
      setShowProcessing(false);
      console.log("Generation Error:", e);
      setError(e.message || "Failed to generate itinerary. Please try again.");
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // Select Suggestion
  const handleSelectPlace = (placeName) => {
    setDestination(placeName);
    setShowDestSuggestions(false);
    setDestSuggestions([]);
  };

  // -- ANIMATION VARIANTS --
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="trip-planner-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/** CLOSE BTN **/}
        <button className="modal-close" onClick={onClose}>
          <FiX size={20} />
        </button>

        {/** PLANE TRANSITION OVERLAY **/}
        <AnimatePresence>
          {showPlaneTransition && (
            <motion.div
              className="plane-transition-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="flying-plane"
                initial={{ x: -200, y: 50 }}
                animate={{ x: "120vw", y: -50 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              >
                <FaPlane size={80} color="#fff" />
                <div className="plane-trail"></div>
              </motion.div>
              <h2 style={{ color: 'white', marginTop: '200px' }}>Flying you to {destination}...</h2>
            </motion.div>
          )}
        </AnimatePresence>


        {/** FULL SCREEN LOADING **/}
        {showProcessing && !showPlaneTransition && (
          <ProcessingAnimation animation={loadingAnimation} />
        )}

        {!showProcessing && !showPlaneTransition && (
          <>
            {/** HEADER **/}
            <div className="modal-header">
              <h2>Let's Plan Your Trip</h2>
              <div className="progress-container">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`progress-dot ${step >= s ? "active" : ""}`}
                  />
                ))}
              </div>
            </div>

            {/** CONTENT AREA - ANIMATED **/}
            <div style={{ flex: 1, position: 'relative', overflowY: 'auto', overflowX: 'hidden' }}>
              <AnimatePresence mode="wait">

                {/* STEP 1: DISCOVER */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    className="step-content"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="step-title">
                      <FiMapPin style={{ color: "var(--primary-color)" }} /> Destination
                    </div>
                    <div className="form-group" style={{ position: 'relative' }}>
                      <input
                        className="input-field"
                        value={destination}
                        onChange={(e) => {
                          setDestination(e.target.value);
                          setShowDestSuggestions(true);
                        }}
                        onFocus={() => setShowDestSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)}
                        placeholder="Where to? (e.g. Kyoto, Paris, Goa)"
                        autoFocus
                      />
                      {showDestSuggestions && destSuggestions.length > 0 && (
                        <ul className="suggestions-list">
                          {destSuggestions.map((place, idx) => (
                            <li
                              key={idx}
                              className="suggestion-item"
                              onClick={() => handleSelectPlace(place.display_name)}
                            >
                              {place.display_name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="step-title">
                      <FiCompass style={{ color: "var(--primary-color)" }} /> Travel Vibe
                    </div>
                    <div className="selection-grid">
                      {interestOptions.map((opt) => (
                        <div
                          key={opt.label}
                          className={`selection-card ${interests === opt.label ? "selected" : ""}`}
                          onClick={() => setInterests(opt.label)}
                        >
                          <div className="card-icon">{opt.icon}</div>
                          <span className="card-label">{opt.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="step-nav">
                      <button className="nav-btn secondary" style={{ visibility: 'hidden' }}>Back</button>
                      <button
                        className="nav-btn primary"
                        onClick={nextStep}
                        disabled={!destination}
                      >
                        Next
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: PLAN */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    className="step-content"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="step-title">
                      <FiCalendar /> When & How Long?
                    </div>
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        className="input-field"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Duration: {duration} Days</label>
                      <input
                        type="range"
                        min="1"
                        max="15"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      />
                    </div>

                    <div className="step-title" style={{ marginTop: '12px' }}>
                      <FiUsers /> How Many Travelers?
                    </div>

                    <div className="people-visual-container">
                      <div className="people-icon-visual">
                        {getPeopleVisual(people).icon}
                      </div>
                      <p className="people-label-visual">{getPeopleVisual(people).label}</p>
                    </div>

                    <div className="counter-control centered-counter">
                      <button
                        className="counter-btn"
                        onClick={() => setPeople(Math.max(1, people - 1))}
                      >-</button>
                      <span className="counter-value">{people}</span>
                      <button
                        className="counter-btn"
                        onClick={() => setPeople(people + 1)}
                      >+</button>
                    </div>

                    <div className="step-nav">
                      <button className="nav-btn secondary" onClick={prevStep}>Back</button>
                      <button
                        className="nav-btn primary"
                        onClick={nextStep}
                        disabled={!startDate}
                      >
                        Next
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: GO */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    className="step-content"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="step-title"><FiDollarSign /> Budget</div>
                    <div className="selection-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                      {budgetOptions.map((opt) => (
                        <div
                          key={opt.label}
                          className={`selection-card ${budget === opt.label ? "selected" : ""}`}
                          onClick={() => setBudget(opt.label)}
                        >
                          <div className="card-icon">{opt.icon}</div>
                          <span className="card-label">{opt.label}</span>
                          <span className="card-desc" style={{ fontSize: '10px', color: '#94a3b8' }}>{opt.desc}</span>
                        </div>
                      ))}
                    </div>

                    <div className="step-title" style={{ marginTop: '16px' }}><FiTruck /> Transport</div>
                    <div className="selection-grid">
                      {transportOptions.map((opt) => (
                        <div
                          key={opt.label}
                          className={`selection-card ${transport === opt.label ? "selected" : ""}`}
                          onClick={() => setTransport(opt.label)}
                        >
                          <div className="card-icon">{opt.icon}</div>
                          <span className="card-label">{opt.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* FLIGHT INCLUSION OPTION - NEW UI */}
                    <div className="flight-option-box">
                      <div className="flight-header">
                        <div className="flex-center">
                          <MdFlight style={{ color: 'var(--primary-color)', fontSize: '20px' }} />
                          <span style={{ fontWeight: '600' }}>Include Flights?</span>
                        </div>

                        <div className="toggle-options">
                          <button
                            className={`toggle-btn ${includeFlights ? 'active' : ''}`}
                            onClick={() => setIncludeFlights(true)}
                          >Yes</button>
                          <button
                            className={`toggle-btn ${!includeFlights ? 'active' : ''}`}
                            onClick={() => {
                              setIncludeFlights(false);
                              setOriginCity("");
                            }}
                          >No</button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {includeFlights && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{ marginTop: '12px' }}>
                              <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '4px', display: 'block' }}>Departing From</label>
                              <input
                                className="input-field"
                                placeholder="From City (e.g. London)"
                                value={originCity}
                                onChange={(e) => setOriginCity(e.target.value)}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="step-title" style={{ marginTop: '16px' }}><FiActivity /> Crowd Level</div>
                    <div className="selection-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                      {crowdOptions.map((opt) => (
                        <div
                          key={opt.label}
                          className={`selection-card ${crowdLevel === opt.label ? "selected" : ""}`}
                          onClick={() => setCrowdLevel(opt.label)}
                        >
                          <span className="card-label">{opt.label}</span>
                        </div>
                      ))}
                    </div>

                    {error && <div className="error-box">{error}</div>}

                    <div className="step-nav">
                      <button className="nav-btn secondary" onClick={prevStep}>Back</button>
                      <button
                        className="nav-btn primary generate-btn"
                        onClick={handleGenerate}
                        disabled={loading}
                      >
                        {loading ? "Planning..." : "Generate Magic Trip ✨"}
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
