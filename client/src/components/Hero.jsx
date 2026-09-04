import './Hero.css';
import GasCylinder3D from './GasCylinder3D';

const STATS = [
  { value: '50K+',  label: 'Active Users',      i: 0 },
  { value: '120+',  label: 'Wholesale Stores',  i: 1 },
  { value: '4.9★',  label: 'User Rating',       i: 2 },
  { value: '25+',   label: 'Districts Covered', i: 3 },
];

export default function Hero({ onNavigate }) {
  return (
    <section
      className="hero-section"
      id="hero"
      aria-label="Hero"
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
            Smart LP Gas Platform
          </div>

          <h1 className="hero-title">
            Find Your <span className="gradient-text">Gas From Us</span>
            <br />& Save Your <span className="gradient-text">Time</span>
          </h1>

          <p className="hero-subtitle">
            Skip the endless queues and uncertainty. Check live cylinder stock across certified wholesale stores near you in seconds.
          </p>

          <div className="hero-actions">
            <button
              onClick={() => onNavigate && onNavigate('stores')}
              className="btn-primary"
              id="hero-stores-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              Find Stores
            </button>
            <button
              onClick={() => onNavigate && onNavigate('about')}
              className="btn-secondary"
              id="hero-about-btn"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              About Us
            </button>
          </div>

          <div className="trust-badges">
            {[
              'Govt. Certified Stores',
              'Real-Time Inventory',
              'Live Stock Updates',
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

        {/* ── 3D Visual ── */}
        <div className="hero-visual">
          <div className="cylinder-stage-3d">
            <div className="cylinder-glow-3d" aria-hidden="true" />
            <GasCylinder3D />

            {/* Floating badges */}
            <div className="float-badge badge-tl">
              <span className="badge-icon">⚡</span>
              <div>
                <div className="badge-value">Instant</div>
                <div className="badge-sub">Live Stock Check</div>
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
              <span className="badge-icon">🏪</span>
              <div>
                <div className="badge-value">120+ Stores</div>
                <div className="badge-sub">Real-Time Stock</div>
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
    </section>
  );
}
