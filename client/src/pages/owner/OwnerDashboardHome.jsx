import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyCylinders } from '../../api/cylinders';
import { getShopOrders } from '../../api/orders';

export default function OwnerDashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ cylinders: 0, totalQty: 0, pending: 0, ready: 0, collected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyCylinders(), getShopOrders()])
      .then(([cyls, orders]) => {
        const cylinderList = Array.isArray(cyls) ? cyls : [];
        const orderList = Array.isArray(orders) ? orders : [];
        setStats({
          cylinders: cylinderList.length,
          totalQty: cylinderList.reduce((s, c) => s + (c.availableQuantity || 0), 0),
          pending: orderList.filter(o => o.status === 'pending').length,
          ready: orderList.filter(o => o.status === 'ready').length,
          collected: orderList.filter(o => o.status === 'collected').length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="dash-page-header">
        <div className="section-label"><span className="dot" />Shop Owner Portal</div>
        <h1 className="dash-page-title">
          Welcome, <span className="gradient-text">{user?.name}</span>
        </h1>
        <p className="dash-page-subtitle">Manage your inventory, orders and shop details from here.</p>
      </div>

      {loading ? (
        <div className="dash-state"><div className="dash-spinner" /><span>Loading stats…</span></div>
      ) : (
        <div className="dash-stats-row">
          {[
            { label: 'Cylinder Types', value: stats.cylinders, icon: '⛽' },
            { label: 'Available Units', value: stats.totalQty, icon: '📦' },
            { label: 'Pending Orders', value: stats.pending, icon: '⏳' },
            { label: 'Ready', value: stats.ready, icon: '✅' },
            { label: 'Collected', value: stats.collected, icon: '🏁' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="stat-card glass-card">
              <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>{icon}</div>
              <div className="stat-card-value">{value}</div>
              <div className="stat-card-label">{label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <a href="/owner/cylinders" className="btn-primary">⛽ Manage Cylinders</a>
        <a href="/owner/orders" className="btn-secondary">📋 View Orders</a>
        <a href="/owner/shop" className="btn-secondary">🏪 Edit Shop</a>
      </div>
    </div>
  );
}
