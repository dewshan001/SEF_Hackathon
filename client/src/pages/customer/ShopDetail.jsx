import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getShopById } from '../../api/shops';
import { getShopCylinders } from '../../api/cylinders';
import CylinderCard from '../../components/CylinderCard';
import MapButton from '../../components/MapButton';
import ShopFeedbackSection from '../../components/ShopFeedbackSection';
import { useCart } from '../../context/CartContext';

export default function ShopDetail() {
  const { id } = useParams();
  const { totalItems } = useCart();
  const [shop, setShop] = useState(null);
  const [cylinders, setCylinders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartConflict, setCartConflict] = useState('');

  useEffect(() => {
    Promise.all([getShopById(id), getShopCylinders(id)])
      .then(([shopData, cylData]) => {
        setShop(shopData);
        setCylinders(Array.isArray(cylData) ? cylData : []);
      })
      .catch(() => setError('Unable to load shop details.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="dash-state"><div className="dash-spinner" /><span>Loading…</span></div>;
  if (error) return <div className="dash-state glass-card" style={{ color: 'var(--color-error)' }}>{error}</div>;
  if (!shop) return <div className="dash-state glass-card"><span>Shop not found.</span></div>;

  const [lng, lat] = shop.location?.coordinates || [0, 0];

  return (
    <div>
      <div className="dash-page-header">
        <Link to="/customer/shops" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 'var(--space-4)' }}>
          ← Back to Shops
        </Link>

        <div style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 'var(--space-5)' }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div className="section-label"><span className="dot" />{shop.shopName}</div>
            {shop.address && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
              📍 {shop.address}
            </p>}
            {shop.contactNumber && <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
              📞 {shop.contactNumber}
            </p>}
            <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <MapButton lat={lat} lng={lng} address={shop.address || shop.shopName} label="View on Google Maps" />
              {totalItems > 0 && (
                <Link to="/customer/cart" className="btn-primary" style={{ fontSize: '0.875rem', padding: '10px 20px' }}>
                  🛒 View Cart ({totalItems})
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {cartConflict && (
        <div className="glass-card" style={{ padding: 'var(--space-4)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-error)', borderRadius: 'var(--r-md)', marginBottom: 'var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <span>{cartConflict}</span>
          <Link to="/customer/cart" className="btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 14px' }}>View Cart</Link>
        </div>
      )}

      <h2 className="form-step-title" style={{ marginBottom: 'var(--space-6)' }}>
        Available Gas Cylinders
      </h2>

      {cylinders.length === 0 ? (
        <div className="dash-state glass-card">
          <span style={{ fontSize: '2rem' }}>⛽</span>
          <span>No cylinders available at this shop right now.</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-5)' }}>
          {cylinders.map(cyl => (
            <CylinderCard
              key={cyl._id}
              cylinder={cyl}
              shop={shop}
              onCartConflict={(msg) => setCartConflict(msg)}
            />
          ))}
        </div>
      )}

      {/* ── Shop Feedback & Reviews Section ── */}
      <ShopFeedbackSection shopId={id} />
    </div>
  );
}
