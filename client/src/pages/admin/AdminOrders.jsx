import { useEffect, useState } from 'react';
import { getAdminOrders } from '../../api/admin';
import StatusBadge from '../../components/StatusBadge';

function formatLKR(v) { return `Rs. ${Number(v || 0).toLocaleString('en-LK')}`; }

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    getAdminOrders()
      .then(d => setOrders(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchSearch = !search ||
      o.token?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.shopId?.shopName?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <div className="dash-page-header">
        <h1 className="dash-page-title">All <span className="gradient-text">Orders</span></h1>
        <p className="dash-page-subtitle">{orders.length} total orders in the system.</p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
        <input type="search" className="field-input" placeholder="Search token, customer, shop…" value={search}
          onChange={e => setSearch(e.target.value)} id="admin-order-search" style={{ maxWidth: 300 }} />
        <select className="field-input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} id="admin-order-filter" style={{ maxWidth: 160 }}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="ready">Ready</option>
          <option value="collected">Collected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading && <div className="dash-state"><div className="dash-spinner" /><span>Loading orders…</span></div>}

      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {filtered.length === 0 && <div className="dash-state glass-card"><span>No orders match your filters.</span></div>}
          {filtered.map(o => (
            <div key={o._id} className="glass-card" style={{ padding: 'var(--space-4) var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }} className="gradient-text">{o.token}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {o.shopId?.shopName} · {o.customerId?.name} · {new Date(o.createdAt).toLocaleDateString('en-LK')}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }} className="gradient-text">{formatLKR(o.totalAmount)}</span>
                  <StatusBadge status={o.status} />
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {(o.items || []).map((item, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', background: 'var(--brand-tint)', color: 'var(--brand-amber)', padding: '2px 8px', borderRadius: 'var(--r-pill)', border: '1px solid var(--brand-border-soft)' }}>
                    {item.cylinderSize} {item.gasType} × {item.quantity}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`.field-input{background:var(--glass-bg);border:1px solid var(--border-default);border-radius:var(--r-md);color:var(--text-primary);padding:10px var(--space-4);font-family:var(--font-body);font-size:.9rem;outline:none;transition:border-color var(--dur-fast);}.field-input:focus{border-color:var(--brand-primary);}`}</style>
    </div>
  );
}
