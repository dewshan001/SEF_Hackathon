import { useState, useEffect } from 'react';
import './Feedback.css';

const DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
];

const FEEDBACK_CATEGORIES = [
  { id: 'stock', label: 'Stock Accuracy', icon: '📦' },
  { id: 'store', label: 'Store Experience', icon: '🏪' },
  { id: 'platform', label: 'Website & Usability', icon: '⚡' },
  { id: 'service', label: 'Customer Support', icon: '💬' },
  { id: 'feature', label: 'Feature Request', icon: '💡' },
  { id: 'other', label: 'Other', icon: '📝' }
];

const INITIAL_TESTIMONIALS = [
  {
    id: 't-1',
    name: 'Dilshan Perera',
    district: 'Colombo',
    rating: 5,
    category: 'Stock Accuracy',
    comment: 'Saved me more than 2 hours of queuing! The stock numbers for Colombo Central were 100% accurate when I arrived. Excellent service.',
    date: 'Yesterday',
    verified: true,
    recommend: 'yes'
  },
  {
    id: 't-2',
    name: 'Kavindi Jayawardena',
    district: 'Kandy',
    rating: 5,
    category: 'Website & Usability',
    comment: 'Super easy to use on my phone. Finding available 12.5kg cylinders in Kandy took less than a minute. Great design and smooth experience!',
    date: '3 days ago',
    verified: true,
    recommend: 'yes'
  },
  {
    id: 't-3',
    name: 'Mohamed Rizwan',
    district: 'Gampaha',
    rating: 4,
    category: 'Store Experience',
    comment: 'Very helpful store contact details and directions. The Kadawatha dealer was courteous and had stock as listed. Keep it up!',
    date: '5 days ago',
    verified: true,
    recommend: 'yes'
  }
];

