import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../lottie/loadingAnimation.json"; // ✅ Correct import

import "./ProcessingAnimation.css";

export default function ProcessingAnimation({ message = "Creating your trip...", onDone = () => {} }) {
  const messages = [
    "Creating your perfect trip…",
    "Finding best places for you…",
    "Optimizing travel routes…",
    "Checking weather and local trends…",
    "Almost ready…",  // shown at the end
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Change message every 1 second
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      if (index < messages.length) {
        setMessageIndex(index);
      }
    }, 1000);

    // Finish animation after 4.5 seconds
    const timer = setTimeout(() => {
      clearInterval(interval);
      onDone();
    }, 4500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="ai-process-overlay">
      <div className="ai-process-box">

        <Lottie
          animationData={loadingAnimation}
          loop={true}
          className="ai-lottie"
        />

        <p className="ai-process-text">{messages[messageIndex]}</p>

      </div>
    </div>
  );
}
