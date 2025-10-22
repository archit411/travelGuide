import { useMemo, useState } from "react";
import './home.css'
type Place = {
  name: string;
  city: string;
  image: string;
};

const ALL_PLACES: Place[] = [
  {
    name: "Gateway of India",
    city: "Mumbai",
    image:
      "https://images.pexels.com/photos/618079/pexels-photo-618079.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Taj Mahal",
    city: "Agra",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Amer Fort",
    city: "Jaipur",
    image:
      "https://images.pexels.com/photos/1589827/pexels-photo-1589827.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Red Fort",
    city: "Delhi",
    image:
      "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Hawa Mahal",
    city: "Jaipur",
    image:
      "https://images.pexels.com/photos/3014980/pexels-photo-3014980.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];
export default function App() {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState(["gateway of india", "taj mahal"]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return ALL_PLACES;
    return ALL_PLACES.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="page">
      {/* Header */}
      <header className="topbar">
        <h1 className="brand">Travel Explorer</h1>
        <div className="avatar" title="Profile">👤</div>
      </header>

      <main className="container">
        {/* Welcome Section */}
        <section className="hero">
          <h2>Welcome</h2>
          <p className="location">📍 Mumbai, India</p>

          {/* Search */}
          <div className="search">
            <input
              type="text"
              placeholder="Search destinations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Recent Searches */}
          <div className="recent">
            <h3>Recent Searches</h3>
            <div className="chips">
              {recent.map((r) => (
                <button key={r} onClick={() => setQuery(r)} className="chip">
                  {r}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Places */}
        <section className="places">
          <h3>Featured Places</h3>
          <div className="grid">
            {filtered.map((p) => (
              <div key={p.name} className="card">
                <img src={p.image} alt={p.name} />
                <div className="overlay">
                  <p className="place-name">{p.name}</p>
                  <p className="place-city">{p.city}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Promo Section */}
        <section className="promo">
          <img
            src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1600&auto=format&fit=crop"
            alt="Travel Across India"
          />
          <div className="promo-overlay">
            <h2>Travel Across <span>India</span></h2>
            <p>#explore #travel</p>
            <button>Start Exploring</button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <span>🇮🇳 Made in India</span>
        <span>•</span>
        <span>Crafted in Mumbai</span>
      </footer>
    </div>
  );
}