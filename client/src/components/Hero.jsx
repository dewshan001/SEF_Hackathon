import { useEffect, useRef, useState } from 'react';
import './Hero.css';

const STATS = [
  { value: '50K+',  label: 'Happy Customers', i: 0 },
  { value: '120+',  label: 'Wholesale Stores', i: 1 },
  { value: '4.9★',  label: 'App Rating',       i: 2 },
  { value: '30min', label: 'Avg. Delivery',     i: 3 },
];

export default function Hero({ onNavigate }) {
  const [mouse, setMouse]   = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const onMouse = (e) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMouse({
        x: ((e.clientX - rect.left)  / rect.width  - .5) * 2,
        y: ((e.clientY - rect.top)   / rect.height - .5) * 2,
      });
    };
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('scroll',   onScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll',   onScroll);
    };
  }, []);

  const cylStyle = {
    transform: `translate(${mouse.x * 10}px, ${mouse.y * 7}px) rotateY(${mouse.x * 6}deg) rotateX(${-mouse.y * 4}deg)`,
  };

  return (
    <section
      className="hero-section"
      ref={heroRef}
      id="hero"
      aria-label="Hero"
      style={{ opacity: Math.max(0, 1 - scrollY / 500) }}
    >
      {/* Background */}
      <div className="orbs-container" aria-hidden="true">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </div>
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-inner container">
        {/* ── Text ── */}
        <div className="hero-text">
          <div className="section-label">
            <span className="dot" />
            Sri Lanka's #1 Gas Booking Platform
          </div>

          <h1 className="hero-title">
            Book Your{' '}
            <span className="gradient-text">Gas Cylinder</span>
            <br />Instantly Online
          </h1>

          <p className="hero-subtitle">
            Skip the queues. Connect directly with certified wholesale stores near you
            and get your LP gas cylinder delivered fast — safe, transparent, and hassle-free.
          </p>

          <div className="hero-actions">
            <a href="#book" className="btn-primary" id="hero-book-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Book a Cylinder
            </a>
            <a href="#how-it-works" className="btn-secondary" id="hero-learn-btn">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
              </svg>
              See How It Works
            </a>
            <button
              onClick={() => onNavigate ? onNavigate('feedback') : (window.location.hash = 'feedback')}
              className="btn-feedback"
              id="hero-feedback-btn"
              aria-label="Share Feedback"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Share Feedback
            </button>
          </div>

          <div className="trust-badges">
            {[
              'Govt. Certified Stores',
              'Secure Payments',
              'Real-time Tracking',
            ].map(t => (
              <div key={t} className="trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* ── Visual ── */}
        <div className="hero-visual" aria-hidden="true">
          <div className="cylinder-stage" style={cylStyle}>
            <div className="cylinder-glow" />

            <svg className="cylinder-svg" viewBox="0 0 200 340" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GasGo Lanka LP gas cylinder">
              {/* Handle */}
              <rect x="86" y="0"  width="28" height="12" rx="6"  fill="url(#h1)"/>
              {/* Valve cap */}
              <rect x="80" y="10" width="40" height="20" rx="10" fill="url(#h2)"/>
              {/* Neck */}
              <rect x="68" y="28" width="64" height="28" rx="18" fill="url(#neck)"/>
              {/* Body */}
              <rect x="30" y="52" width="140" height="220" rx="64" fill="url(#body)"/>
              {/* Shine */}
              <rect x="46" y="66" width="42" height="160" rx="21" fill="url(#shine)" opacity=".3"/>
              {/* Band */}
              <rect x="30" y="158" width="140" height="56" fill="url(#band)"/>
              {/* Text */}
              <text x="100" y="192" textAnchor="middle" fill="#fff"  fontSize="20" fontFamily="Outfit,sans-serif" fontWeight="800" letterSpacing="-0.5">GasGo</text>
              <text x="100" y="210" textAnchor="middle" fill="rgba(255,255,255,.6)" fontSize="12" fontFamily="Inter,sans-serif">Lanka</text>
              {/* Bottom dome */}
              <ellipse cx="100" cy="272" rx="70" ry="24" fill="url(#bot)"/>
              {/* Base */}
              <rect x="50"  y="286" width="100" height="22" rx="11" fill="url(#base)"/>
              <ellipse cx="100" cy="308" rx="50" ry="9" fill="url(#base)"/>

              <defs>
                <linearGradient id="h1"    x1="86"  y1="0"   x2="114" y2="12"  gradientUnits="userSpaceOnUse"><stop stopColor="#BDBDBD"/><stop offset="1" stopColor="#757575"/></linearGradient>
                <linearGradient id="h2"    x1="80"  y1="10"  x2="120" y2="30"  gradientUnits="userSpaceOnUse"><stop stopColor="#E0E0E0"/><stop offset="1" stopColor="#9E9E9E"/></linearGradient>
                <linearGradient id="neck"  x1="68"  y1="28"  x2="132" y2="56"  gradientUnits="userSpaceOnUse"><stop stopColor="#F9CC1B"/><stop offset="1" stopColor="#F5A623"/></linearGradient>
                <linearGradient id="body"  x1="30"  y1="52"  x2="170" y2="272" gradientUnits="userSpaceOnUse"><stop stopColor="#F2752E"/><stop offset=".5" stopColor="#E85D1A"/><stop offset="1" stopColor="#C0392B"/></linearGradient>
                <linearGradient id="shine" x1="46"  y1="66"  x2="88"  y2="226" gradientUnits="userSpaceOnUse"><stop stopColor="white" stopOpacity=".7"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient>
                <linearGradient id="band"  x1="30"  y1="158" x2="170" y2="214" gradientUnits="userSpaceOnUse"><stop stopColor="#A93226"/><stop offset="1" stopColor="#922B21"/></linearGradient>
                <linearGradient id="bot"   x1="30"  y1="248" x2="170" y2="296" gradientUnits="userSpaceOnUse"><stop stopColor="#E85D1A"/><stop offset="1" stopColor="#C0392B"/></linearGradient>
                <linearGradient id="base"  x1="50"  y1="286" x2="150" y2="316" gradientUnits="userSpaceOnUse"><stop stopColor="#424242"/><stop offset="1" stopColor="#212121"/></linearGradient>
              </defs>
            </svg>

            {/* Floating badges */}
            <div className="float-badge badge-tl">
              <span className="badge-icon">⚡</span>
              <div>
                <div className="badge-value">30 min</div>
                <div className="badge-sub">Avg. Delivery</div>
              </div>
            </div>
            <div className="float-badge badge-tr">
              <span className="badge-icon">🛡️</span>
              <div>
                <div className="badge-value">100%</div>
                <div className="badge-sub">Certified Safe</div>
              </div>
            </div>
            <div className="float-badge badge-bc">
              <span className="badge-icon">📍</span>
              <div>
                <div className="badge-value">Live Tracking</div>
                <div className="badge-sub">Real-time Updates</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="stats-bar container" role="list" aria-label="Key statistics">
        {STATS.map(s => (
          <div key={s.value} className="stat-item" role="listitem" style={{ '--i': s.i }}>
            <div className="stat-value gradient-text">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Scroll hint ── */}
      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-mouse"><div className="scroll-wheel" /></div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
}
