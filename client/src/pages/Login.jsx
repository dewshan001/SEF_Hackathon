import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { isValidEmail, isValidPassword } from '../utils/validators';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]           = useState({ email: '', password: '' });
  const [touched, setTouched]     = useState({});
  const [showPassword, setShowPw] = useState(false);
  const [remember, setRemember]   = useState(false);
  const [status, setStatus]       = useState('idle'); // idle | loading | success | error
  const [serverError, setServerError] = useState('');

  // ── Client-side validation ─────────────────────────────────────────────
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

  const isFormValid = !errors.email && !errors.password;

  const handleBlur  = (field) => setTouched(t => ({ ...t, [field]: true }));
  const handleChange = (field, value) => {
    setServerError('');
    setForm(f => ({ ...f, [field]: value }));
  };

  // ── Submit → call backend ──────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isFormValid) return;

    setStatus('loading');
    setServerError('');

    const result = await login({ email: form.email, password: form.password });

    if (result.success) {
      setStatus('success');
      // Redirect based on role
      const role = result.user?.role;
      setTimeout(() => {
        if (role === 'SHOP_OWNER')      navigate('/owner/dashboard');
        else if (role === 'CUSTOMER')   navigate('/customer/dashboard');
        else if (role === 'ADMIN')      navigate('/admin/dashboard');
        else                             navigate('/');
        if (role === 'ADMIN')           navigate('/admin');
        else if (role === 'SHOP_OWNER') navigate('/shop-owner');
        else if (role === 'CUSTOMER')   navigate('/customer');
        else                            navigate('/');
      }, 1200);
    } else {
      setStatus('error');
      setServerError(result.message);
    }
  };

  // ── Success screen ─────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="auth-page">
        <LeftPanel />
        <div className="auth-right">
          <div className="auth-shell">
            <div className="auth-card auth-success">
              <div className="success-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" /><polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="success-title">Welcome Back!</h2>
              <p className="success-msg">
                Signed in as <strong>{form.email}</strong>. Redirecting you now…
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <LeftPanel />
      <div className="auth-right">
        <Link to="/" className="auth-back-home" id="login-back-home-btn">
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
            <div className="auth-mobile-brand-icon"><FlameIcon size={18} /></div>
            <span className="auth-mobile-brand-name">Gas<span>Go</span> Lanka</span>
          </div>

          <div className="auth-card">
            <div className="auth-eyebrow">
              <span className="auth-eyebrow-dot" />
              Welcome Back
            </div>
            <h1 className="auth-title">
              Sign in to your <span className="gradient-text">account</span>
            </h1>
            <p className="auth-subtitle">
              Order gas cylinders and track your deliveries in seconds.
            </p>

            {/* Server-level error banner */}
            {serverError && (
              <div className="auth-server-error" role="alert">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {serverError}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="field-group">
                <label className="field-label" htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  className={`field-input ${touched.email && errors.email ? 'has-error' : touched.email && !errors.email && form.email ? 'is-valid' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                />
                {touched.email && !errors.email && form.email && <FieldCheck />}
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
                    onChange={e => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                  />
                  <button
                    type="button"
                    className="pw-toggle-btn"
                    id="login-pw-toggle-btn"
                    onClick={() => setShowPw(s => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon off={showPassword} />
                  </button>
                </div>
                {touched.password && errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="auth-row">
                <label className="remember-check">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
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
              Don&apos;t have an account? <Link to="/register" id="go-register-link">Create one</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Left panel ── */
function LeftPanel() {
  return (
    <div className="auth-left">
      <div className="auth-left-bg" />
      <div className="auth-left-grid" />
      <div className="auth-left-orb auth-left-orb-1" />
      <div className="auth-left-orb auth-left-orb-2" />
      <div className="auth-left-content">
        <div className="auth-brand">
          <div className="auth-brand-icon"><FlameIcon size={22} /></div>
          <span className="auth-brand-name">Gas<span>Go</span> Lanka</span>
        </div>
        <div className="auth-hero-text">
          <div className="auth-hero-badge">
            <span className="pulse-dot" />
            Live delivery tracking
          </div>
          <h2 className="auth-hero-heading">
            Gas delivered<br />to your door,<br /><span className="grad">in minutes.</span>
          </h2>
          <p className="auth-hero-sub">
            Sri Lanka&apos;s fastest LP gas ordering platform. Book a cylinder in under 60 seconds and track your delivery live.
          </p>
          <div className="auth-stats">
            <div className="auth-stat">
              <div className="auth-stat-val">50<span>K+</span></div>
              <div className="auth-stat-label">Happy customers</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-val">25<span>+</span></div>
              <div className="auth-stat-label">Districts covered</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-val">45<span>m</span></div>
              <div className="auth-stat-label">Avg. delivery time</div>
            </div>
          </div>
        </div>
        <div className="auth-trust">
          <div className="auth-trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secure payments
          </div>
          <div className="auth-trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Licensed by PUCSL
          </div>
          <div className="auth-trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
            24/7 support
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
