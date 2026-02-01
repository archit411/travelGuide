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

export default function ItineraryView({ itinerary, onBack, onRegenerate }) {
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

    // Clear previous visited states
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("visited_day_")) {
        localStorage.removeItem(key);
      }
    });

    // direct redirect → no popup
    window.location.href = "/homepage";
  };

  // --------------------------
  // PDF EXPORT
  // --------------------------
  // --------------------------
  // PDF EXPORT
  // --------------------------
  const downloadPDF = () => {
    const doc = new jsPDF();

    // -- HEADER --
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text(itinerary.tripTitle || "Your Trip Itinerary", 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    const summaryLines = doc.splitTextToSize(itinerary.summary || "", 180);
    doc.text(summaryLines, 14, 30);

    let lastY = 30 + (summaryLines.length * 5) + 10;

    // -- COST SUMMARY --
    doc.setFillColor(240, 247, 255);
    doc.roundedRect(14, lastY, 180, 20, 3, 3, 'F');

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Cost: ${itinerary.totalEstimatedCost || "N/A"}`, 20, lastY + 13);
    doc.text(`Duration: ${itinerary.duration || itinerary.days?.length} Days`, 100, lastY + 13);

    lastY += 35;

    // -- DAYS TABLE --
    itinerary?.days?.forEach((day, index) => {
      // Check page break
      if (lastY > 250) {
        doc.addPage();
        lastY = 20;
      }

      // Day Header
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246); // Primary Blue
      doc.text(`Day ${index + 1}: ${day.theme || "Adventure"}`, 14, lastY);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(day.date || "", 14, lastY + 6);

      lastY += 12;

      // Table for Activities
      const tableBody = day.activities?.map((a) => [
        a.time || "-",
        a.activity || a.description || "Activity",
        a.location || "-",
        a.duration || "-",
        a.estimatedCost || "-"
      ]);

      autoTable(doc, {
        startY: lastY,
        head: [["Time", "Activity", "Location", "Duration", "Cost"]],
        body: tableBody,
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246], textColor: 255 },
        styles: { fontSize: 9, cellPadding: 4 },
        columnStyles: {
          0: { cellWidth: 20 }, // Time
          1: { cellWidth: 70 }, // Activity
          2: { cellWidth: 40 }, // Location
          3: { cellWidth: 25 }, // Duration
          4: { cellWidth: 25 }, // Cost
        },
        margin: { top: 20, bottom: 20 },
        didDrawPage: (data) => {
          // If table breaks across pages, we need to update our external tracker?
          // autoTable handles page breaks automatically, but we need to know where it ended.
        }
      });

      // Update Y for next day using the final Y of the table
      lastY = doc.lastAutoTable.finalY + 15;
    });

    // Save
    const filename = (itinerary.tripTitle || "trip").toLowerCase().replace(/\s+/g, "_") + ".pdf";
    doc.save(filename);
  };

  const shareItinerary = () => {
    let text = `🌍 ${itinerary.tripTitle || "My Trip"}\n\n`;
    text += `${itinerary.summary}\n\n`;
    text += `💰 Cost: ${itinerary.totalEstimatedCost} | 🗓 Days: ${itinerary.days?.length}\n`;
    text += `--------------------------\n`;

    itinerary?.days?.forEach((day, index) => {
      text += `\n📅 Day ${index + 1}: ${day.theme || "Adventure"} (${day.date || ""})\n`;

      day.activities?.forEach((a) => {
        text += `• ${a.time || ""}: ${a.activity} @ ${a.location || ""}\n`;
      });
    });

    text += `\n✨ Planned with TravelGuide`;

    if (navigator.share) {
      navigator.share({
        title: itinerary.tripTitle,
        text: text
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for desktop/unsupported
      navigator.clipboard.writeText(text).then(() => {
        alert("Itinerary copied to clipboard!");
      });
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
        {onRegenerate && (
          <button className="btn-secondary" onClick={onRegenerate} style={{ marginRight: 'auto' }}>
            ✏️ Edit & Regenerate
          </button>
        )}

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