export default function Feedback({ onNavigateHome }) {
  // Form fields
  const [category, setCategory] = useState('stock');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [accuracyRating, setAccuracyRating] = useState(5);
  const [easeRating, setEaseRating] = useState(5);
  const [name, setName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [contact, setContact] = useState('');
  const [district, setDistrict] = useState('Colombo');
  const [storeName, setStoreName] = useState('');
  const [comment, setComment] = useState('');
  const [recommend, setRecommend] = useState('yes'); // 'yes' | 'maybe' | 'no'

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [feedbacksList, setFeedbacksList] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');

  // Load saved feedbacks from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gasgo_feedbacks');
      if (stored) {
        const parsed = JSON.parse(stored);
        setFeedbacksList([...parsed, ...INITIAL_TESTIMONIALS]);
      } else {
        setFeedbacksList(INITIAL_TESTIMONIALS);
      }
    } catch {
      setFeedbacksList(INITIAL_TESTIMONIALS);
    }
  }, []);

  const handleRatingHover = (star) => setHoverRating(star);
  const handleRatingLeave = () => setHoverRating(0);

  const getRatingLabel = (val) => {
    switch (val) {
      case 1: return 'Very Poor 😞';
      case 2: return 'Poor 🙁';
      case 3: return 'Average 😐';
      case 4: return 'Good 😊';
      case 5: return 'Outstanding! 🌟';
      default: return '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Please enter your feedback comments before submitting.');
      return;
    }

    setIsSubmitting(true);

    const activeCatObj = FEEDBACK_CATEGORIES.find(c => c.id === category);
    const categoryLabel = activeCatObj ? activeCatObj.label : 'General';

    const newFeedback = {
      id: `fb-${Date.now()}`,
      refCode: `FB-${Math.floor(100000 + Math.random() * 900000)}`,
      name: isAnonymous ? 'Anonymous Customer' : (name.trim() || 'Verified Customer'),
      contact: contact.trim(),
      district,
      storeName: storeName.trim(),
      category: categoryLabel,
      rating,
      accuracyRating,
      easeRating,
      comment: comment.trim(),
      recommend,
      date: 'Just now',
      verified: true
    };

    // Simulate quick smooth network submission
    setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem('gasgo_feedbacks') || '[]');
        const updated = [newFeedback, ...existing];
        localStorage.setItem('gasgo_feedbacks', JSON.stringify(updated));
        setFeedbacksList([newFeedback, ...feedbacksList]);
      } catch (err) {
        console.error('Failed to save to localStorage', err);
      }

      setSubmittedData(newFeedback);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const resetForm = () => {
    setSubmittedData(null);
    setComment('');
    setName('');
    setContact('');
    setStoreName('');
    setRating(5);
    setAccuracyRating(5);
    setEaseRating(5);
    setCategory('stock');
    setIsAnonymous(false);
  };

  const filteredFeedbacks = filterCategory === 'all'
    ? feedbacksList
    : feedbacksList.filter(f => f.category.toLowerCase().includes(filterCategory.toLowerCase()));

  return (
    <section className="feedback-page" id="feedback" aria-label="Customer Feedback">
      {/* Background glowing orbs */}
      <div className="feedback-orbs" aria-hidden="true">
        <div className="feedback-orb feedback-orb-1" />
        <div className="feedback-orb feedback-orb-2" />
      </div>

      <div className="container">
        {/* Navigation Breadcrumb / Return */}
        <div className="feedback-topbar">
          <button
            onClick={onNavigateHome}
            className="feedback-back-btn"
            id="feedback-back-btn"
            aria-label="Back to Home"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </button>
        </div>

        {/* Page Header */}
        <div className="feedback-header">
          <div className="section-label">
            <span className="dot" />
            Your Voice Matters
          </div>
          <h1 className="feedback-title">
            Share Your <span className="gradient-text">Feedback</span>
          </h1>
          <p className="feedback-subtitle">
            Help us improve Sri Lanka's LP gas network. Whether you visited a wholesale dealer, checked live cylinder stocks, or have ideas for new features, we want to hear from you.
          </p>
        </div>

        {/* If submitted successfully, show celebration confirmation */}
        {submittedData ? (
          <div className="feedback-success-card glass-card">
            <div className="success-icon-badge">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>

            <h2 className="success-title">Thank You For Your Feedback!</h2>
            <p className="success-msg">
              Your feedback has been successfully recorded. Your voice directly helps us keep stock data reliable and improve store availability across Sri Lanka.
            </p>

            <div className="success-ticket-box">
              <div className="ticket-label">Feedback Reference Code</div>
              <div className="ticket-code">{submittedData.refCode}</div>
              <div className="ticket-meta">
                <span>District: <strong>{submittedData.district}</strong></span>
                <span>Category: <strong>{submittedData.category}</strong></span>
                <span>Rating: <strong>{submittedData.rating} ★</strong></span>
              </div>
            </div>

            <div className="success-actions">
              <button
                onClick={resetForm}
                className="btn-primary"
                id="submit-another-feedback-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Submit Another Response
              </button>

              <button
                onClick={onNavigateHome}
                className="btn-secondary"
                id="return-home-btn"
              >
                Return to Home
              </button>
            </div>
          </div>
        ) : (
          /* Main Feedback Form & Sidebar Grid */
          <div className="feedback-layout">
            {/* Form Column */}
            <div className="feedback-form-container glass-card">
              <form onSubmit={handleSubmit} className="feedback-form" noValidate>
                {/* 1. Category Selection */}
                <div className="form-group">
                  <label className="form-label">
                    What is your feedback about? <span className="req">*</span>
                  </label>
                  <div className="category-chips" role="radiogroup" aria-label="Feedback Category">
                    {FEEDBACK_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        className={`chip-btn ${category === cat.id ? 'active' : ''}`}
                        onClick={() => setCategory(cat.id)}
                        role="radio"
                        aria-checked={category === cat.id}
                      >
                        <span className="chip-icon">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Overall Star Rating */}
                <div className="form-group">
                  <div className="label-with-rating">
                    <label className="form-label">
                      Overall Experience <span className="req">*</span>
                    </label>
                    <span className="rating-status-text">
                      {getRatingLabel(hoverRating || rating)}
                    </span>
                  </div>

                  <div className="star-rating-container" role="radiogroup" aria-label="Overall Rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${(hoverRating || rating) >= star ? 'filled' : ''}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => handleRatingHover(star)}
                        onMouseLeave={handleRatingLeave}
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        id={`star-rating-${star}`}
                      >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Micro Ratings */}
                <div className="micro-ratings-grid">
                  <div className="micro-rating-box">
                    <div className="micro-label">Stock Data Accuracy</div>
                    <div className="pill-scale" role="radiogroup">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          type="button"
                          className={`pill-scale-btn ${accuracyRating === num ? 'active' : ''}`}
                          onClick={() => setAccuracyRating(num)}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="micro-rating-box">
                    <div className="micro-label">Ease of Finding Gas</div>
                    <div className="pill-scale" role="radiogroup">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          type="button"
                          className={`pill-scale-btn ${easeRating === num ? 'active' : ''}`}
                          onClick={() => setEaseRating(num)}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Customer Info Row */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="customer-name" className="form-label">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="customer-name"
                      className="form-input"
                      placeholder="e.g. Kasun Fernando"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isAnonymous}
                    />
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                      />
                      <span>Post anonymously</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label htmlFor="customer-contact" className="form-label">
                      Phone or Email (Optional)
                    </label>
                    <input
                      type="text"
                      id="customer-contact"
                      className="form-input"
                      placeholder="For customer follow-up"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                    <span className="form-hint">Kept strictly confidential</span>
                  </div>
                </div>

                {/* 5. Location & Store Row */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="customer-district" className="form-label">
                      District <span className="req">*</span>
                    </label>
                    <select
                      id="customer-district"
                      className="form-select"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    >
                      {DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="customer-store" className="form-label">
                      Store Name / Dealer (Optional)
                    </label>
                    <input
                      type="text"
                      id="customer-store"
                      className="form-input"
                      placeholder="e.g. Colombo Central Gas Point"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                  </div>
                </div>

                {/* 6. Detailed Feedback Message */}
                <div className="form-group">
                  <div className="label-with-rating">
                    <label htmlFor="feedback-comment" className="form-label">
                      Your Detailed Feedback <span className="req">*</span>
                    </label>
                    <span className="char-count">{comment.length}/600</span>
                  </div>
                  <textarea
                    id="feedback-comment"
                    className="form-textarea"
                    rows="4"
                    maxLength="600"
                    placeholder="Tell us about your experience: was stock available as shown? How was the dealer service? Do you have suggestions to improve GasGo?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                </div>

                {/* 7. Recommendation Radio */}
                <div className="form-group">
                  <label className="form-label">
                    Would you recommend GasGo Lanka to family or friends?
                  </label>
                  <div className="recommend-options">
                    {[
                      { id: 'yes', label: 'Yes, definitely 👍' },
                      { id: 'maybe', label: 'Maybe / Neutral 🤔' },
                      { id: 'no', label: 'Not right now 👎' }
                    ].map(opt => (
                      <label key={opt.id} className={`recommend-pill ${recommend === opt.id ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="recommend"
                          value={opt.id}
                          checked={recommend === opt.id}
                          onChange={(e) => setRecommend(e.target.value)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="form-footer">
                  <button
                    type="submit"
                    className="btn-primary feedback-submit-btn"
                    id="feedback-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="feedback-spinner" aria-hidden="true" />
                        Submitting Feedback...
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                        Submit Feedback
                      </>
                    )}
                  </button>
                  <p className="privacy-notice">
                    🔒 Submissions are protected by GasGo Lanka's Customer Privacy Policy.
                  </p>
                </div>
              </form>
            </div>

            {/* Side Information Column */}
            <aside className="feedback-sidebar">
              <div className="sidebar-card glass-card">
                <div className="sidebar-icon">💡</div>
                <h3 className="sidebar-title">Why Your Feedback Matters</h3>
                <p className="sidebar-desc">
                  GasGo Lanka is built to protect consumers from false stock claims and queue delays.
                </p>
                <ul className="sidebar-list">
                  <li>
                    <span className="check-icon">✓</span>
                    <span>Directly updates store reliability scores</span>
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    <span>Alerts distributors about sudden inventory shortages</span>
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    <span>Shapes new features and booking capabilities</span>
                  </li>
                </ul>
              </div>

              <div className="sidebar-card glass-card hotline-card">
                <div className="sidebar-icon">📞</div>
                <h3 className="sidebar-title">Immediate Assistance?</h3>
                <p className="sidebar-desc">
                  If you are experiencing an urgent safety issue or price gouging at an authorized store, contact our safety team:
                </p>
                <a href="tel:+94112345678" className="hotline-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.42 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.1a16 16 0 0 0 6 6l.98-.98a2 2 0 0 1 2.1-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  +94 11 234 5678
                </a>
                <span className="hotline-time">Daily 8:00 AM – 8:00 PM</span>
              </div>
            </aside>
          </div>
        )}

        {/* Community Feedback / Testimonials Showcase Section */}
        <div className="community-feedback-section">
          <div className="community-header">
            <div>
              <div className="section-label">
                <span className="dot" />
                Community Voices
              </div>
              <h2 className="community-title">Recent Customer Experiences</h2>
            </div>

            {/* Filter Pills */}
            <div className="community-filter-pills" role="tablist" aria-label="Filter Feedback">
              {['all', 'Stock', 'Store', 'Website'].map(f => (
                <button
                  key={f}
                  className={`filter-pill-btn ${filterCategory === f.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setFilterCategory(f.toLowerCase())}
                >
                  {f === 'all' ? 'All Reviews' : f}
                </button>
              ))}
            </div>
          </div>

          <div className="feedback-cards-grid">
            {filteredFeedbacks.length === 0 ? (
              <div className="no-feedbacks glass-card">
                No feedback found in this category yet. Be the first to share!
              </div>
            ) : (
              filteredFeedbacks.map((item) => (
                <div key={item.id} className="customer-review-card glass-card">
                  <div className="card-top">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <h4 className="reviewer-name">{item.name}</h4>
                        <span className="reviewer-district">{item.district} District</span>
                      </div>
                    </div>
                    <div className="card-stars" aria-label={`${item.rating} out of 5 stars`}>
                      {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                    </div>
                  </div>

                  <div className="card-category-badge">
                    {item.category}
                  </div>

                  <p className="card-comment">
                    "{item.comment}"
                  </p>

                  <div className="card-footer">
                    <span className="card-date">{item.date}</span>
                    {item.recommend === 'yes' && (
                      <span className="recommends-tag">
                        👍 Recommends GasGo
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
