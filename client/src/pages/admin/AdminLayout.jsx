import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../customer/CustomerLayout.css';

const NAV_LINKS = [
  { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/admin/users', icon: '👥', label: 'All Users' },
  { to: '/admin/shops', icon: '🏪', label: 'All Shops' },
  { to: '/admin/cylinders', icon: '⛽', label: 'All Cylinders' },
  { to: '/admin/orders', icon: '📋', label: 'All Orders' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar glass-card" id="admin-sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-logo gradient-text">GasGo</span>
          <span className="sidebar-role-tag" style={{ background: 'rgba(192,57,43,0.15)', color: '#E74C3C', borderColor: 'rgba(192,57,43,0.3)' }}>Admin</span>
        </div>
        <nav className="sidebar-nav" aria-label="Admin navigation">
          {NAV_LINKS.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} end={to === '/admin/dashboard'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
              id={`nav-admin-${label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="sidebar-icon" aria-hidden="true">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            <div className="sidebar-avatar" style={{ background: '#C0392B' }}>{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-email">{user?.email}</div>
            </div>
          </div>
          <button className="btn-secondary sidebar-logout-btn" id="admin-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>
      <main className="dash-main">{children}</main>
    </div>
  );
}
