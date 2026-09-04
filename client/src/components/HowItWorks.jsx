import './HowItWorks.css';

const STEPS = [
  {
    num: '01',
    title: 'Set Your Location',
    desc: "Allow location access or manually enter your delivery address. We'll show you nearby certified wholesale stores.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Choose Your Store',
    desc: 'Browse stores by distance, ratings, or price. Check real-time stock levels for your preferred cylinder size.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Book & Pay',
    desc: 'Select your quantity and cylinder type. Pay online securely or choose pay-on-delivery. Booking confirmed in seconds.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Track & Receive',
    desc: 'Watch your delivery live on the map. Your gas cylinder arrives safely at your door. Rate your experience!',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="hiw-section" id="how-it-works">
      {/* Background decoration */}
      <div className="hiw-bg-deco" aria-hidden="true">
        <div className="hiw-orb" />
      </div>

      <div className="container">
        <div className="section-header">
          <div className="section-label">
            <span className="dot" />
            Simple Process
          </div>
          <h2 className="section-title">
            Gas Booking in <span className="gradient-text">4 Easy Steps</span>
          </h2>
          <p className="section-subtitle">
            From opening the app to receiving your cylinder — we've made it as fast and smooth as possible.
          </p>
        </div>

        <div className="hiw-steps">
          {STEPS.map((step, i) => (
            <div key={i} className="hiw-step" style={{ '--i': i }}>
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="step-connector" style={{ '--i': i }} aria-hidden="true">
                  <div className="connector-track"><div className="connector-fill" /></div>
                  <svg className="connector-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              )}

              <div className="step-card glass-card">
                <div className="step-num">{step.num}</div>
                <div className="step-icon-wrap">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="hiw-cta">
          <a href="#book" className="btn-primary" id="hiw-book-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            Start Booking Now
          </a>
          <p className="cta-note">No account needed to browse stores</p>
        </div>
      </div>
    </section>
  );
}
