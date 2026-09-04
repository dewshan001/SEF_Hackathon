import { useEffect, useState } from 'react';
import { getAdminUsers } from '../../api/admin';

const ROLE_BADGE = {
  ADMIN: { color: '#E74C3C', bg: 'rgba(231,76,60,0.12)', border: 'rgba(231,76,60,0.3)' },
  SHOP_OWNER: { color: '#F5A623', bg: 'rgba(245,166,35,0.12)', border: 'rgba(245,166,35,0.3)' },
  CUSTOMER: { color: '#22C55E', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)' },
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAdminUsers()
      .then(d => setUsers(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="dash-page-header">
        <h1 className="dash-page-title">All <span className="gradient-text">Users</span></h1>
        <p className="dash-page-subtitle">{users.length} registered users in the system.</p>
      </div>

      <input type="search" className="field-input" placeholder="Search by name, email or role…" value={search}
        onChange={e => setSearch(e.target.value)} id="admin-user-search" style={{ maxWidth: 360, marginBottom: 'var(--space-5)', display: 'block' }} />

      {loading && <div className="dash-state"><div className="dash-spinner" /><span>Loading users…</span></div>}

      {!loading && (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                  {['Name', 'Email', 'Phone', 'Role', 'Joined'].map(h => (
                    <th key={h} style={{ padding: 'var(--space-3) var(--space-5)', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const rb = ROLE_BADGE[u.role] || ROLE_BADGE.CUSTOMER;
                  return (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: 'var(--space-3) var(--space-5)', fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-5)', color: 'var(--text-muted)' }}>{u.email}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-5)', color: 'var(--text-muted)' }}>{u.phone || '—'}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-5)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--r-pill)', color: rb.color, background: rb.bg, border: `1px solid ${rb.border}` }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-5)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(u.createdAt).toLocaleDateString('en-LK')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="dash-state" style={{ padding: 'var(--space-10)' }}><span>No users match your search.</span></div>}
          </div>
        </div>
      )}
      <style>{`.field-input{background:var(--glass-bg);border:1px solid var(--border-default);border-radius:var(--r-md);color:var(--text-primary);padding:10px var(--space-4);font-family:var(--font-body);font-size:.9rem;outline:none;transition:border-color var(--dur-fast);}.field-input:focus{border-color:var(--brand-primary);}`}</style>
    </div>
  );
}
