import { useEffect, useState } from 'react';
import { getMyShop, createShop, updateMyShop } from '../../api/shops';
import { ApiError } from '../../api/client';

export default function ManageShop() {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [shopName, setShopName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const loadShop = () => {
    setLoading(true);
    getMyShop()
      .then(d => {
        setShop(d);
        setShopName(d.shopName || '');
        setContactNumber(d.contactNumber || '');
        setAddress(d.address || '');
        const [lo, la] = d.location?.coordinates || [0, 0];
        setLng(lo);
        setLat(la);
      })
      .catch(err => {
        if (err?.status === 404) setShop(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadShop(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    const payload = {
      shopName,
      contactNumber,
      address,
      location: { type: 'Point', coordinates: [Number(lng) || 0, Number(lat) || 0] },
    };
    try {
      if (shop) {
        const updated = await updateMyShop(payload);
        setShop(updated);
        setEditing(false);
        setSuccess('Shop details updated successfully!');
      } else {
        const created = await createShop(payload);
        setShop(created);
        setEditing(false);
        setSuccess('Shop created successfully!');
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="dash-state"><div className="dash-spinner" /><span>Loading shop…</span></div>;

  const [lo, la] = shop?.location?.coordinates || [0, 0];
  const mapsUrl = la && lo ? `https://www.google.com/maps?q=${la},${lo}` : null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div className="dash-page-header" style={{ marginBottom: 0 }}>
          <h1 className="dash-page-title">My <span className="gradient-text">Shop</span></h1>
          <p className="dash-page-subtitle">{shop ? 'View and update your shop details.' : 'Register your shop to start accepting orders.'}</p>
        </div>
        {shop && !editing && (
          <button className="btn-primary" id="edit-shop-btn" onClick={() => setEditing(true)}>
            ✏️ Edit Shop
          </button>
        )}
      </div>

      {success && (
        <div style={{ color: '#22C55E', fontSize: '0.875rem', padding: 'var(--space-3) var(--space-4)', background: 'rgba(34,197,94,0.08)', borderRadius: 'var(--r-md)', border: '1px solid rgba(34,197,94,0.2)', marginBottom: 'var(--space-5)' }}>
          ✓ {success}
        </div>
      )}

      {/* View mode */}
      {shop && !editing && (
        <div className="glass-card" style={{ padding: 'var(--space-6)', maxWidth: 560 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Shop Name</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem' }}>{shop.shopName}</div>
            </div>
            {shop.address && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Address</div>
                <div style={{ color: 'var(--text-secondary)' }}>📍 {shop.address}</div>
              </div>
            )}
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Contact</div>
              <div style={{ color: 'var(--text-secondary)' }}>📞 {shop.contactNumber}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Coordinates</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <span>Lat: {la} · Lng: {lo}</span>
                {mapsUrl && <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem', textDecoration: 'none' }}>View on Maps</a>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form (create or edit) */}
      {(!shop || editing) && (
        <div className="glass-card" style={{ padding: 'var(--space-6)', maxWidth: 560 }}>
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="field-group">
              <label className="field-label" htmlFor="shop-name-input">Shop Name</label>
              <input id="shop-name-input" type="text" className="field-input" value={shopName} onChange={e => setShopName(e.target.value)} required placeholder="e.g. GasGo Colombo Shop" />
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="shop-contact-input">Contact Number</label>
              <input id="shop-contact-input" type="tel" className="field-input" value={contactNumber} onChange={e => setContactNumber(e.target.value)} required placeholder="+94 77 123 4567" />
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="shop-address-input">Address</label>
              <input id="shop-address-input" type="text" className="field-input" value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. No. 42, Galle Road, Colombo 03" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="field-group">
                <label className="field-label" htmlFor="shop-lat-input">Latitude</label>
                <input id="shop-lat-input" type="number" step="any" className="field-input" value={lat} onChange={e => setLat(e.target.value)} placeholder="e.g. 6.9271" />
              </div>
              <div className="field-group">
                <label className="field-label" htmlFor="shop-lng-input">Longitude</label>
                <input id="shop-lng-input" type="number" step="any" className="field-input" value={lng} onChange={e => setLng(e.target.value)} placeholder="e.g. 79.8612" />
              </div>
            </div>
            {error && <div style={{ color: 'var(--color-error)', fontSize: '0.875rem', padding: 'var(--space-3)', background: 'rgba(239,68,68,0.08)', borderRadius: 'var(--r-md)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button type="submit" className="btn-primary" id="save-shop-btn" disabled={submitting || !shopName || !contactNumber}>
                {submitting ? 'Saving…' : shop ? 'Save Changes' : 'Create Shop'}
              </button>
              {editing && <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>}
            </div>
          </form>
        </div>
      )}

      <style>{`
        .field-group { display: flex; flex-direction: column; gap: var(--space-2); }
        .field-label { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); }
        .field-input {
          background: var(--glass-bg); border: 1px solid var(--border-default);
          border-radius: var(--r-md); color: var(--text-primary);
          padding: 10px var(--space-4); font-family: var(--font-body); font-size: 0.9rem;
          outline: none; transition: border-color var(--dur-fast);
        }
        .field-input:focus { border-color: var(--brand-primary); }
      `}</style>
    </div>
  );
}
