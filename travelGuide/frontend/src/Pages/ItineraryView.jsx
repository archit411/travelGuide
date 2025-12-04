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
  // ----------- SAFETY -----------------
  if (!itinerary) return <div className="itn-empty">No itinerary found.</div>;

  const [openDay, setOpenDay] = useState(null);
  const [weather, setWeather] = useState(null);

  const toggleDay = (i) => setOpenDay(openDay === i ? null : i);

  // --------------------------
  // 🌦 WEATHER FETCH
  // --------------------------
  useEffect(() => {
    if (!itinerary?.destination) return;

    const fetchWeather = async () => {
      try {
        const resp = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            itinerary.destination
          )}&units=metric&appid=YOUR_OPENWEATHER_API_KEY`
        );

        const data = await resp.json();
        if (!data?.main) return;

        setWeather({
          temp: data.main.temp,
          feels: data.main.feels_like,
          desc: data.weather?.[0]?.description,
          icon: data.weather?.[0]?.icon,
        });
      } catch (e) {
        console.log("Weather Error:", e);
      }
    };

    fetchWeather();
  }, [itinerary?.destination]);

  // --------------------------
  // 🚀 AUTO START → REDIRECT
  // --------------------------
  const startTrip = () => {
    const tripData = {
      ...itinerary,
      currentDayIndex: 0,
      completed: {},
    };

    localStorage.setItem("activeTrip", JSON.stringify(tripData));
    localStorage.setItem("currentDayIndex", "0");

    // direct redirect → no popup
    window.location.href = "/homepage";
  };

  // --------------------------
  // PDF EXPORT
  // --------------------------
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(itinerary.tripTitle || "Trip Itinerary", 14, 16);

    itinerary?.days?.forEach((day, index) => {
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

  const shareItinerary = () => {
    const text = `${itinerary.tripTitle}\n${itinerary.summary}`;

    if (navigator.share) {
      navigator.share({ title: itinerary.tripTitle, text });
    } else {
      alert(text);
    }
  };

  return (
    <div className="itn-wrapper">

      {/* BACK BTN */}
      <button className="itn-back" onClick={onBack}>
        <FiArrowLeft /> Back
      </button>

      {/* TITLE BLOCK */}
      <div className="itn-header">
        <h1>{itinerary.tripTitle}</h1>
        <p className="itn-sub">{itinerary.summary}</p>

        {/* WEATHER */}
        {weather && (
          <div className="itn-weather">
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              className="itn-weather-icon"
            />
            <div>
              <strong>{weather.temp}°C</strong> • {weather.desc}
              <div className="itn-feels">Feels like {weather.feels}°C</div>
            </div>
          </div>
        )}

        {/* CHIPS */}
        <div className="itn-chips">
          <div className="chip">💰 {itinerary.totalEstimatedCost || "N/A"}</div>
          <div className="chip">
            <FiCalendar /> {itinerary.days?.length} Days
          </div>
          <div className="chip crowd">🧍 {itinerary.crowdLevel}</div>
        </div>
      </div>

      {/* DAYS LIST */}
      <div className="itn-days">
        {itinerary?.days?.map((day, idx) => (
          <div className="itn-day-card" key={idx}>
            <div className="itn-day-header" onClick={() => toggleDay(idx)}>
              <div className="itn-dh-left">
                <FiCalendar className="day-icon" />
                <div>
                  <div className="itn-day-title">
                    Day {idx + 1} — {day.date}
                  </div>
                  <div className="itn-day-sub">{day.theme}</div>
                </div>
              </div>

              {openDay === idx ? <FiChevronUp /> : <FiChevronDown />}
            </div>

            {openDay === idx && (
              <div className="itn-day-body">
                {day.activities?.map((a, i) => (
                  <div key={i} className="itn-activity">
                    <div className="itn-time">{a.time}</div>

                    <div className="itn-act-content">
                      <strong>{a.activity}</strong>

                      <p className="itn-location">📍 {a.location}</p>

                      {a.mapsLink && (
                        <a href={a.mapsLink} target="_blank" className="itn-map">
                          Open in Google Maps
                        </a>
                      )}

                      <p className="itn-desc">{a.description}</p>

                      <div className="itn-meta">
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

      {/* ACTION BUTTONS */}
      <div className="itn-actions">
        <button className="btn-primary" onClick={downloadPDF}>
          <FiDownload /> PDF
        </button>

        <button className="btn-secondary" onClick={shareItinerary}>
          <FiShare2 /> Share
        </button>

        <button className="btn-start" onClick={startTrip}>
          🚀 Start Trip
        </button>
      </div>
    </div>
  );
}
