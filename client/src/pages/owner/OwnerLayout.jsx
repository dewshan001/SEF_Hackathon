import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../customer/CustomerLayout.css';

const NAV_LINKS = [
  { to: '/owner/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/owner/cylinders', icon: '⛽', label: 'Manage Cylinders' },
  { to: '/owner/orders', icon: '📋', label: 'Orders' },
  { to: '/owner/shop', icon: '🏪', label: 'My Shop' },
];

export default function OwnerLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar glass-card" id="owner-sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-logo gradient-text">GasGo</span>
          <span className="sidebar-role-tag">Owner</span>
        </div>

        <nav className="sidebar-nav" aria-label="Owner navigation">
          {NAV_LINKS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/owner/dashboard'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
              id={`nav-owner-${label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="sidebar-icon" aria-hidden="true">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            <div className="sidebar-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-email">{user?.email}</div>
            </div>
          </div>
          <button className="btn-secondary sidebar-logout-btn" id="owner-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="dash-main">
        {children}
      </main>
    </div>
  );
}
