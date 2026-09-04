import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllShops } from '../../api/shops';
import MapButton from '../../components/MapButton';

export default function ShopList() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllShops()
      .then(data => setShops(Array.isArray(data) ? data : []))
      .catch(() => setError('Unable to load shops. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = shops.filter(s =>
    s.shopName.toLowerCase().includes(search.toLowerCase()) ||
    (s.address || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="dash-page-header">
        <div className="section-label"><span className="dot" />Customer Portal</div>
        <h1 className="dash-page-title">Browse <span className="gradient-text">Gas Shops</span></h1>
        <p className="dash-page-subtitle">Select a shop to view available cylinders and place an order.</p>
      </div>

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <input
          type="search"
          className="field-input"
          placeholder="Search shops by name or location…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          id="shop-search-input"
          style={{ maxWidth: 400 }}
        />
      </div>

      {loading && <div className="dash-state"><div className="dash-spinner" /><span>Loading shops…</span></div>}
      {error && <div className="dash-state glass-card" style={{ color: 'var(--color-error)' }}>{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="dash-state glass-card">
          <span style={{ fontSize: '2rem' }}>🏪</span>
          <span>No shops found. Try a different search term.</span>
        </div>
      )}

      <div className="shops-grid">
        {filtered.map(shop => {
          const [lng, lat] = shop.location?.coordinates || [0, 0];
          return (
            <div key={shop._id} className="shop-card glass-card" id={`shop-card-${shop._id}`}>
              <div className="shop-card-header">
                <div className="shop-card-icon">🏪</div>
                <div>
                  <h3 className="shop-card-name">{shop.shopName}</h3>
                  {shop.address && <p className="shop-card-address">{shop.address}</p>}
                </div>
              </div>
              {shop.contactNumber && (
                <div className="shop-card-detail">
                  <span className="shop-card-detail-label">📞</span>
                  <span>{shop.contactNumber}</span>
                </div>
              )}
              <div className="shop-card-actions">
                <Link
                  to={`/customer/shops/${shop._id}`}
                  className="btn-primary"
                  id={`view-shop-${shop._id}-btn`}
                >
                  View Cylinders
                </Link>
                <MapButton lat={lat} lng={lng} label="Map" />
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .shops-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--space-5);
        }
        .shop-card { padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4); }
        .shop-card-header { display: flex; gap: var(--space-4); align-items: flex-start; }
        .shop-card-icon { font-size: 2rem; line-height: 1; }
        .shop-card-name { font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: var(--text-primary); }
        .shop-card-address { font-size: 0.8rem; color: var(--text-muted); margin-top: 2px; }
        .shop-card-detail { display: flex; align-items: center; gap: var(--space-2); font-size: 0.875rem; color: var(--text-secondary); }
        .shop-card-detail-label { color: var(--text-muted); }
        .shop-card-actions { display: flex; gap: var(--space-3); align-items: center; margin-top: auto; flex-wrap: wrap; }
      `}</style>
    </div>
  );
}
