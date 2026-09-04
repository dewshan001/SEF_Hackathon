import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import { isValidEmail, isValidPassword } from '../utils/validators';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success

  const errors = {
    email: !form.email
      ? 'Email is required'
      : !isValidEmail(form.email)
        ? 'Enter a valid email address'
        : '',
    password: !form.password
      ? 'Password is required'
      : !isValidPassword(form.password)
        ? 'Password must be at least 6 characters'
        : '',
  };

  const isValid = !errors.email && !errors.password;

  const handleBlur = (field) => setTouched(t => ({ ...t, [field]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isValid) return;
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1300);
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
            <h2 className="success-title">Welcome Back!</h2>
            <p className="success-msg">
              You've signed in successfully as <strong>{form.email}</strong>.
            </p>
            <Link to="/" className="btn-primary auth-submit-btn" id="login-continue-btn">
              Continue to Home
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
            Welcome Back
          </div>
          <h1 className="auth-title">
            Sign in to your <span className="gradient-text">account</span>
          </h1>
          <p className="auth-subtitle">
            Order gas cylinders and track your deliveries in seconds.
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label className="field-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                className={`field-input ${touched.email && errors.email ? 'has-error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                onBlur={() => handleBlur('email')}
              />
              {touched.email && errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="login-password">Password</label>
              <div className="password-wrap">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`field-input ${touched.password && errors.password ? 'has-error' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  onBlur={() => handleBlur('password')}
                />
                <button
                  type="button"
                  className="pw-toggle-btn"
                  id="login-pw-toggle-btn"
                  onClick={() => setShowPassword(s => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon off={showPassword} />
                </button>
              </div>
              {touched.password && errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="auth-row">
              <label className="remember-check">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="forgot-link" id="forgot-password-link">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="btn-primary auth-submit-btn"
              id="login-submit-btn"
              disabled={!form.email || !form.password || status === 'loading'}
            >
              {status === 'loading' ? (
                <span className="btn-spinner" aria-hidden="true" />
              ) : (
                <>
                  Sign In
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <Link to="/register" id="go-register-link">Create one</Link>
          </div>
        </div>
      </div>
    </div>
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
