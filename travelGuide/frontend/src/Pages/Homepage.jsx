import { useState, useMemo } from 'react';
import {
  FiPlus,
  FiSearch,
  FiHeart,
  FiThermometer,
  FiHome,
  FiBookmark,
  FiUser
} from 'react-icons/fi';
import { FaUtensils } from 'react-icons/fa';
import './home.css';

/* ---------- Reusable Component ---------- */
function StatPill({ icon, text, tone = 'dark' }) {
  return (
    <span className={`stat-pill ${tone}`}>
      {icon && <span className="icon">{icon}</span>}
      {text}
    </span>
  );
}

function DestinationCard({ img, temp, likes, title, subtitle }) {
  return (
    <article
      className="highlight-card"
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="overlay" />
      <div className="card-bottom">
        <div className="left">
          <StatPill icon={<FiThermometer />} text={`${temp}ºC`} />
          <div className="title">{title}</div>
          <div className="subtitle">{subtitle}</div>
        </div>
        <div className="right">
          <div className="likes">
            <FiHeart /> {likes}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ---------- Main Page ---------- */
export default function TripPulse() {
  const [active, setActive] = useState('home');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedState, setSelectedState] = useState('All');

  const month = new Date().getMonth();
  const season =
    month >= 2 && month <= 5
      ? 'Summer'
      : month >= 6 && month <= 9
      ? 'Monsoon'
      : 'Winter';

  const destinations = [
    {
      country: 'India',
      region: 'Himachal Pradesh',
      title: 'Manali – Solang Valley',
      subtitle: 'Paragliding • Snow Peaks',
      season: 'Summer',
      temp: 12,
      likes: 154,
      img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1470&auto=format&fit=crop'
    },
    {
      country: 'India',
      region: 'Goa',
      title: 'Goa – Baga Beach',
      subtitle: 'Sunset cafes • Nightlife',
      season: 'Winter',
      temp: 30,
      likes: 220,
      img: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?q=80&w=1470&auto=format&fit=crop'
    },
    {
      country: 'India',
      region: 'Kerala',
      title: 'Munnar – Tea Gardens',
      subtitle: 'Misty hills • Green trails',
      season: 'Monsoon',
      temp: 22,
      likes: 141,
      img: 'https://images.unsplash.com/photo-1521207418485-99c705420785?q=80&w=1470&auto=format&fit=crop'
    },
    {
      country: 'India',
      region: 'Rajasthan',
      title: 'Jaisalmer – Sand Dunes',
      subtitle: 'Camel rides • Desert camps',
      season: 'Winter',
      temp: 25,
      likes: 178,
      img: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1470&q=80'
    },
    {
      country: 'India',
      region: 'Karnataka',
      title: 'Coorg – Abbey Falls',
      subtitle: 'Coffee estates • Waterfalls',
      season: 'Monsoon',
      temp: 24,
      likes: 134,
      img: 'https://images.unsplash.com/photo-1603901070406-786d7c5c1e73?q=80&w=1470&auto=format&fit=crop'
    },
    {
      country: 'Thailand',
      region: 'Krabi',
      title: 'Krabi – Railay Beach',
      subtitle: 'Limestone cliffs • Clear waters',
      season: 'Winter',
      temp: 32,
      likes: 210,
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1470&auto=format&fit=crop'
    },
    {
      country: 'Thailand',
      region: 'Chiang Mai',
      title: 'Chiang Mai – Old City',
      subtitle: 'Temples • Culture • Cafes',
      season: 'Winter',
      temp: 24,
      likes: 180,
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1470&auto=format&fit=crop'
    },
    {
      country: 'Thailand',
      region: 'Phuket',
      title: 'Phuket – Kata Beach',
      subtitle: 'Surfing • Night Markets',
      season: 'Summer',
      temp: 31,
      likes: 165,
      img: 'https://images.unsplash.com/photo-1601918774946-258bf50b6c4e?q=80&w=1470&auto=format&fit=crop'
    }
  ];

  const countryOptions = ['All', 'India', 'Thailand'];
  const statesByCountry = {
    All: ['All'],
    India: ['All', 'Himachal Pradesh', 'Goa', 'Kerala', 'Rajasthan', 'Karnataka'],
    Thailand: ['All', 'Krabi', 'Chiang Mai', 'Phuket']
  };

  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) => {
      const matchCountry =
        selectedCountry === 'All' || d.country === selectedCountry;
      const matchState = selectedState === 'All' || d.region === selectedState;
      const matchSeason = d.season === season;
      return matchCountry && matchState && matchSeason;
    });
  }, [selectedCountry, selectedState, season]);

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setSelectedState('All');
  };

  return (
    <div className="app-shell">
      {/* ---------- Top Bar ---------- */}
      <header className="topbar">
        <div className="brand">
          <div className="logo-globe">🌍</div>
          <div className="brand-meta">
            <div className="brand-name">TripPulse</div>
            <div className="brand-sub">Discover • Plan • Go</div>
          </div>
        </div>
        <button className="add-update">
          <FiPlus /> Add Update
        </button>
      </header>

      {/* ---------- Search Bar ---------- */}
      <div className="search-wrap">
        <div className="searchbar">
          <FiSearch />
          <input placeholder="Search destinations..." />
        </div>
      </div>

      {/* ---------- Seasonal Picks Section ---------- */}
      <section className="section">
        <div className="section-head seasonal-head">
          <h3>{season} Picks</h3>
          <div className="filter-group">
            <select
              className="filter-select"
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
            >
              {countryOptions.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              {statesByCountry[selectedCountry].map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredDestinations.length > 0 ? (
          <div className="cards-row">
            {filteredDestinations.map((d, i) => (
              <DestinationCard key={i} {...d} />
            ))}
          </div>
        ) : (
          <p className="empty-msg">
            No destinations found for {selectedCountry} - {selectedState} this {season}.
          </p>
        )}
      </section>

      {/* ---------- Travel Footer Section ---------- */}
      <section className="travel-footer" />

      {/* ---------- Bottom Nav ---------- */}
      <div className="bottom-nav-wrap">
        <nav className="bottom-nav">
          <button className={active === 'home' ? 'active' : ''} onClick={() => setActive('home')}>
            <FiHome />
            <span>Home</span>
          </button>
          <button className={active === 'food' ? 'active' : ''} onClick={() => setActive('food')}>
            <FaUtensils />
            <span>Food</span>
          </button>
          <button className={active === 'saved' ? 'active' : ''} onClick={() => setActive('saved')}>
            <FiBookmark />
            <span>Saved</span>
          </button>
          <button className={active === 'profile' ? 'active' : ''} onClick={() => setActive('profile')}>
            <FiUser />
            <span>Profile</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
