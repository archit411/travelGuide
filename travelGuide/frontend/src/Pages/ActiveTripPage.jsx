import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import "./activetrip.css";

export default function ActiveTripPage() {
  const activeTrip = JSON.parse(localStorage.getItem("activeTrip"));
  const currentDayIndex = parseInt(localStorage.getItem("currentDayIndex") || 0);
  const today = activeTrip?.days[currentDayIndex];

  if (!activeTrip) return <div>No active trip</div>;

  // -------------------------
  // LOAD VISITED PROGRESS FOR THIS DAY
  // -------------------------
  const visitedKey = `visited_day_${currentDayIndex}`;
  const [visited, setVisited] = useState(
    JSON.parse(localStorage.getItem(visitedKey) || "{}")
  );

  const toggleVisited = (index) => {
    const updated = { ...visited, [index]: !visited[index] };
    setVisited(updated);
    localStorage.setItem(visitedKey, JSON.stringify(updated));
  };

  // -------------------------
  // TIMELINE PROGRESS CALCULATION
  // -------------------------
  const total = today?.activities?.length || 0;
  const completed = Object.values(visited).filter(Boolean).length;
  const progressPercent = total ? (completed / total) * 100 : 0;

  return (
    <div className="vtp-wrapper">

      {/* HEADER IMAGE */}
      <div className="vtp-banner">
        <button className="vtp-back" onClick={() => window.history.back()}>
          <FiArrowLeft size={20} />
        </button>

        <img
          src='./bgImg.avif'
          className="vtp-banner-img"
          alt="Trip Banner"
        />

        <div className="vtp-banner-overlay" />

        <div className="vtp-date-range">
          {activeTrip.startDate} – {activeTrip.endDate}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="vtp-body">

        {/* DAY HEADER */}
        <div className="vtp-day-header">
          <div className="vtp-day-circle">D{currentDayIndex + 1}</div>

          <div>
            <h2 className="vtp-day-title">Day {currentDayIndex + 1}</h2>
            <p className="vtp-day-date">{today?.date}</p>
          </div>
        </div>

        {/* VERTICAL TIMELINE */}
        <div className="vtp-timeline">

          {/* Grey background line */}
          <div className="vtp-line"></div>

          {/* FILLED PROGRESS LINE */}
          <div
            className="vtp-line-fill"
            style={{ height: `${progressPercent}%` }}
          ></div>

          {/* ACTIVITY CARDS */}
          <div className="vtp-cards">
            {today?.activities?.map((act, index) => (
              <div
                key={index}
                className={`vtp-item-wrapper ${visited[index] ? "vtp-visited" : ""}`}
              >
                {/* DOT */}
                <div className="vtp-dot"></div>

                {/* CARD */}
                <div className="vtp-card">

                  <img
                    src={act.image || today.bannerImage}
                    className="vtp-img"
                    alt={act.activity}
                  />

                  <h3 className="vtp-title">{act.activity}</h3>
                  <p className="vtp-desc">{act.description}</p>
                  <p className="vtp-location">📍 {act.location}</p>

                  {/* BUTTON SECTION */}
                  <div className="vtp-buttons">

                    <a
                      className="btn-dir"
                      target="_blank"
                      href={act.mapsLink || "#"}
                    >
                      ➤ Directions
                    </a>

                    <a
                      className="btn-uber"
                      target="_blank"
                      href={`https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${act.lat}&dropoff[longitude]=${act.lon}`}
                    >
                      🚗 Uber
                    </a>

                    <a
                      className="btn-ola"
                      target="_blank"
                      href={`https://olawebcdn.com/assets/ola-universal-link.html?lat=${act.lat}&lng=${act.lon}`}
                    >
                      🚕 Ola
                    </a>

                  </div>

                  {/* MARK COMPLETED BUTTON */}
                  <button
                    className={`vtp-visit-btn ${visited[index] ? "done" : ""}`}
                    onClick={() => toggleVisited(index)}
                  >
                    {visited[index] ? "✓ Completed" : "Mark Visited"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NEXT / PREVIOUS / FINISH DAY BUTTONS */}
        <div className="vtp-day-nav">

          {/* PREVIOUS DAY */}
          {currentDayIndex > 0 && (
            <button
              className="vtp-nav-btn secondary"
              onClick={() => {
                localStorage.setItem("currentDayIndex", currentDayIndex - 1);
                window.location.reload();
              }}
            >
              ← Previous Day
            </button>
          )}

          {/* NEXT DAY */}
          {currentDayIndex < activeTrip.days.length - 1 && completed === total && (
            <button
              className="vtp-nav-btn primary"
              onClick={() => {
                localStorage.removeItem(visitedKey);
                localStorage.setItem("currentDayIndex", currentDayIndex + 1);
                window.location.reload();
              }}
            >
              Next Day →
            </button>
          )}

          {/* FINISH TRIP */}
          {currentDayIndex === activeTrip.days.length - 1 && completed === total && (
            <button
              className="vtp-finish-trip"
              onClick={() => {
                localStorage.removeItem("activeTrip");
                localStorage.removeItem("currentDayIndex");
                window.history.back();
              }}
            >
              🎉 Finish Trip
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
