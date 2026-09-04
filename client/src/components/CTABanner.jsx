import './CTABanner.css';

export default function CTABanner() {
  return (
    <section className="cta-section" id="cta">
      <div className="container">
        <div className="cta-card glass-card">
          {/* Liquid glass background effects */}
          <div className="cta-orb cta-orb-1" aria-hidden="true" />
          <div className="cta-orb cta-orb-2" aria-hidden="true" />
          <div className="cta-grid" aria-hidden="true" />

          <div className="cta-inner">
            <div className="cta-text">
              <div className="section-label" style={{ marginBottom: '20px', display: 'inline-flex' }}>
                <span className="dot" />
                Ready to Book?
              </div>
              <h2 className="cta-title">
                Never Run Out of<br />
                <span className="gradient-text">Gas Again</span>
              </h2>
              <p className="cta-sub">
                Join 50,000+ Sri Lankan families who trust GasGo Lanka for
                fast, safe, and affordable LP gas delivery.
              </p>
            </div>
            <div className="cta-actions">
              <a href="#book" className="btn-primary cta-btn" id="cta-book-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                Book Now – It's Free
              </a>
              <a href="tel:+94112345678" className="btn-secondary cta-btn" id="cta-call-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.42 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.1a16 16 0 0 0 6 6l.98-.98a2 2 0 0 1 2.1-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Call: +94 11 234 5678
              </a>
            </div>

            {/* Mini stats */}
            <div className="cta-mini-stats">
              <div className="mini-stat">
                <span className="mini-value">24/7</span>
                <span className="mini-label">Support</span>
              </div>
              <div className="mini-divider" aria-hidden="true" />
              <div className="mini-stat">
                <span className="mini-value">120+</span>
                <span className="mini-label">Stores</span>
              </div>
              <div className="mini-divider" aria-hidden="true" />
              <div className="mini-stat">
                <span className="mini-value">0 LKR</span>
                <span className="mini-label">Sign Up Cost</span>
              </div>
            </div>
          </div>

          {/* Animated gas cylinder illustration */}
          <div className="cta-visual" aria-hidden="true">
            <div className="cta-flame">
              <svg width="120" height="160" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Cylinder */}
                <rect x="20" y="30" width="80" height="130" rx="36" fill="url(#cta_body)"/>
                <ellipse cx="60" cy="30" rx="40" ry="14" fill="url(#cta_top)"/>
                <ellipse cx="60" cy="160" rx="40" ry="14" fill="url(#cta_bot)"/>
                {/* Shine */}
                <rect x="28" y="42" width="22" height="90" rx="11" fill="url(#cta_shine)" opacity="0.3"/>
                {/* Neck */}
                <rect x="42" y="16" width="36" height="18" rx="9" fill="url(#cta_neck)"/>
                <rect x="50" y="6" width="20" height="12" rx="6" fill="#9e9e9e"/>
                {/* Flame */}
                <path d="M60 2C60 2 50 18 52 28C54 38 68 38 68 28C68 24 64 20 64 20C64 20 70 26 68 34C72 30 74 24 72 18C70 12 60 2 60 2Z" fill="url(#flame_g)"/>
                <defs>
                  <linearGradient id="cta_body" x1="20" y1="30" x2="100" y2="160" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ff8f4f"/><stop offset="1" stopColor="#c94a12"/>
                  </linearGradient>
                  <linearGradient id="cta_top" x1="20" y1="16" x2="100" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffcc02"/><stop offset="1" stopColor="#ffa726"/>
                  </linearGradient>
                  <linearGradient id="cta_bot" x1="20" y1="146" x2="100" y2="174" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ff6b2b"/><stop offset="1" stopColor="#c94a12"/>
                  </linearGradient>
                  <linearGradient id="cta_shine" x1="28" y1="42" x2="50" y2="132" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" stopOpacity="0.8"/><stop offset="1" stopColor="white" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="cta_neck" x1="42" y1="16" x2="78" y2="34" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffcc02"/><stop offset="1" stopColor="#ffa726"/>
                  </linearGradient>
                  <linearGradient id="flame_g" x1="60" y1="2" x2="60" y2="38" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ff4757"/><stop offset="0.5" stopColor="#ff6b2b"/><stop offset="1" stopColor="#ffa726"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
