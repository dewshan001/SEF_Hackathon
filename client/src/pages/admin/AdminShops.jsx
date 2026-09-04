import { useEffect, useState } from 'react';
import { getAdminShops } from '../../api/admin';
import MapButton from '../../components/MapButton';

export default function AdminShops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminShops()
      .then(d => setShops(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="dash-page-header">
        <h1 className="dash-page-title">All <span className="gradient-text">Shops</span></h1>
        <p className="dash-page-subtitle">{shops.length} shops registered in the system.</p>
      </div>

      {loading && <div className="dash-state"><div className="dash-spinner" /><span>Loading shops…</span></div>}

      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
          {shops.map(s => {
            const [lo, la] = s.location?.coordinates || [0, 0];
            return (
              <div key={s._id} className="glass-card" style={{ padding: 'var(--space-5)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: 'var(--space-3)' }}>{s.shopName}</div>
                {s.address && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>📍 {s.address}</div>}
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>📞 {s.contactNumber}</div>
                {s.ownerId && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                  Owner: <strong>{s.ownerId.name}</strong> ({s.ownerId.email})
                </div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: 'var(--r-pill)', background: s.isActive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', color: s.isActive ? '#22C55E' : '#EF4444', border: `1px solid ${s.isActive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, fontWeight: 700 }}>
                    {s.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <MapButton lat={la} lng={lo} label="Map" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
