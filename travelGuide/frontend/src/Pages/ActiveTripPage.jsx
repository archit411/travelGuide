import React, { useState, useEffect } from "react";
import {
  FiArrowLeft,
  FiMapPin,
  FiClock,
  FiCheck,
  FiNavigation,
  FiX
} from "react-icons/fi";
import { FaUber, FaTaxi, FaMotorcycle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./activetrip.css";

export default function ActiveTripPage() {
  const navigate = useNavigate();
  const [activeTrip, setActiveTrip] = useState(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [visited, setVisited] = useState({});

  // Ride Modal State
  const [showRideModal, setShowRideModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [rideOptions, setRideOptions] = useState([]);

  useEffect(() => {
    // Load Trip Data
    const trip = JSON.parse(localStorage.getItem("activeTrip"));
    if (trip) {
      setActiveTrip(trip);
      // Load correct day from storage or default to 0
      const storedDay = parseInt(localStorage.getItem("currentDayIndex") || "0");
      setActiveDayIndex(storedDay);
    }
  }, []);

  // Load visited status for the specific day whenever activeDayIndex changes
  useEffect(() => {
    if (activeTrip) {
      const visitedKey = `visited_day_${activeDayIndex}`;
      const storedVisited = JSON.parse(localStorage.getItem(visitedKey) || "{}");
      setVisited(storedVisited);

      // Sync global currentDayIndex when user manually switches tabs
      localStorage.setItem("currentDayIndex", activeDayIndex);
    }
  }, [activeDayIndex, activeTrip]);

  const toggleVisited = (actIndex) => {
    const updated = { ...visited, [actIndex]: !visited[actIndex] };
    setVisited(updated);
    const visitedKey = `visited_day_${activeDayIndex}`;
    localStorage.setItem(visitedKey, JSON.stringify(updated));
  };

  const openRideModal = (activity) => {
    setSelectedActivity(activity);

    // Generate Mock Estimates
    // In a real app, we'd call an aggregator API here
    const basePrice = Math.floor(Math.random() * 200) + 150; // Random base 150-350

    const options = [
      {
        id: 'uber',
        name: 'Uber',
        icon: <FaUber size={24} color="#000" />,
        price: basePrice,
        eta: '4 mins',
        link: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodeURIComponent(activity.location)}`
      },
      {
        id: 'ola',
        name: 'Ola',
        icon: <FaTaxi size={24} color="#fec02f" />, // Ola yellow-ish
        price: Math.floor(basePrice * 0.9 + Math.random() * 20), // Slightly different
        eta: '6 mins',
        link: `https://book.olacabs.com/?lat=${activity.lat || ''}&lng=${activity.lon || ''}&category=prime` // Generic deep link attempt
      },
      {
        id: 'rapido',
        name: 'Rapido',
        icon: <FaMotorcycle size={24} color="#eab308" />, // Yellow
        price: Math.floor(basePrice * 0.4), // Much cheaper
        eta: '2 mins',
        isBest: true, // Usually cheapest for solo
        link: "https://rapido.bike/" // Fallback
      }
    ];

    // Determine "Best Price" logic dynamically for UX
    const sorted = [...options].sort((a, b) => a.price - b.price);
    options.forEach(o => o.isBest = (o.id === sorted[0].id));

    setRideOptions(options);
    setShowRideModal(true);
  };

  if (!activeTrip) return (
    <div className="empty-state">
      <h3>No Active Trip</h3>
      <p>Go to Plan to start a new journey!</p>
      <button onClick={() => navigate('/homepage')} className="at-back-btn" style={{ marginTop: '20px' }}>
        Go Home
      </button>
    </div>
  );

  const days = activeTrip.days || [];
  const currentDay = days[activeDayIndex];

  return (
    <div className="at-wrapper">
      {/* --- Header --- */}
      <header className="at-header">
        <button className="at-back-btn" onClick={() => navigate('/homepage')}>
          <FiArrowLeft size={20} />
        </button>
        <div className="at-header-title">
          <h1>{activeTrip.destination}</h1>
          <p>{activeTrip.startDate} • {days.length} Days</p>
        </div>
      </header>

      {/* --- Day Tabs --- */}
      <div className="day-tabs-container">
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`day-tab ${activeDayIndex === idx ? 'active' : ''}`}
            onClick={() => setActiveDayIndex(idx)}
          >
            <span className="day-tab-label">Day {idx + 1}</span>
            <span className="day-tab-date">{day.date || `Day ${idx + 1}`}</span>
          </div>
        ))}
      </div>

      {/* --- Timeline Content --- */}
      <div className="timeline-container">
        <div className="timeline-line"></div>

        {currentDay?.activities?.map((act, idx) => {
          const isDone = visited[idx];
          return (
            <div className="timeline-item" key={idx}>
              {/* Timeline Dot */}
              <div className={`timeline-dot ${!isDone ? 'pending' : ''}`}></div>

              {/* Card */}
              <div className="activity-card">
                <div className="ac-icon-box">
                  {/* Choose icon based on type or fallback */}
                  {act.type === 'flight' ? <FiNavigation /> : <FiMapPin />}
                </div>

                <div className="ac-content">
                  <div className="ac-type">{act.category || "Activity"}</div>
                  <h3 className="ac-title">{act.activity}</h3>
                  <div className="ac-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiClock size={12} /> {act.time}
                    </span>
                    <span>{act.duration}</span>
                  </div>
                </div>

                <div className="ac-actions">
                  {/* Check/Done Button */}
                  <button
                    className={`btn-check ${isDone ? 'completed' : ''}`}
                    onClick={() => toggleVisited(idx)}
                  >
                    <FiCheck size={16} />
                  </button>

                  {/* Ride Button */}
                  <button
                    className="btn-ride-mini"
                    onClick={() => openRideModal(act)}
                  >
                    <FiNavigation size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Ride Estimation Modal --- */}
      {showRideModal && (
        <div className="ride-modal-overlay" onClick={() => setShowRideModal(false)}>
          <div className="ride-modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="ride-header">
              <h3>Go to {selectedActivity?.activity}</h3>
              <div style={{ cursor: 'pointer' }} onClick={() => setShowRideModal(false)}>
                <FiX size={24} />
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Comparing best rides for you...
            </p>

            <div className="ride-options">
              {rideOptions.map((opt) => (
                <div
                  key={opt.id}
                  className={`ride-option ${opt.isBest ? 'best-price' : ''}`}
                  onClick={() => window.open(opt.link, '_blank')}
                >
                  {opt.isBest && <span className="badge-best">Best Price</span>}

                  <div className="ride-info">
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: '#f1f5f9'
                    }}>
                      {opt.icon}
                    </div>
                    <div className="ride-details">
                      <strong>{opt.name}</strong>
                      <span>{opt.eta} away</span>
                    </div>
                  </div>

                  <div className="ride-price">
                    ₹{opt.price}
                  </div>
                </div>
              ))}
            </div>

            <button
              style={{
                width: '100%', padding: '16px', background: 'black', color: 'white',
                borderRadius: '16px', marginTop: '20px', fontSize: '16px', fontWeight: '600', border: 'none', cursor: 'pointer'
              }}
              onClick={() => {
                const best = rideOptions.find(o => o.isBest) || rideOptions[0];
                window.open(best.link, '_blank');
              }}
            >
              Book Best Ride
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
