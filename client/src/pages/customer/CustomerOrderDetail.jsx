import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../api/orders';
import StatusBadge from '../../components/StatusBadge';
import MapButton from '../../components/MapButton';

function formatLKR(v) { return `Rs. ${Number(v || 0).toLocaleString('en-LK')}`; }

export default function CustomerOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getOrderById(id)
      .then(data => setOrder(data))
      .catch(err => setError(err?.message || 'Unable to load order.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCopy = () => {
    if (order?.token) {
      navigator.clipboard.writeText(order.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) return <div className="dash-state"><div className="dash-spinner" /><span>Loading order details…</span></div>;
  if (error) return (
    <div className="dash-state glass-card" style={{ color: 'var(--color-error)' }}>
      <span>{error}</span>
      <Link to="/customer/orders" className="btn-secondary">Back to Orders</Link>
    </div>
  );
  if (!order) return null;

  const shop = order.shopId;
  const [lng, lat] = shop?.location?.coordinates || [0, 0];

  return (
    <div className="order-detail-page">
      <div className="dash-page-header">
        <Link to="/customer/orders" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-4)' }}>
          ← Back to All Orders
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 className="dash-page-title">Order <span className="gradient-text">Details</span></h1>
            <p className="dash-page-subtitle">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-LK', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* ── Prominent Pickup Token Hero Card ── */}
      <div className="token-hero-box glass-card">
        <div className="token-hero-left">
          <div className="token-hero-label">Pickup Token Number</div>
          <div className="token-hero-code gradient-text">{order.token}</div>
          <div className="token-hero-id">
            Order ID: <code>{order._id}</code>
          </div>
        </div>
        <div className="token-hero-actions">
          <button
            type="button"
            className="btn-primary copy-token-btn"
            onClick={handleCopy}
            id="order-copy-token-btn"
          >
            {copied ? '✓ Token Copied' : '📋 Copy Token'}
          </button>
          <div className="token-hero-note">
            Show this token code at the counter to collect your gas cylinder.
          </div>
        </div>
      </div>

      <div className="order-detail-grid">
        {/* Order Items */}
        <div>
          <h2 className="form-step-title" style={{ marginBottom: 'var(--space-4)' }}>Ordered Cylinders</h2>
          <div className="glass-card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            {(order.items || []).map((item, i) => (
              <div key={i} className="order-item-row" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-4) 0',
                borderBottom: i < order.items.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                flexWrap: 'wrap',
                gap: 'var(--space-3)'
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>
                    {item.cylinderSize} <span className="brand-tag-small">{item.gasType} Gas</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Unit Price: {formatLKR(item.price)} × {item.quantity} {item.quantity > 1 ? 'cylinders' : 'cylinder'}
                  </div>
                </div>
                <div className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem' }}>
                  {formatLKR(item.price * item.quantity)}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-5) 0 0', fontWeight: 800, fontSize: '1.15rem', borderTop: '1px solid var(--border-default)', marginTop: 'var(--space-3)' }}>
              <span>Total Paid / Payable</span>
              <span className="gradient-text" style={{ fontSize: '1.35rem' }}>{formatLKR(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Shop Info */}
        <div>
          <h2 className="form-step-title" style={{ marginBottom: 'var(--space-4)' }}>Pickup Shop</h2>
          {shop ? (
            <div className="glass-card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                🏬 {shop.shopName}
              </div>
              {shop.address && (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  📍 {shop.address}
                </div>
              )}
              {shop.contactNumber && (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  📞 {shop.contactNumber}
                </div>
              )}
              <div style={{ marginTop: 'var(--space-3)' }}>
                <MapButton lat={lat} lng={lng} />
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: 'var(--space-5)', color: 'var(--text-muted)' }}>
              Shop details unavailable
            </div>
          )}
        </div>
      </div>

      <style>{`
        .order-detail-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .token-hero-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-5);
          padding: var(--space-6) var(--space-8);
          background: linear-gradient(135deg, rgba(232, 93, 26, 0.12), rgba(245, 166, 35, 0.06));
          border: 2px solid var(--brand-border-soft);
          border-radius: var(--r-lg);
          box-shadow: 0 8px 32px rgba(232, 93, 26, 0.15);
        }

        .token-hero-label {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--brand-amber);
          margin-bottom: 4px;
        }

        .token-hero-code {
          font-family: var(--font-display);
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          font-weight: 900;
          letter-spacing: 0.06em;
          line-height: 1.1;
          margin-bottom: 6px;
        }

        .token-hero-id {
          font-size: 0.825rem;
          color: var(--text-muted);
        }
        .token-hero-id code {
          color: var(--text-secondary);
          font-family: monospace;
          background: var(--glass-bg);
          padding: 2px 6px;
          border-radius: var(--r-sm);
        }

        .token-hero-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .token-hero-note {
          font-size: 0.8rem;
          color: var(--text-secondary);
          max-width: 260px;
          text-align: right;
          line-height: 1.3;
        }

        .copy-token-btn {
          padding: 10px 20px;
          font-size: 0.9rem;
        }

        .brand-tag-small {
          font-size: 0.75rem;
          background: var(--brand-tint);
          color: var(--brand-amber);
          padding: 2px 8px;
          border-radius: var(--r-pill);
          border: 1px solid var(--brand-border-soft);
          font-weight: 600;
          margin-left: 6px;
        }

        .order-detail-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: var(--space-6);
          align-items: start;
        }

        @media (max-width: 800px) {
          .token-hero-box { flex-direction: column; align-items: flex-start; }
          .token-hero-actions { align-items: flex-start; }
          .token-hero-note { text-align: left; }
          .order-detail-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
