import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import {
  isValidEmail,
  isValidSriLankanPhone,
  isValidPassword,
  getPasswordStrength,
} from '../utils/validators';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  confirmPassword: '',
};

const STEPS = [
  { n: 1, label: 'Account' },
  { n: 2, label: 'Contact' },
  { n: 3, label: 'Security' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate      = useNavigate();

  const [step, setStep]               = useState(1);
  const [form, setForm]               = useState(initialForm);
  const [touched, setTouched]         = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed]           = useState(false);
  const [status, setStatus]           = useState('idle'); // idle | loading | success | error
  const [serverError, setServerError] = useState('');

  const strength = getPasswordStrength(form.password);

  const errors = {
    name: !form.name
      ? 'Full name is required'
      : form.name.trim().length < 2
        ? 'Name is too short'
        : '',
    email: !form.email
      ? 'Email is required'
      : !isValidEmail(form.email)
        ? 'Enter a valid email address'
        : '',
    phone: !form.phone
      ? 'Phone number is required'
      : !isValidSriLankanPhone(form.phone)
        ? 'Enter a valid Sri Lankan number (e.g. 077 123 4567)'
        : '',
    address: !form.address
      ? 'Delivery address is required'
      : form.address.trim().length < 8
        ? 'Please enter a more complete address'
        : '',
    password: !form.password
      ? 'Password is required'
      : !isValidPassword(form.password)
        ? 'Password must be at least 6 characters'
        : '',
    confirmPassword: !form.confirmPassword
      ? 'Please confirm your password'
      : form.confirmPassword !== form.password
        ? 'Passwords do not match'
        : '',
  };

  const step1Valid = !errors.name && !errors.email;
  const step2Valid = !errors.phone && !errors.address;
  const step3Valid = !errors.password && !errors.confirmPassword && agreed;
  const isValid = step1Valid && step2Valid && step3Valid;

  const setField = (field, value) => {
    setServerError('');
    setForm(f => ({ ...f, [field]: value }));
  };
  const handleBlur = (field) => setTouched(t => ({ ...t, [field]: true }));

  const goNext = () => {
    if (step === 1) {
      setTouched(t => ({ ...t, name: true, email: true }));
      if (!step1Valid) return;
    }
    if (step === 2) {
      setTouched(t => ({ ...t, phone: true, address: true }));
      if (!step2Valid) return;
    }
    setStep(s => Math.min(3, s + 1));
  };

  const goBack = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(t => ({ ...t, password: true, confirmPassword: true }));
    if (!isValid) return;

    setStatus('loading');
    setServerError('');

    const result = await register({
      name:     form.name,
      email:    form.email,
      phone:    form.phone,
      address:  form.address,
      password: form.password,
    });

    if (result.success) {
      setStatus('success');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setStatus('error');
      setServerError(result.message);
    }
  };

  if (status === 'success') {
    return (
      <div className="auth-page">
        <LeftPanel step={3} />
        <div className="auth-right">
          <div className="auth-shell">
            <div className="auth-card auth-success">
              <div className="success-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" /><polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="success-title">Account Created!</h2>
              <p className="success-msg">
                Welcome to GasGo Lanka, <strong>{form.name.split(' ')[0]}</strong>. You can now sign in and book your first cylinder.
              </p>
              <Link to="/login" className="btn-primary auth-submit-btn" id="register-continue-btn">
                Continue to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <LeftPanel step={step} />
      <div className="auth-right">
        <Link to="/" className="auth-back-home" id="register-back-home-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Home
        </Link>
        <div className="auth-orb auth-orb-1" aria-hidden="true" />
        <div className="auth-orb auth-orb-2" aria-hidden="true" />

        <div className="auth-shell">
          {/* Mobile brand */}
          <div className="auth-mobile-brand">
            <div className="auth-mobile-brand-icon">
              <FlameIcon size={18} />
            </div>
            <span className="auth-mobile-brand-name">Gas<span>Go</span> Lanka</span>
          </div>

          <div className="auth-card">
            <div className="auth-eyebrow">
              <span className="auth-eyebrow-dot" />
              Join GasGo Lanka
            </div>
            <h1 className="auth-title">
              Create your <span className="gradient-text">account</span>
            </h1>
            <p className="auth-subtitle">
              Register once, order anytime — fast gas delivery to your doorstep.
            </p>

            {/* Step progress */}
            <div className="form-progress" aria-label="Registration progress">
              {STEPS.map(s => (
                <div
                  key={s.n}
                  className={`progress-step ${step >= s.n ? 'active' : ''} ${step > s.n ? 'done' : ''}`}
                  aria-current={step === s.n ? 'step' : undefined}
                >
                  <div className="progress-num">{step > s.n ? '✓' : s.n}</div>
                  <span>{s.label}</span>
                </div>
              ))}
              <div className="progress-line">
                <div className="progress-line-fill" style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }} />
              </div>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {step === 1 && (
                <div className="form-step">
                  <h3 className="form-step-title">Let&apos;s start with the basics</h3>

                  <div className="field-group">
                    <label className="field-label" htmlFor="reg-name">Full Name</label>
                    <input
                      id="reg-name"
                      type="text"
                      autoComplete="name"
                      className={`field-input ${touched.name && errors.name ? 'has-error' : touched.name && !errors.name && form.name ? 'is-valid' : ''}`}
                      placeholder="e.g. Kamala Perera"
                      value={form.name}
                      onChange={e => setField('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      autoFocus
                    />
                    {touched.name && !errors.name && form.name && <FieldCheck />}
                    {touched.name && errors.name && <span className="field-error">{errors.name}</span>}
                  </div>

                  <div className="field-group">
                    <label className="field-label" htmlFor="reg-email">Email Address</label>
                    <input
                      id="reg-email"
                      type="email"
                      autoComplete="email"
                      className={`field-input ${touched.email && errors.email ? 'has-error' : touched.email && !errors.email && form.email ? 'is-valid' : ''}`}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={e => setField('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                    />
                    {touched.email && !errors.email && form.email && <FieldCheck />}
                    {touched.email && errors.email && <span className="field-error">{errors.email}</span>}
                  </div>

                  <button
                    type="button"
                    className="btn-primary auth-submit-btn"
                    id="reg-step1-next-btn"
                    onClick={goNext}
                  >
                    Continue
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="form-step">
                  <h3 className="form-step-title">Where should we deliver?</h3>

                  <div className="field-group">
                    <label className="field-label" htmlFor="reg-phone">Phone Number</label>
                    <input
                      id="reg-phone"
                      type="tel"
                      autoComplete="tel"
                      className={`field-input ${touched.phone && errors.phone ? 'has-error' : touched.phone && !errors.phone && form.phone ? 'is-valid' : ''}`}
                      placeholder="077 123 4567"
                      value={form.phone}
                      onChange={e => setField('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      autoFocus
                    />
                    {touched.phone && !errors.phone && form.phone && <FieldCheck />}
                    {touched.phone && errors.phone && <span className="field-error">{errors.phone}</span>}
                  </div>

                  <div className="field-group">
                    <label className="field-label" htmlFor="reg-address">Delivery Address</label>
                    <textarea
                      id="reg-address"
                      className={`field-input field-textarea ${touched.address && errors.address ? 'has-error' : touched.address && !errors.address && form.address ? 'is-valid' : ''}`}
                      placeholder="No. 12, Galle Road, Colombo 03"
                      rows={3}
                      value={form.address}
                      onChange={e => setField('address', e.target.value)}
                      onBlur={() => handleBlur('address')}
                    />
                    {touched.address && errors.address && <span className="field-error">{errors.address}</span>}
                  </div>

                  <div className="form-btn-row">
                    <button type="button" className="btn-secondary" id="reg-step2-back-btn" onClick={goBack}>← Back</button>
                    <button type="button" className="btn-primary auth-submit-btn" id="reg-step2-next-btn" onClick={goNext}>
                      Continue
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="form-step">
                  <h3 className="form-step-title">Secure your account</h3>

                  <div className="field-group">
                    <label className="field-label" htmlFor="reg-password">Password</label>
                    <div className="password-wrap">
                      <input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        className={`field-input ${touched.password && errors.password ? 'has-error' : ''}`}
                        placeholder="Create a strong password"
                        value={form.password}
                        onChange={e => setField('password', e.target.value)}
                        onBlur={() => handleBlur('password')}
                        autoFocus
                      />
                      <button
                        type="button"
                        className="pw-toggle-btn"
                        id="reg-pw-toggle-btn"
                        onClick={() => setShowPassword(s => !s)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        <EyeIcon off={showPassword} />
                      </button>
                    </div>

                    {form.password && (
                      <div className="pw-strength" style={{ '--pw-color': strength.color }}>
                        <div className="pw-strength-track">
                          {[0, 1, 2, 3].map(i => (
                            <div
                              key={i}
                              className={`pw-strength-seg ${i < Math.max(1, strength.score) ? 'filled' : ''}`}
                            />
                          ))}
                        </div>
                        <span className="pw-strength-label">{strength.label}</span>
                      </div>
                    )}
                    {touched.password && errors.password && <span className="field-error">{errors.password}</span>}
                  </div>

                  <div className="field-group">
                    <label className="field-label" htmlFor="reg-confirm-password">Confirm Password</label>
                    <div className="password-wrap">
                      <input
                        id="reg-confirm-password"
                        type={showConfirm ? 'text' : 'password'}
                        autoComplete="new-password"
                        className={`field-input ${touched.confirmPassword && errors.confirmPassword ? 'has-error' : touched.confirmPassword && !errors.confirmPassword && form.confirmPassword ? 'is-valid' : ''}`}
                        placeholder="Re-enter your password"
                        value={form.confirmPassword}
                        onChange={e => setField('confirmPassword', e.target.value)}
                        onBlur={() => handleBlur('confirmPassword')}
                      />
                      <button
                        type="button"
                        className="pw-toggle-btn"
                        id="reg-confirm-pw-toggle-btn"
                        onClick={() => setShowConfirm(s => !s)}
                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      >
                        <EyeIcon off={showConfirm} />
                      </button>
                    </div>
                    {touched.confirmPassword && !errors.confirmPassword && form.confirmPassword && <FieldCheck />}
                    {touched.confirmPassword && errors.confirmPassword && (
                      <span className="field-error">{errors.confirmPassword}</span>
                    )}
                  </div>

                  <label className="terms-check">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={e => setAgreed(e.target.checked)}
                    />
                    <span>
                      I agree to the <a href="#terms" className="terms-link">Terms of Service</a> and{' '}
                      <a href="#privacy" className="terms-link">Privacy Policy</a>.
                    </span>
                  </label>

                  {/* Server error banner — shown on step 3 */}
                  {serverError && (
                    <div className="auth-server-error" role="alert">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {serverError}
                    </div>
                  )}

                  <div className="form-btn-row">
                    <button type="button" className="btn-secondary" id="reg-step3-back-btn" onClick={goBack}>← Back</button>
                    <button
                      type="submit"
                      className="btn-primary auth-submit-btn"
                      id="register-submit-btn"
                      disabled={!isValid || status === 'loading'}
                    >
                      {status === 'loading' ? (
                        <span className="btn-spinner" aria-hidden="true" />
                      ) : (
                        <>
                          Create Account
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>

            <div className="auth-switch">
              Already have an account? <Link to="/login" id="go-login-link">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Left panel ── */
function LeftPanel({ step }) {
  const perks = [
    'Order in under 60 seconds',
    'Live GPS delivery tracking',
    'Litro & Laugfs cylinders available',
    'Safe, secure & PUCSL licensed',
  ];

  return (
    <div className="auth-left">
      <div className="auth-left-bg" />
      <div className="auth-left-grid" />
      <div className="auth-left-orb auth-left-orb-1" />
      <div className="auth-left-orb auth-left-orb-2" />

      <div className="auth-left-content">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <FlameIcon size={22} />
          </div>
          <span className="auth-brand-name">Gas<span>Go</span> Lanka</span>
        </div>

        {/* Hero text */}
        <div className="auth-hero-text">
          <div className="auth-hero-badge">
            <span className="pulse-dot" />
            Quick registration
          </div>

          <h2 className="auth-hero-heading">
            Join 50,000+<br />
            households<br />
            <span className="grad">saving time.</span>
          </h2>

          <p className="auth-hero-sub">
            Skip the queue at gas stations. Get your cylinder delivered safely and on schedule, every time.
          </p>

          {/* Perks list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {perks.map((perk, i) => (
              <div key={i} className="auth-trust-item" style={{ color: 'rgba(255,255,255,.65)', fontSize: '.82rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" style={{ color: 'var(--brand-amber)', flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="16 10 10.5 15.5 8 13" />
                </svg>
                {perk}
              </div>
            ))}
          </div>
        </div>

        {/* Step progress hint */}
        <div className="auth-trust" style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.35)', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>
              Step {step} of 3
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${(step / 3) * 100}%`,
                  background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-amber))',
                  borderRadius: '2px',
                  transition: 'width .5s cubic-bezier(.4,0,.2,1)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldCheck() {
  return (
    <span className="field-check" aria-hidden="true">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}

function FlameIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" aria-hidden="true">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
      <path d="M15 9c0-1.5-1.5-3-3-3-1 2-3 3-3 5a3 3 0 0 0 6 0c0-1-.5-1.5-1-2z" fill="rgba(255,255,255,.8)" stroke="none" />
    </svg>
  );
}

function EyeIcon({ off }) {
  return off ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
