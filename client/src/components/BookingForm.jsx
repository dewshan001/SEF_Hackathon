import { useState } from 'react';
import './BookingForm.css';

const CYLINDER_TYPES = [
  { id: 'lp-12', label: '12.5 kg LP Gas', price: 'LKR 4,200', tag: 'Most Popular' },
  { id: 'lp-5', label: '5 kg LP Gas', price: 'LKR 1,800', tag: '' },
  { id: 'commercial', label: '35 kg Commercial', price: 'LKR 11,500', tag: 'Business' },
];

export default function BookingForm() {
  const [selected, setSelected] = useState('lp-12');
  const [qty, setQty] = useState(1);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  const selectedType = CYLINDER_TYPES.find(c => c.id === selected);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="booking-section" id="book">
        <div className="container booking-container">
          <div className="booking-success glass-card">
            <div className="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 className="success-title">Booking Confirmed! 🎉</h2>
            <p className="success-msg">
              Your <strong>{selectedType?.label}</strong> booking has been placed successfully.
              A confirmation will be sent to <strong>{form.phone}</strong> shortly.
            </p>
            <div className="success-details">
              <div className="detail-row">
                <span>Order ID</span>
                <span className="gradient-text">#GGL{Math.floor(Math.random() * 90000) + 10000}</span>
              </div>
              <div className="detail-row">
                <span>Estimated Delivery</span>
                <span>25–40 minutes</span>
              </div>
              <div className="detail-row">
                <span>Amount</span>
                <span>{selectedType?.price}</span>
              </div>
            </div>
            <button className="btn-primary" onClick={() => { setSubmitted(false); setStep(1); setForm({ name: '', phone: '', address: '' }); setQty(1); }} id="book-again-btn">
              Book Another
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="booking-section" id="book">
      <div className="booking-bg-orb" aria-hidden="true" />
      <div className="container booking-container">
        {/* Left – Info */}
        <div className="booking-info">
          <div className="section-label">
            <span className="dot" />
            Book Your Cylinder
          </div>
          <h2 className="section-title" style={{ textAlign: 'left' }}>
            Order Gas in<br />
            <span className="gradient-text">Under 2 Minutes</span>
          </h2>
          <p className="section-subtitle" style={{ textAlign: 'left' }}>
            Fill in your details, pick your preferred cylinder, and we'll connect you with the nearest store.
          </p>

          <div className="booking-benefits">
            {[
              { icon: '⚡', text: 'Average delivery in 30 mins' },
              { icon: '🛡️', text: 'Govt-approved cylinders only' },
              { icon: '📱', text: 'SMS & WhatsApp updates' },
              { icon: '💳', text: 'Pay online or on delivery' },
            ].map((b, i) => (
              <div key={i} className="benefit-item">
                <span className="benefit-icon">{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right – Form */}
        <div className="booking-form-wrap glass-card">
          {/* Progress */}
          <div className="form-progress" aria-label="Booking progress">
            {[1, 2].map(s => (
              <div key={s} className={`progress-step ${step >= s ? 'active' : ''} ${step > s ? 'done' : ''}`} aria-current={step === s ? 'step' : undefined}>
                <div className="progress-num">{step > s ? '✓' : s}</div>
                <span>{s === 1 ? 'Choose Cylinder' : 'Your Details'}</span>
              </div>
            ))}
            <div className="progress-line" style={{ width: step > 1 ? '100%' : '0%' }} />
          </div>

          <form onSubmit={handleSubmit} className="booking-form" noValidate>
            {step === 1 && (
              <div className="form-step" key="step1">
                <h3 className="form-step-title">Select Cylinder Type</h3>
                <div className="cylinder-options">
                  {CYLINDER_TYPES.map(c => (
                    <label
                      key={c.id}
                      className={`cylinder-option ${selected === c.id ? 'selected' : ''}`}
                      htmlFor={`cyl-${c.id}`}
                    >
                      <input
                        type="radio"
                        id={`cyl-${c.id}`}
                        name="cylinder"
                        value={c.id}
                        checked={selected === c.id}
                        onChange={() => setSelected(c.id)}
                      />
                      <div className="cylinder-opt-icon" aria-hidden="true">
                        <svg width="22" height="22" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <ellipse cx="16" cy="36" rx="11" ry="4" fill="rgba(255,107,43,0.3)"/>
                          <rect x="5" y="8" width="22" height="28" rx="11" fill="url(#copt)"/>
                          <ellipse cx="16" cy="8" rx="11" ry="4" fill="rgba(255,204,2,0.9)"/>
                          <rect x="12" y="4" width="8" height="6" rx="3" fill="#9e9e9e"/>
                          <defs>
                            <linearGradient id="copt" x1="5" y1="8" x2="27" y2="36" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#ff8f4f"/><stop offset="1" stopColor="#c94a12"/>
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div className="cylinder-opt-info">
                        <span className="opt-label">{c.label}</span>
                        <span className="opt-price">{c.price}</span>
                      </div>
                      {c.tag && <span className="opt-tag">{c.tag}</span>}
                      <div className="opt-check">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="qty-field">
                  <label className="field-label" htmlFor="qty-input">Quantity</label>
                  <div className="qty-control">
                    <button type="button" className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))} id="qty-dec-btn" aria-label="Decrease quantity">−</button>
                    <input id="qty-input" type="number" value={qty} readOnly className="qty-input" aria-label="Quantity" />
                    <button type="button" className="qty-btn" onClick={() => setQty(Math.min(10, qty + 1))} id="qty-inc-btn" aria-label="Increase quantity">+</button>
                  </div>
                </div>

                <button type="button" className="btn-primary form-submit-btn" id="step1-next-btn" onClick={() => setStep(2)}>
                  Continue
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="form-step" key="step2">
                <h3 className="form-step-title">Delivery Details</h3>

                <div className="field-group">
                  <label className="field-label" htmlFor="name-input">Full Name</label>
                  <input
                    id="name-input"
                    type="text"
                    className="field-input"
                    placeholder="e.g. Kamala Perera"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="phone-input">Phone Number</label>
                  <input
                    id="phone-input"
                    type="tel"
                    className="field-input"
                    placeholder="+94 77 123 4567"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    required
                  />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="address-input">Delivery Address</label>
                  <textarea
                    id="address-input"
                    className="field-input field-textarea"
                    placeholder="No. 12, Galle Road, Colombo 03"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>

                {/* Order summary */}
                <div className="order-summary">
                  <div className="summary-row">
                    <span>{selectedType?.label} × {qty}</span>
                    <span>{selectedType?.price}</span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery Fee</span>
                    <span className="text-success">FREE</span>
                  </div>
                  <div className="summary-divider" />
                  <div className="summary-row total">
                    <span>Total</span>
                    <span className="gradient-text">{selectedType?.price}</span>
                  </div>
                </div>

                <div className="form-btn-row">
                  <button type="button" className="btn-secondary" id="step2-back-btn" onClick={() => setStep(1)}>← Back</button>
                  <button type="submit" className="btn-primary form-submit-btn" id="form-submit-btn" disabled={!form.name || !form.phone || !form.address}>
                    Confirm Booking
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
