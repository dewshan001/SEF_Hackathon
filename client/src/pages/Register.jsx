import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import {
  isValidEmail,
  isValidSriLankanPhone,
  isValidPassword,
  getPasswordStrength,
} from '../utils/validators';

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
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success

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

  const setField = (field, value) => setForm(f => ({ ...f, [field]: value }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(t => ({ ...t, password: true, confirmPassword: true }));
    if (!isValid) return;
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1400);
  };

  if (status === 'success') {
    return (
      <div className="auth-page">
        <div className="auth-orb auth-orb-1" aria-hidden="true" />
        <div className="auth-orb auth-orb-2" aria-hidden="true" />
        <div className="auth-shell">
          <div className="auth-card glass-card auth-success">
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
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb-1" aria-hidden="true" />
      <div className="auth-orb auth-orb-2" aria-hidden="true" />
      <div className="auth-shell">
        <div className="auth-card glass-card">
          <div className="section-label">
            <span className="dot" />
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
                <h3 className="form-step-title">Let's start with the basics</h3>

                <div className="field-group">
                  <label className="field-label" htmlFor="reg-name">Full Name</label>
                  <input
                    id="reg-name"
                    type="text"
                    autoComplete="name"
                    className={`field-input ${touched.name && errors.name ? 'has-error' : ''}`}
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
                    className={`field-input ${touched.email && errors.email ? 'has-error' : ''}`}
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
                    className={`field-input ${touched.phone && errors.phone ? 'has-error' : ''}`}
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
                    className={`field-input field-textarea ${touched.address && errors.address ? 'has-error' : ''}`}
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
                      placeholder="Create a password"
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
                      className={`field-input ${touched.confirmPassword && errors.confirmPassword ? 'has-error' : ''}`}
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
  );
}

function FieldCheck() {
  return (
    <span className="field-check" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
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
