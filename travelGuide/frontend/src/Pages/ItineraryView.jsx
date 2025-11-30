import React, { useState } from "react";
import {
  FiDownload,
  FiShare2,
  FiArrowLeft,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


import "./ItineraryView.css";

export default function ItineraryView({ itinerary, onBack }) {
  const [openDay, setOpenDay] = useState(null);

  const toggleDay = (i) => {
    setOpenDay(openDay === i ? null : i);
  };

  // ------------------------------
  // 📌 GENERATE PDF
  // ------------------------------
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text(itinerary.tripTitle || "Trip Itinerary", 14, 16);

    doc.setFontSize(12);
    doc.text(itinerary.summary || "", 14, 26);

    itinerary.days?.forEach((day, index) => {
      const startY = 40 + index * 70;

      doc.setFontSize(14);
      doc.text(`Day ${index + 1} — ${day.theme || ""}`, 14, startY);

      const rows = day.activities?.map((a) => [
        a.time || "",
        a.activity || a.description || "",
        a.location || "",
        a.duration || "",
        a.estimatedCost || "",
      ]);

      autoTable(doc, {
  startY: startY + 6,
  head: [["Time", "Activity", "Location", "Duration", "Cost"]],
  body: rows,
  theme: "grid",
  styles: { fontSize: 9 }
});

    });

    doc.save(`${itinerary.tripTitle}.pdf`);
  };

  // ------------------------------
  // 🚀 START TRIP (Live Tracking)
  // ------------------------------
  const startTrip = () => {
    const tripData = {
      ...itinerary,
      currentDay: 1,
      completed: {},
    };

    localStorage.setItem("activeTrip", JSON.stringify(tripData));
    alert("Trip Started! Go to Home Page to continue.");
  };

  // ------------------------------
  // 📤 SHARE
  // ------------------------------
  const shareItinerary = () => {
    const text = `${itinerary.tripTitle}\n${itinerary.summary}`;

    if (navigator.share) {
      navigator.share({ title: itinerary.tripTitle, text });
    } else {
      alert(text);
    }
  };

  return (
    <div className="itinerary-container">

      {/* 🔙 Back Button */}
      <button className="itinerary-back-btn" onClick={onBack}>
        <FiArrowLeft /> Back
      </button>

      {/* 🏔 Header Block */}
      <div className="itinerary-title-block">
        <h1 className="itinerary-title">{itinerary.tripTitle}</h1>
        <p className="itinerary-sub">{itinerary.summary}</p>

        {/* Chips */}
        <div className="itinerary-chips">
          <div className="chip">💰 {itinerary.totalEstimatedCost || "—"}</div>

          <div className="chip">
            <FiCalendar /> {itinerary.days?.length || itinerary.duration} Days
          </div>

          <div className="chip crowd">
            🧍 {itinerary.crowdLevel || "Medium"}
          </div>

          <div className="chip season">🟢 Oct–Mar (Best Season)</div>
        </div>

        {/* Weather Sample */}
        <div className="weather-alert">
          <strong>⚠ WEATHER ALERT</strong>
          <p>Warm & Pleasant (25–32°C)</p>
        </div>
      </div>

      {/* 📅 Day Cards */}
      <div className="itinerary-days-list">
        {itinerary.days?.map((day, idx) => (
          <div className="day-card" key={idx}>
            
            {/* Header */}
            <div className="day-header" onClick={() => toggleDay(idx)}>
              <div className="day-header-left">
                <FiCalendar className="day-icon" />
                <div>
                  <div className="day-title">
                    Day {day.day || idx + 1} — {day.date}
                  </div>
                  {day.theme && <div className="day-subtitle">{day.theme}</div>}
                </div>
              </div>

              {/* Arrow */}
              <div>{openDay === idx ? <FiChevronUp /> : <FiChevronDown />}</div>
            </div>

            {/* Collapse */}
            {openDay === idx && (
              <div className="day-body">
                
                {day.activities?.map((a, i) => (
                  <div className="activity" key={i}>
                    <div className="act-time">{a.time}</div>

                    <div className="act-content">
                      <strong className="act-title">
                        {a.activity || a.description}
                      </strong>

                      {/* Google Maps Link */}
                      {a.mapsLink && (
                        <a
                          className="maps-link"
                          href={a.mapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📍 Open in Google Maps
                        </a>
                      )}

                      {/* Location */}
                      {a.location && <p className="act-location">📍 {a.location}</p>}

                      {/* Description */}
                      {a.description && <p className="act-desc">{a.description}</p>}

                      {/* Meta */}
                      <div className="act-meta">
                        {a.duration && <span>⏱ {a.duration}</span>}
                        {a.estimatedCost && <span>💰 {a.estimatedCost}</span>}
                      </div>

                      {/* Notes */}
                      {a.notes && <p className="act-notes">📝 {a.notes}</p>}
                    </div>
                  </div>
                ))}

                {/* Daily Cost */}
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

      {/* BUTTONS */}
      <div className="itinerary-actions">

        <button className="btn-primary" onClick={downloadPDF}>
          <FiDownload /> Download PDF
        </button>

        <button className="btn-secondary" onClick={shareItinerary}>
          <FiShare2 /> Share
        </button>

        <button className="btn-start-trip" onClick={startTrip}>
          🚀 Start Trip
        </button>

      </div>
    </div>
  );
}
