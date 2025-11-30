import React, { useState, useEffect } from "react";
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
  const [weather, setWeather] = useState(null);

  const toggleDay = (i) => setOpenDay(openDay === i ? null : i);

  // --------------------------
  // 🌦 REAL WEATHER FETCH
  // --------------------------
  useEffect(() => {
    if (!itinerary.destination) return;

    const fetchWeather = async () => {
      try {
        const resp = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            itinerary.destination
          )}&units=metric&appid=YOUR_OPENWEATHER_API_KEY`
        );

        const data = await resp.json();

        if (data.main) {
          setWeather({
            temp: data.main.temp,
            feels: data.main.feels_like,
            desc: data.weather[0].description,
            icon: data.weather[0].icon,
          });
        }
      } catch (e) {
        console.log("Weather Error:", e);
      }
    };

    fetchWeather();
  }, [itinerary.destination]);

  // --------------------------
  // PDF GENERATION
  // --------------------------
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(itinerary.tripTitle || "Trip Itinerary", 14, 16);

    itinerary.days?.forEach((day, index) => {
      const startY = 30 + index * 70;
      doc.setFontSize(14);
      doc.text(`Day ${index + 1} — ${day.theme || ""}`, 14, startY);

      autoTable(doc, {
        startY: startY + 5,
        head: [["Time", "Activity", "Location", "Duration", "Cost"]],
        body: day.activities?.map((a) => [
          a.time || "",
          a.activity || a.description || "",
          a.location || "",
          a.duration || "",
          a.estimatedCost || "",
        ]),
        theme: "grid",
        styles: { fontSize: 9 },
      });
    });

    doc.save(`${itinerary.tripTitle}.pdf`);
  };

  // --------------------------
  // 🚀 START TRIP
  // --------------------------
  const startTrip = () => {
    const tripData = {
      ...itinerary,
      currentDayIndex: 0,
      completed: {},
    };

    localStorage.setItem("activeTrip", JSON.stringify(tripData));
    localStorage.setItem("currentDayIndex", "0");

    alert("Trip Started! Go to Home Page to continue.");
  };

  // --------------------------
  // 📤 SHARE — FIXED FUNCTION
  // --------------------------
  const shareItinerary = () => {
    const text = `${itinerary.tripTitle}\n${itinerary.summary}`;

    if (navigator.share) {
      navigator.share({
        title: itinerary.tripTitle,
        text,
      });
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

      {/* Header */}
      <div className="itinerary-title-block">
        <h1 className="itinerary-title">{itinerary.tripTitle}</h1>
        <p className="itinerary-sub">{itinerary.summary}</p>

        {/* 🌦 LIVE WEATHER */}
        {weather && (
          <div className="weather-live">
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt="weather"
              className="weather-icon"
            />
            <div>
              <strong>{weather.temp}°C</strong> • {weather.desc}
              <div className="feels-like">Feels like {weather.feels}°C</div>
            </div>
          </div>
        )}

        {/* Chips */}
        <div className="itinerary-chips">
          <div className="chip">💰 {itinerary.totalEstimatedCost || "—"}</div>

          <div className="chip">
            <FiCalendar /> {itinerary.days?.length} Days
          </div>

          <div className="chip crowd">🧍 {itinerary.crowdLevel}</div>
        </div>
      </div>

      {/* Day Cards */}
      <div className="itinerary-days-list">
        {itinerary.days?.map((day, idx) => (
          <div className="day-card" key={idx}>
            <div className="day-header" onClick={() => toggleDay(idx)}>
              <div className="day-header-left">
                <FiCalendar className="day-icon" />
                <div>
                  <div className="day-title">
                    Day {idx + 1} — {day.date}
                  </div>
                  {day.theme && (
                    <div className="day-subtitle">{day.theme}</div>
                  )}
                </div>
              </div>

              {openDay === idx ? <FiChevronUp /> : <FiChevronDown />}
            </div>

            {openDay === idx && (
              <div className="day-body">
                {day.activities?.map((a, i) => (
                  <div className="activity" key={i}>
                    <div className="act-time">{a.time}</div>

                    <div className="act-content">
                      <strong className="act-title">
                        {a.activity || a.description}
                      </strong>

                      {a.location && (
                        <p className="act-location">📍 {a.location}</p>
                      )}

                      {a.mapsLink && (
                        <a
                          href={a.mapsLink}
                          target="_blank"
                          className="maps-link"
                        >
                          Open in Google Maps
                        </a>
                      )}

                      {a.description && (
                        <p className="act-desc">{a.description}</p>
                      )}

                      <div className="act-meta">
                        {a.duration && <span>⏱ {a.duration}</span>}
                        {a.estimatedCost && <span>💰 {a.estimatedCost}</span>}
                      </div>
                    </div>
                  </div>
                ))}
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
