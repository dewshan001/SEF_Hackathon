import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyShop } from '../../api/shops';
import { getShopFeedbacks } from '../../api/feedback';
import { useAuth } from '../../context/AuthContext';

function StarDisplay({ rating }) {
  return (
    <div style={{ display: 'inline-flex', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          style={{
            fontSize: '1.2rem',
            color: star <= rating ? '#F5A623' : 'rgba(255, 255, 255, 0.2)',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function OwnerFeedbacks() {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const myShop = await getMyShop();
      setShop(myShop);
      if (myShop && myShop._id) {
        const fbList = await getShopFeedbacks(myShop._id);
        setFeedbacks(Array.isArray(fbList) ? fbList : []);
      }
    } catch (err) {
      if (err?.status === 404) {
        setShop(null);
      } else {
        setError('Unable to load reviews for your shop.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalReviews = feedbacks.length;
  const avgRating = totalReviews > 0
    ? (feedbacks.reduce((acc, f) => acc + (f.rating || 5), 0) / totalReviews).toFixed(1)
    : 0;

  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  feedbacks.forEach(f => {
    const r = Math.min(5, Math.max(1, Math.round(f.rating || 5)));
    starCounts[r] = (starCounts[r] || 0) + 1;
  });

  const filtered = feedbacks.filter(f => {
    if (filterRating !== 'all' && Math.round(f.rating) !== Number(filterRating)) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const name = f.customerId?.name?.toLowerCase() || '';
      const comment = f.comment?.toLowerCase() || '';
      return name.includes(q) || comment.includes(q);
    }
    return true;
  });

  return (
    <div>
      <div className="dash-page-header">
        <div className="section-label"><span className="dot" />Shop Owner Portal</div>
        <h1 className="dash-page-title">
          Customer <span className="gradient-text">Feedbacks & Reviews</span>
        </h1>
        <p className="dash-page-subtitle">
          View all ratings, comments, and customer satisfaction metrics for {shop?.shopName || 'your store'}.
        </p>
      </div>

      {loading && (
        <div className="dash-state">
          <div className="dash-spinner" />
          <span>Loading customer reviews…</span>
        </div>
      )}

      {error && (
        <div className="dash-state glass-card" style={{ color: 'var(--color-error)' }}>
          {error}
        </div>
      )}

      {!loading && !shop && (
        <div className="dash-state glass-card">
          <span style={{ fontSize: '2rem' }}>🏪</span>
          <span>You haven't set up your shop yet.</span>
          <Link to="/owner/shop" className="btn-primary" style={{ marginTop: 'var(--space-3)' }}>
            Register Shop
          </Link>
        </div>
      )}

      {!loading && shop && (
        <>
          {/* Summary stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
            <div className="glass-card" style={{ padding: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 900, lineHeight: 1, color: '#f5a623' }}>
                  {totalReviews > 0 ? avgRating : '—'}
                </div>
                <div style={{ marginTop: 6 }}>
                  <StarDisplay rating={Math.round(avgRating) || 5} />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Overall Rating
                </div>
              </div>

              <div style={{ flex: 1, borderLeft: '1px solid var(--border-subtle)', paddingLeft: 'var(--space-5)' }}>
                {[5, 4, 3, 2, 1].map(stars => {
                  const count = starCounts[stars] || 0;
                  const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', marginBottom: 4 }}>
                      <span style={{ minWidth: '32px', color: 'var(--text-secondary)' }}>{stars} ★</span>
                      <div style={{ flex: 1, height: '6px', background: 'var(--bg-surface)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: '#f5a623', borderRadius: '3px' }} />
                      </div>
                      <span style={{ minWidth: '24px', textAlign: 'right', color: 'var(--text-muted)' }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-3)' }}>
              <div className="section-label" style={{ marginBottom: 0 }}>🏪 {shop.shopName}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {totalReviews} Total Customer {totalReviews === 1 ? 'Review' : 'Reviews'}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Customers can post feedback when browsing your shop or collecting cylinders.
              </p>
              <div style={{ marginTop: 'auto' }}>
                <Link to={`/customer/shops/${shop._id}`} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                  👁️ View Public Shop Page
                </Link>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="glass-card" style={{ padding: 'var(--space-4) var(--space-6)', marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Filter by:</span>
              <button
                type="button"
                onClick={() => setFilterRating('all')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--r-pill)',
                  border: filterRating === 'all' ? '1px solid var(--brand-primary)' : '1px solid var(--border-default)',
                  background: filterRating === 'all' ? 'var(--brand-primary)' : 'transparent',
                  color: filterRating === 'all' ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                }}
              >
                All ({feedbacks.length})
              </button>
              {[5, 4, 3, 2, 1].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFilterRating(r.toString())}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--r-pill)',
                    border: filterRating === r.toString() ? '1px solid #f5a623' : '1px solid var(--border-default)',
                    background: filterRating === r.toString() ? 'rgba(245, 166, 35, 0.15)' : 'transparent',
                    color: filterRating === r.toString() ? '#f5a623' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                  }}
                >
                  {r} ★ ({starCounts[r] || 0})
                </button>
              ))}
            </div>

            <div style={{ minWidth: 220 }}>
              <input
                type="search"
                className="field-input"
                placeholder="Search reviews or customer…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ padding: '8px 14px', fontSize: '0.85rem', width: '100%', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Feedback list */}
          {filtered.length === 0 ? (
            <div className="dash-state glass-card">
              <span style={{ fontSize: '2.5rem' }}>💬</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {totalReviews === 0 ? 'No customer feedback yet' : 'No reviews match your filter'}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {totalReviews === 0
                  ? 'When customers buy gas from your shop, their ratings and reviews will appear here.'
                  : 'Try selecting a different star rating or clearing your search.'}
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {filtered.map(fb => (
                <div
                  key={fb._id}
                  className="glass-card"
                  style={{
                    padding: 'var(--space-6)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-3)',
                    transition: 'transform var(--dur-fast), border-color var(--dur-fast)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'var(--brand-tint)',
                          color: 'var(--brand-amber)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '1rem',
                          border: '1px solid var(--brand-border-soft)',
                        }}
                      >
                        {fb.customerId?.name?.[0]?.toUpperCase() || 'C'}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.975rem', color: 'var(--text-primary)' }}>
                            {fb.customerId?.name || 'Customer'}
                          </span>
                          <span style={{ fontSize: '0.725rem', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '2px 8px', borderRadius: 'var(--r-pill)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                            Verified Customer
                          </span>
                        </div>
                        {fb.customerId?.email && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {fb.customerId.email}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <StarDisplay rating={fb.rating || 5} />
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {new Date(fb.createdAt).toLocaleDateString('en-LK', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-4)', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)', marginTop: 'var(--space-2)' }}>
                    <p style={{ margin: 0, fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      "{fb.comment}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
