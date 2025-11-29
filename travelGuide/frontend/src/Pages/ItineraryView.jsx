import React, { useState } from "react";
import {
  FiDownload,
  FiShare2,
  FiArrowLeft,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import "./ItineraryView.css";

export default function ItineraryView({ itinerary, onBack }) {
  const [openDay, setOpenDay] = useState(null);

  const toggleDay = (i) => {
    setOpenDay(openDay === i ? null : i);
  };

  const downloadJSON = () => {
    const data = JSON.stringify(itinerary, null, 2);
    const el = document.createElement("a");
    el.setAttribute(
      "href",
      "data:text/json;charset=utf-8," + encodeURIComponent(data)
    );
    el.setAttribute(
      "download",
      `${(itinerary.tripTitle || "itinerary").replace(/\s+/g, "_")}.json`
    );
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  return (
    <div className="itinerary-container">

      {/* Back Button */}
      <button className="itinerary-back-btn" onClick={onBack}>
        <FiArrowLeft /> Back
      </button>

      {/* HEADER */}
      <div className="itinerary-title-block">
        <h1 className="itinerary-title">{itinerary.tripTitle}</h1>
        <p className="itinerary-sub">{itinerary.summary}</p>

     <div className="itinerary-chips">
  <div className="chip">💰 {itinerary.totalEstimatedCost}</div>

  <div className="chip">
    <FiCalendar /> {itinerary.days?.length || itinerary.duration} Days
  </div>

  {/* ⭐ NEW CHIP: Crowd Level */}
  <div className="chip crowd">
    🧍 {itinerary.crowdLevel || "Medium"}
  </div>

  <div className="chip season">
    🟢 Oct–Mar (Best Season)
  </div>
</div>


        {/* Weather Alert */}
        <div className="weather-alert">
          <strong>⚠ WEATHER ALERT</strong>
          <p>January. Warm & Pleasant (25–32°C)</p>
        </div>
      </div>

      {/* DAYS LIST */}
      <div className="itinerary-days-list">
        {itinerary.days?.map((day, idx) => (
          <div className="day-card" key={idx}>
            <div className="day-header" onClick={() => toggleDay(idx)}>
              <div className="day-header-left">
                <FiCalendar className="day-icon" />
                <div>
                  <div className="day-title">
                    DAY {day.day || idx + 1} — {day.date}
                  </div>
                  {day.theme && (
                    <div className="day-subtitle">{day.theme}</div>
                  )}
                </div>
              </div>
              <div>{openDay === idx ? <FiChevronUp /> : <FiChevronDown />}</div>
            </div>

            {/* COLLAPSE */}
            {openDay === idx && (
              <div className="day-body">
                {day.activities?.map((a, i) => (
                  <div className="activity" key={i}>
                    <div className="act-time">{a.time}</div>
                    <div className="act-content">
                      <strong className="act-title">
                        {a.activity || a.description}
                      </strong>

                     {a.mapsLink && (
  <a 
    href={a.mapsLink}
    target="_blank"
    rel="noopener noreferrer"
    className="maps-link"
  >
    📍 Open in Google Maps
  </a>
)}

{a.location && (
  <div className="act-location">📍 {a.location}</div>
)}


                      {a.description && (
                        <p className="act-desc">{a.description}</p>
                      )}

                      <div className="act-meta">
                        {a.duration && <span>⏱ {a.duration}</span>}
                        {a.estimatedCost && <span>💰 {a.estimatedCost}</span>}
                      </div>

                      {a.notes && (
                        <p className="act-notes">📝 {a.notes}</p>
                      )}
                    </div>
                  </div>
                ))}

                {day.dailyEstimatedCost && (
                  <div className="day-cost">
                    💵 Daily Cost: {day.dailyEstimatedCost}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="itinerary-actions">
        <button className="btn-primary" onClick={downloadJSON}>
          <FiDownload /> Download
        </button>

        <button className="btn-secondary" onClick={() => navigator.share?.({
          title: itinerary.tripTitle,
          text: itinerary.summary,
        })}>
          <FiShare2 /> Share
        </button>
      </div>
    </div>
  );
}
