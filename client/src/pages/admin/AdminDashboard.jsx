import { useEffect, useState } from 'react';
import { getAdminStats } from '../../api/admin';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(d => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Customers', value: stats.totalCustomers, icon: '👤' },
    { label: 'Shop Owners', value: stats.totalOwners, icon: '🏪' },
    { label: 'Shops', value: stats.totalShops, icon: '🏬' },
    { label: 'Cylinders', value: stats.totalCylinders, icon: '⛽' },
    { label: 'Total Orders', value: stats.totalOrders, icon: '📋' },
    { label: 'Pending', value: stats.ordersByStatus?.pending || 0, icon: '⏳' },
    { label: 'Ready', value: stats.ordersByStatus?.ready || 0, icon: '✅' },
    { label: 'Collected', value: stats.ordersByStatus?.collected || 0, icon: '🏁' },
  ] : [];

  return (
    <div>
      <div className="dash-page-header">
        <div className="section-label"><span className="dot" />Admin Panel</div>
        <h1 className="dash-page-title">System <span className="gradient-text">Overview</span></h1>
        <p className="dash-page-subtitle">Monitor all users, shops, inventory and orders in the GASGO system.</p>
      </div>

      {loading ? (
        <div className="dash-state"><div className="dash-spinner" /><span>Loading system stats…</span></div>
      ) : (
        <div className="dash-stats-row">
          {statCards.map(({ label, value, icon }) => (
            <div key={label} className="stat-card glass-card">
              <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>{icon}</div>
              <div className="stat-card-value">{value}</div>
              <div className="stat-card-label">{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
