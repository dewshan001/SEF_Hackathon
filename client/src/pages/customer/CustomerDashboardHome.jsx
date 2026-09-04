import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyOrders } from '../../api/orders';
import StatusBadge from '../../components/StatusBadge';

function formatLKR(v) {
  return `Rs. ${Number(v || 0).toLocaleString('en-LK')}`;
}

export default function CustomerDashboardHome() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const pending = orders.filter(o => o.status === 'pending').length;
  const ready = orders.filter(o => o.status === 'ready').length;

  return (
    <div>
      <div className="dash-page-header">
        <div className="section-label"><span className="dot" />Customer Portal</div>
        <h1 className="dash-page-title">
          Welcome back, <span className="gradient-text">{user?.name}</span>
        </h1>
        <p className="dash-page-subtitle">
          Order. Get Your Token. Get Your Gas.
        </p>
      </div>

      <div className="dash-stats-row">
        <div className="stat-card glass-card">
          <div className="stat-card-value">{orders.length}</div>
          <div className="stat-card-label">Total Orders</div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-card-value">{pending}</div>
          <div className="stat-card-label">Pending</div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-card-value" style={{ color: '#22C55E', WebkitTextFillColor: '#22C55E' }}>{ready}</div>
          <div className="stat-card-label">Ready to Collect</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-8)', flexWrap: 'wrap' }}>
        <Link to="/customer/shops" className="btn-primary">
          🏪 Browse Gas Shops
        </Link>
        <Link to="/customer/orders" className="btn-secondary">
          📋 My Orders
        </Link>
      </div>

      {/* Recent orders */}
      <section>
        <h2 className="form-step-title" style={{ marginBottom: 'var(--space-5)' }}>Recent Orders</h2>
        {loading && (
          <div className="dash-state"><div className="dash-spinner" /><span>Loading…</span></div>
        )}
        {!loading && orders.length === 0 && (
          <div className="dash-state glass-card">
            <span style={{ fontSize: '2rem' }}>⛽</span>
            <span>No orders yet. Browse shops and place your first order!</span>
            <Link to="/customer/shops" className="btn-primary">Browse Shops</Link>
          </div>
        )}
        {!loading && orders.slice(0, 5).map(o => (
          <Link
            key={o._id}
            to={`/customer/orders/${o._id}`}
            className="glass-card"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--space-4) var(--space-5)',
              marginBottom: 'var(--space-3)',
              textDecoration: 'none',
              color: 'inherit',
              flexWrap: 'wrap',
              gap: 'var(--space-3)',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>
                <span className="gradient-text">{o.token}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {o.shopId?.shopName || 'Shop'} · {new Date(o.createdAt).toLocaleDateString('en-LK')}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <span style={{ fontWeight: 700 }} className="gradient-text">{formatLKR(o.totalAmount)}</span>
              <StatusBadge status={o.status} />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
