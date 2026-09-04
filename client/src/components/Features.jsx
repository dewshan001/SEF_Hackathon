import './Features.css';

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    ),
    title: 'Find Nearby Stores',
    desc: 'Instantly discover certified LP gas wholesale stores near your location with real-time stock availability.',
    color: '#ff6b2b',
    delay: 0,
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    title: 'Easy Online Booking',
    desc: 'Book your preferred cylinder size — 12.5 kg, 5 kg, or commercial — in just a few taps. No calls needed.',
    color: '#ffa726',
    delay: 0.1,
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: 'Live GPS Tracking',
    desc: 'Track your delivery driver on a live map from store to your doorstep with minute-by-minute updates.',
    color: '#ffcc02',
    delay: 0.2,
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    title: 'Secure Payments',
    desc: 'Pay online or on delivery with multiple secure payment methods including cards, UPI, and cash.',
    color: '#22c55e',
    delay: 0.3,
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z" />
        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>
    ),
    title: 'Ratings & Reviews',
    desc: 'Make informed choices with honest store ratings, delivery speed scores, and customer reviews.',
    color: '#3b82f6',
    delay: 0.4,
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    title: 'Order History & Refills',
    desc: 'Set automatic reminders when it\'s time to refill. Reorder your last delivery with a single tap.',
    color: '#a855f7',
    delay: 0.5,
  },
];

export default function Features() {
  return (
    <section className="features-section" id="features">
      <div className="container">
        <div className="section-header">
          <div className="section-label">
            <span className="dot" />
            Why Choose GasGo Lanka
          </div>
          <h2 className="section-title">
            Everything You Need,<br />
            <span className="gradient-text">Built Right In</span>
          </h2>
          <p className="section-subtitle">
            From browsing to booking to delivery — we've streamlined the entire experience
            so you spend less time worrying about gas.
          </p>
        </div>

        <div className="features-grid" role="list">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="feature-card glass-card"
              role="listitem"
              style={{ '--ic': f.color, '--delay': `${f.delay}s` }}
            >
              <div className="feature-icon-wrap">
                {f.icon}
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
