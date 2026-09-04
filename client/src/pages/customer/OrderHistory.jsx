import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../api/orders';
import StatusBadge from '../../components/StatusBadge';

function formatLKR(v) { return `Rs. ${Number(v || 0).toLocaleString('en-LK')}`; }

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyOrders()
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setError('Unable to load your orders.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="dash-page-header">
        <div className="section-label"><span className="dot" />Customer Portal</div>
        <h1 className="dash-page-title">My <span className="gradient-text">Orders</span></h1>
        <p className="dash-page-subtitle">Your complete gas cylinder order history.</p>
      </div>

      {loading && <div className="dash-state"><div className="dash-spinner" /><span>Loading your orders…</span></div>}
      {error && <div className="dash-state glass-card" style={{ color: 'var(--color-error)' }}>{error}</div>}
      {!loading && !error && orders.length === 0 && (
        <div className="dash-state glass-card">
          <span style={{ fontSize: '2rem' }}>📋</span>
          <span>No orders yet.</span>
          <Link to="/customer/shops" className="btn-primary">Browse Shops</Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {orders.map(o => (
          <Link
            key={o._id}
            to={`/customer/orders/${o._id}`}
            className="glass-card"
            id={`order-card-${o._id}`}
            style={{ display: 'block', padding: 'var(--space-5) var(--space-6)', textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem' }}>
                  <span className="gradient-text">{o.token}</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {o.shopId?.shopName} · {new Date(o.createdAt).toLocaleDateString('en-LK', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              <StatusBadge status={o.status} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              {(o.items || []).map((item, i) => (
                <span key={i} style={{ fontSize: '0.8rem', background: 'var(--brand-tint)', color: 'var(--brand-amber)', padding: '3px 10px', borderRadius: 'var(--r-pill)', border: '1px solid var(--brand-border-soft)' }}>
                  {item.cylinderSize} {item.gasType} × {item.quantity}
                </span>
              ))}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }} className="gradient-text">
              {formatLKR(o.totalAmount)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
