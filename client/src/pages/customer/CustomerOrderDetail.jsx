import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../api/orders';
import StatusBadge from '../../components/StatusBadge';
import MapButton from '../../components/MapButton';
import { getOrderFeedback, createFeedback, updateFeedback, deleteFeedback } from '../../api/feedback';

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

        {/* Shop Info & Order Feedback */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
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
                  <MapButton lat={lat} lng={lng} address={shop.address || shop.shopName} />
                </div>
              </div>
            ) : (
              <div className="glass-card" style={{ padding: 'var(--space-5)', color: 'var(--text-muted)' }}>
                Shop details unavailable
              </div>
            )}
          </div>

          {/* Order Feedback / Rating Section */}
          <OrderFeedbackCard order={order} />
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

function OrderFeedbackCard({ order }) {
  const shopId = order.shopId?._id || order.shopId;
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState('');

  const loadFeedback = () => {
    if (!order._id) return;
    setLoading(true);
    getOrderFeedback(order._id)
      .then(d => {
        setFeedback(d);
        if (d) {
          setRating(d.rating);
          setComment(d.comment);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFeedback();
  }, [order._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    setMsg('');
    try {
      if (feedback && editing) {
        const updated = await updateFeedback(feedback._id, { rating, comment: comment.trim() });
        setFeedback(updated);
        setEditing(false);
        setMsg('Feedback updated successfully!');
      } else {
        const created = await createFeedback(shopId, {
          rating,
          comment: comment.trim(),
          orderId: order._id,
          token: order.token,
        });
        setFeedback(created);
        setEditing(false);
        setMsg('Thank you! Your review has been submitted.');
      }
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setMsg(err?.message || 'Failed to save review.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your review for this order?')) return;
    try {
      await deleteFeedback(feedback._id);
      setFeedback(null);
      setComment('');
      setRating(5);
      setEditing(false);
    } catch (err) {
      window.alert(err?.message || 'Failed to delete review.');
    }
  };

  return (
    <div>
      <h2 className="form-step-title" style={{ marginBottom: 'var(--space-4)' }}>Order Review & Rating</h2>
      <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
        {loading ? (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Loading review…</div>
        ) : feedback && !editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <div style={{ display: 'flex', gap: '4px', color: '#F5A623', fontSize: '1.2rem' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} style={{ color: s <= feedback.rating ? '#F5A623' : 'rgba(255,255,255,0.2)' }}>★</span>
                ))}
              </div>
              <div style={{ display: 'inline-flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  style={{ background: 'transparent', border: '1px solid var(--border-default)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: 'var(--r-pill)', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '4px 10px', borderRadius: 'var(--r-pill)', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, background: 'var(--bg-surface)', padding: 'var(--space-3)', borderRadius: 'var(--r-md)' }}>
              "{feedback.comment}"
            </p>

            {msg && <div style={{ fontSize: '0.8rem', color: '#22c55e' }}>✓ {msg}</div>}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {editing ? 'Update your review for this dealer:' : 'Rate your dealer and service for this order:'}
            </div>

            <div style={{ display: 'inline-flex', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.4rem',
                    color: star <= rating ? '#F5A623' : 'rgba(255, 255, 255, 0.2)',
                    padding: 0,
                  }}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="field-input"
              rows={3}
              placeholder="How was the dealer's service and gas pickup experience?"
              value={comment}
              onChange={e => setComment(e.target.value)}
              required
              style={{ width: '100%', boxSizing: 'border-box' }}
            />

            {msg && <div style={{ fontSize: '0.8rem', color: msg.startsWith('Thank') || msg.startsWith('Feedback') ? '#22c55e' : 'var(--color-error)' }}>{msg}</div>}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn-primary" disabled={submitting || !comment.trim()} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                {submitting ? 'Saving…' : editing ? 'Save Changes' : 'Submit Review'}
              </button>
              {editing && (
                <button type="button" className="btn-secondary" onClick={() => setEditing(false)} style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

