import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useIsMobile from "../isMobile";
import "./Onboarding.css";

const slides = [
  {
    id: "discover",
    title: "Discover",
    desc: "Find inspiring places, curated trips, and hidden gems.",
    img: "/discover.avif",
  },
  {
    id: "plan",
    title: "Plan",
    desc: "Organize routes, book stays, and customize itineraries with ease.",
    img: "/plan.avif",
  },
  {
    id: "go",
    title: "Go",
    desc: "Get live updates and seamless navigation while traveling.",
    img: "/go.avif",
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const isMobile = useIsMobile(768);
  const [index, setIndex] = useState(0);
  const [fly, setFly] = useState(false);
  const startX = useRef(null);

  useEffect(() => {
    if (!isMobile) navigate("/login", { replace: true });
  }, [isMobile, navigate]);

  function skip() {
    navigate("/login");
  }

  function goNext() {
    if (index < slides.length - 1) {
      setIndex((i) => i + 1);
    } else {
      // Start airplane flying animation
      setFly(true);

      // Delay navigation to match animation
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    }
  }

  // ===== SWIPE HANDLERS =====
  function onTouchStart(e) {
    startX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX.current;
    if (diff < -40 && index < slides.length - 1) setIndex(index + 1);
    if (diff > 40 && index > 0) setIndex(index - 1);
  }

  return (
    <div
      className="onboarding-wrapper"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="slides"
        style={{ transform: `translateX(${-index * 100}vw)` }}
      >
        {slides.map((s) => (
          <section className="slide" key={s.id}>
            <img src={s.img} alt={s.title} className="slide-img" />
            <h2 className="slide-title">{s.title}</h2>
            <p className="slide-desc">{s.desc}</p>
          </section>
        ))}
      </div>

      {/* Footer */}
      <div className="onboarding-footer">
        <button className="btn-text skip-btn" onClick={skip}>
          Skip
        </button>

      

        <button className="btn-primary continue-btn" onClick={goNext}>
          {index === slides.length - 1 ? "Get Started" : "Continue"}
        </button>
      </div>
    </div>
  );
}
