import React, { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import "./StoryViewer.css";

export default function StoryViewer({ stories, index: startIndex = 0, onClose }) {
    const [index, setIndex] = useState(startIndex);
    const [progress, setProgress] = useState(
        stories.map((_, i) => (i < startIndex ? 100 : 0))
    );
    const [loaded, setLoaded] = useState(false);
    const timerRef = useRef(null);
    const duration = 15000;

    useEffect(() => {
        const preventScroll = (e) => e.preventDefault();
        const scrollY = window.scrollY;

        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.overflow = "hidden";
        document.body.style.width = "100%";

        document.addEventListener("touchmove", preventScroll, { passive: false });

        return () => {
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.overflow = "";
            document.body.style.width = "";

            document.removeEventListener("touchmove", preventScroll);

            window.scrollTo(0, scrollY);
        };
    }, []);

    useEffect(() => {
        if (!stories || !stories.length) return;
        const currentStory = stories[index];
        if (!currentStory) return;

        setLoaded(false);
        setProgress((p) =>
            p.map((_, i) => (i < index ? 100 : i === index ? 0 : 0))
        );

        if (timerRef.current) clearInterval(timerRef.current);

        const img = new Image();
        // Handle both 'image' and 'imageUrl' properties for compatibility
        const imgSrc = currentStory.image || currentStory.imageUrl;

        // If no image source, treat as loaded immediately (or handle error)
        if (!imgSrc) {
            setLoaded(true);
            startTimer();
            return;
        }

        img.src = imgSrc;

        img.onload = () => {
            setLoaded(true);
            startTimer();
        };

        function startTimer() {
            const start = Date.now();
            timerRef.current = setInterval(() => {
                const elapsed = Date.now() - start;
                const pct = Math.min((elapsed / duration) * 100, 100);

                setProgress((prev) =>
                    prev.map((val, i) => (i === index ? pct : val))
                );

                if (pct >= 100) {
                    clearInterval(timerRef.current);
                    if (index < stories.length - 1) setIndex((i) => i + 1);
                    else onClose();
                }
            }, 100);
        }

        // Handle error case for image loading if needed, though simpler to just let it hang or close
        img.onerror = () => {
            console.error("Failed to load story image:", imgSrc);
            // Maybe auto-advance or close? For now, we'll just stop.
            // setLoaded(true); // show broken image
        };

        return () => clearInterval(timerRef.current);
    }, [index, stories]);

    function handleTap(e) {
        const x = e.clientX;
        const w = window.innerWidth;

        clearInterval(timerRef.current);

        if (x < w / 3) setIndex((i) => Math.max(0, i - 1));
        else if (x > (w * 2) / 3) setIndex((i) => Math.min(stories.length - 1, i + 1));
    }

    if (!stories || !stories.length) return null;

    const current = stories[index];
    if (!current) return null; // Safety check

    const currentImg = current.image || current.imageUrl;

    return (
        <div className="story-viewer-overlay" onClick={onClose}>
            <div className="story-viewer-card" onClick={(e) => e.stopPropagation()}>
                <button className="story-close-btn" onClick={onClose}>
                    <FiX size={18} />
                </button>

                <div className={`story-crowd-badge ${current.crowdStatus?.toLowerCase() || 'medium'}`}>
                    👥 {current.crowdStatus || 'Medium'}
                </div>

                <div className="multi-progress">
                    {stories.map((_, i) => (
                        <div key={i} className="progress-track">
                            <div
                                className={`progress-filled ${i < index ? "done" : ""}`}
                                style={{ width: `${progress[i] || 0}%` }}
                            />
                        </div>
                    ))}
                </div>

                <div className="story-image-wrapper" onClick={handleTap}>
                    <img
                        className={`story-viewer-image ${loaded ? "loaded" : ""}`}
                        src={currentImg}
                        alt={current.destination || "Story"}
                    />

                    <div className="story-info-overlay">
                        <h3>📍 {current.destination || "Unknown Location"}</h3>
                        {current.caption && (
                            <p className="story-caption">{current.caption}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
