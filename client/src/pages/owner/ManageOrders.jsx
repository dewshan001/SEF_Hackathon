import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getShopOrders, updateOrderStatus } from '../../api/orders';
import StatusBadge from '../../components/StatusBadge';
import { ApiError } from '../../api/client';

function formatLKR(v) { return `Rs. ${Number(v || 0).toLocaleString('en-LK')}`; }

const NEXT_STATUS = { pending: 'ready', ready: 'collected' };
const NEXT_LABEL = { pending: 'Mark Ready', ready: 'Mark Collected' };

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const load = () => {
    setLoading(true);
    getShopOrders()
      .then(d => setOrders(Array.isArray(d) ? d : []))
      .catch(() => setError('Unable to load orders.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: updated.status } : o));
    } catch (err) {
      window.alert(err instanceof ApiError ? err.message : 'Could not update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm('Cancel this order? Stock will be restored.')) return;
    handleStatusUpdate(orderId, 'cancelled');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div className="dash-page-header" style={{ marginBottom: 0 }}>
          <h1 className="dash-page-title">Customer <span className="gradient-text">Orders</span></h1>
          <p className="dash-page-subtitle">Manage and update order statuses for your shop.</p>
        </div>
        <button className="btn-secondary" id="refresh-orders-btn" onClick={load}>↻ Refresh</button>
      </div>

      {loading && <div className="dash-state"><div className="dash-spinner" /><span>Loading orders…</span></div>}
      {error && <div className="dash-state glass-card" style={{ color: 'var(--color-error)' }}>{error}</div>}
      {!loading && !error && orders.length === 0 && (
        <div className="dash-state glass-card">
          <span style={{ fontSize: '2rem' }}>📋</span>
          <span>No orders yet. Orders placed by customers will appear here.</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {orders.map(o => {
          const customer = o.customerId;
          const next = NEXT_STATUS[o.status];
          return (
            <div key={o._id} className="glass-card" id={`order-card-${o._id}`} style={{ padding: 'var(--space-5) var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem' }}>
                    <span className="gradient-text">{o.token}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {new Date(o.createdAt).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <StatusBadge status={o.status} />
              </div>

              {/* Customer info */}
              {customer && (
                <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-md)', padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-4)', fontSize: '0.875rem', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                  <span>👤 <strong>{customer.name}</strong></span>
                  <span style={{ color: 'var(--text-muted)' }}>✉️ {customer.email}</span>
                  {customer.phone && <span style={{ color: 'var(--text-muted)' }}>📞 {customer.phone}</span>}
                </div>
              )}

              {/* Items */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                {(o.items || []).map((item, i) => (
                  <span key={i} style={{ fontSize: '0.8rem', background: 'var(--brand-tint)', color: 'var(--brand-amber)', padding: '3px 10px', borderRadius: 'var(--r-pill)', border: '1px solid var(--brand-border-soft)' }}>
                    {item.cylinderSize} {item.gasType} × {item.quantity}
                  </span>
                ))}
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-display)', fontWeight: 700 }} className="gradient-text">
                  {formatLKR(o.totalAmount)}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                {next && (
                  <button
                    className="btn-primary"
                    id={`status-btn-${o._id}`}
                    style={{ padding: '10px 20px', fontSize: '0.875rem' }}
                    disabled={updatingId === o._id}
                    onClick={() => handleStatusUpdate(o._id, next)}
                  >
                    {updatingId === o._id ? 'Updating…' : NEXT_LABEL[o.status]}
                  </button>
                )}
                {(o.status === 'pending' || o.status === 'ready') && (
                  <button
                    className="btn-secondary"
                    id={`cancel-btn-${o._id}`}
                    style={{ padding: '10px 20px', fontSize: '0.875rem', color: 'var(--color-error)', borderColor: 'rgba(239,68,68,0.3)' }}
                    disabled={updatingId === o._id}
                    onClick={() => handleCancel(o._id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
