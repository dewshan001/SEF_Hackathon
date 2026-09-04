import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './CustomerLayout.css';

const NAV_LINKS = [
  { to: '/customer/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/customer/shops', icon: '🏪', label: 'Browse Shops' },
  { to: '/customer/cart', icon: '🛒', label: 'My Cart' },
  { to: '/customer/orders', icon: '📋', label: 'My Orders' },
];

export default function CustomerLayout({ children }) {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar glass-card" id="customer-sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-logo gradient-text">GasGo</span>
          <span className="sidebar-role-tag">Customer</span>
        </div>

        <nav className="sidebar-nav" aria-label="Customer navigation">
          {NAV_LINKS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/customer/dashboard'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
              id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="sidebar-icon" aria-hidden="true">{icon}</span>
              <span>{label}</span>
              {to === '/customer/cart' && totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
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
          <button className="btn-secondary sidebar-logout-btn" id="customer-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dash-main">
        {children}
      </main>
    </div>
  );
}
