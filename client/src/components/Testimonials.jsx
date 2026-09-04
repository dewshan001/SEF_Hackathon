import './Testimonials.css';

const TESTIMONIALS = [
  {
    name: 'Priya Wickramasinghe',
    location: 'Colombo 05',
    avatar: 'PW',
    rating: 5,
    text: 'I used to wait in line at the store every month. Now I just tap twice and my gas is at the door in 25 minutes. Absolute game changer!',
    color: '#ff6b2b',
  },
  {
    name: 'Rohan Fernando',
    location: 'Kandy',
    avatar: 'RF',
    rating: 5,
    text: 'The live tracking feature is brilliant. I could see exactly when the driver was coming. The driver was polite and the cylinder quality is top notch.',
    color: '#ffa726',
  },
  {
    name: 'Nishantha Jayawardena',
    location: 'Galle',
    avatar: 'NJ',
    rating: 5,
    text: 'Running a small restaurant, I need gas reliably. GasGo Lanka gives me the 35kg commercial cylinder same day. Excellent service!',
    color: '#22c55e',
  },
  {
    name: 'Amali de Silva',
    location: 'Nugegoda',
    avatar: 'AS',
    rating: 5,
    text: 'The prices are transparent — no hidden charges. I compared with my usual store and GasGo Lanka was actually cheaper. Highly recommend!',
    color: '#3b82f6',
  },
];

function StarRating({ count }) {
  return (
    <div className="stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#ffa726" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="testimonials-section" id="reviews">
      <div className="test-bg-deco" aria-hidden="true" />
      <div className="container">
        <div className="section-header">
          <div className="section-label">
            <span className="dot" />
            Customer Reviews
          </div>
          <h2 className="section-title">
            Loved by <span className="gradient-text">50,000+ Families</span><br />
            Across Sri Lanka
          </h2>
        </div>

        <div className="testimonials-grid" role="list">
          {TESTIMONIALS.map((t, i) => (
            <article key={i} className="testimonial-card glass-card" style={{ '--delay': `${i * 0.1}s` }} role="listitem">
              <div className="test-quote" aria-hidden="true">"</div>
              <StarRating count={t.rating} />
              <p className="test-text">"{t.text}"</p>
              <div className="test-author">
                <div className="test-avatar" style={{ background: `linear-gradient(135deg, ${t.color}40, ${t.color}20)`, border: `1px solid ${t.color}40`, color: t.color }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="test-name">{t.name}</div>
                  <div className="test-location">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {t.location}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Overall rating */}
        <div className="overall-rating glass-card">
          <div className="rating-score gradient-text">4.9</div>
          <div>
            <StarRating count={5} />
            <p className="rating-note">Based on 12,000+ verified reviews</p>
          </div>
          <div className="rating-badges">
            <span className="r-badge">🏆 #1 Gas App in Sri Lanka</span>
            <span className="r-badge">✅ Google Play Editor's Choice</span>
          </div>
        </div>
      </div>
    </section>
  );
}
