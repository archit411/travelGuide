import React, { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import "./activetrip.css";

export default function ActiveTripPage() {
  const activeTrip = JSON.parse(localStorage.getItem("activeTrip"));
  const currentDayIndex = parseInt(
    localStorage.getItem("currentDayIndex") || "0"
  );

  if (!activeTrip) return <div className="empty">No active trip</div>;

  const today = activeTrip.days[currentDayIndex];

  const visitedKey = `visited_day_${currentDayIndex}`;
  const [visited, setVisited] = useState(
    JSON.parse(localStorage.getItem(visitedKey) || "{}")
  );

  const toggleVisited = (index) => {
    const updated = { ...visited, [index]: !visited[index] };
    setVisited(updated);
    localStorage.setItem(visitedKey, JSON.stringify(updated));
  };

  const total = today?.activities?.length || 0;
  const completed = Object.values(visited).filter(Boolean).length;
  const progressPercent = total ? (completed / total) * 100 : 0;

  return (
    <div className="at-wrapper">
      {/* HEADER */}
      <header className="at-header">
        <button className="at-back" onClick={() => window.history.back()}>
          <FiArrowLeft />
        </button>

        <div>
          <h1 className="at-title">{activeTrip.destination}</h1>
          <p className="at-dates">
            {activeTrip.startDate} – {activeTrip.endDate}
          </p>
        </div>
      </header>

      {/* DAY + PROGRESS */}
      <section className="at-day">
        <div className="at-day-info">
          <div className="at-day-badge">Day {currentDayIndex + 1}</div>
          <p className="at-day-date">{today?.date}</p>
        </div>

        <div className="at-progress">
          <div
            className="at-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      {/* ACTIVITIES */}
      <section className="at-list">
        {today?.activities?.map((act, index) => (
          <div
            key={index}
            className={`at-card ${visited[index] ? "done" : ""}`}
          >
            <div className="at-card-head">
              <h3>{act.activity}</h3>

              <button
                className="at-check"
                onClick={() => toggleVisited(index)}
              >
                {visited[index] ? "✓" : "○"}
              </button>
            </div>

            <p className="at-desc">{act.description}</p>
            <p className="at-loc">📍 {act.location}</p>

            <div className="at-actions">
              <a href={act.mapsLink || "#"} target="_blank" rel="noreferrer">
                Directions
              </a>

              <a
                target="_blank"
                rel="noreferrer"
                href={`https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${act.lat}&dropoff[longitude]=${act.lon}`}
              >
                Uber
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* NAVIGATION */}
      <footer className="at-nav">
        {currentDayIndex > 0 && (
          <button
            onClick={() => {
              localStorage.setItem(
                "currentDayIndex",
                currentDayIndex - 1
              );
              window.location.reload();
            }}
          >
            Previous
          </button>
        )}

        {currentDayIndex < activeTrip.days.length - 1 &&
          completed === total && (
            <button
              className="primary"
              onClick={() => {
                localStorage.removeItem(visitedKey);
                localStorage.setItem(
                  "currentDayIndex",
                  currentDayIndex + 1
                );
                window.location.reload();
              }}
            >
              Next Day
            </button>
          )}
      </footer>
    </div>
  );
}
