import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const ROLE_DASHBOARD = {
  CUSTOMER: '/customer/dashboard',
  SHOP_OWNER: '/owner/dashboard',
  ADMIN: '/admin/dashboard',
  CUSTOMER: '/customer',
  SHOP_OWNER: '/shop-owner',
  ADMIN: '/admin',
};

const NAV_LINKS = [
  { label: 'Features',      href: '#features'     },
  { label: 'How It Works',  href: '#how-it-works' },
  { label: 'Book Now',      href: '#book'         },
];

export default function Navbar({ theme, onToggleTheme }) {
  const navRef   = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const onScroll = () => {
      navRef.current?.classList.toggle('scrolled', window.scrollY > 48);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e, href) => {
    setMenuOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      e.preventDefault();
      navigate('/' + href);
    }
  };

  const isDark = theme === 'dark';

  return (
    <nav ref={navRef} className="navbar" id="navbar" aria-label="Main navigation">
      <div className="nav-inner container">

        {/* ── Logo ── */}
        <Link to="/" className="nav-logo" aria-label="GasGo Lanka home" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="logo-mark" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="16" cy="30" rx="10" ry="4"  fill="url(#nl-bot)" />
              <rect   x="6"  y="10" width="20" height="20" rx="9" fill="url(#nl-body)" />
              <ellipse cx="16" cy="10" rx="10" ry="4"  fill="url(#nl-top)" />
              <rect   x="12" y="5"  width="8"  height="7"  rx="3" fill="url(#nl-valve)" />
              <rect   x="11" y="2"  width="10" height="5"  rx="2" fill="url(#nl-handle)" />
              <defs>
                <linearGradient id="nl-body"   x1="6" y1="10" x2="26" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F2752E"/><stop offset="1" stopColor="#C0392B"/>
                </linearGradient>
                <linearGradient id="nl-top"    x1="6" y1="6"  x2="26" y2="14" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F9CC1B"/><stop offset="1" stopColor="#F5A623"/>
                </linearGradient>
                <linearGradient id="nl-bot"    x1="6" y1="26" x2="26" y2="34" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E85D1A"/><stop offset="1" stopColor="#C0392B"/>
                </linearGradient>
                <linearGradient id="nl-valve"  x1="12" y1="5"  x2="20" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E0E0E0"/><stop offset="1" stopColor="#9E9E9E"/>
                </linearGradient>
                <linearGradient id="nl-handle" x1="11" y1="2"  x2="21" y2="7"  gradientUnits="userSpaceOnUse">
                  <stop stopColor="#BDBDBD"/><stop offset="1" stopColor="#757575"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-text">
            GasGo <span className="logo-accent">Lanka</span>
          </span>
        </Link>

        {/* ── Desktop Links (Scenario specific) ── */}
        <ul className={`nav-links ${menuOpen ? 'is-open' : ''}`} role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="nav-link"
                id={`nav-link-${label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={(e) => handleNavClick(e, href)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* ── Actions ── */}
        <div className="nav-actions">
          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            id="theme-toggle-btn"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? (
              /* Sun icon */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1"  x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1"  y1="12" x2="3"  y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              /* Moon icon */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {isAuthenticated ? (
            <>
              <Link to={ROLE_DASHBOARD[role] || '/'} className="btn-secondary nav-btn" id="nav-dashboard-btn">
                {user?.name?.split(' ')[0] || 'Dashboard'}
              </Link>
              <button type="button" className="btn-primary nav-btn" id="nav-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary nav-btn" id="nav-signin-btn">Sign In</Link>
              <a
                href="#book"
                className="btn-primary nav-btn"
                id="nav-book-btn"
                onClick={(e) => handleNavClick(e, '#book')}
              >
                Book Now
              </a>
            </>
          )}
        </div>

        {/* ── Hamburger ── */}
        <button
          className={`hamburger ${menuOpen ? 'is-open' : ''}`}
          id="hamburger-btn"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
