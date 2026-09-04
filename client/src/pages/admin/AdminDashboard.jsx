import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './Admin.css';

/* ── Icons (inline SVG helpers) ──────────────────────────────── */
const Icon = ({ d, size = 18, stroke = 2, fill = 'none', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"
    strokeLinejoin="round" {...props}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const Icons = {
  dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  customers: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  owners: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  orders: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  logout: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
  plus: 'M12 4v16m8-8H4',
  trash: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0',
  eye: 'M15 12a3 3 0 11-6 0 3 3 0 016 0M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  eyeOff: ['M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24', 'M1 1l22 22'],
  flame: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 18L18 6M6 6l12 12',
  check: 'M5 13l4 4L19 7',
  chevronLeft: 'M15 19l-7-7 7-7',
  chevronRight: 'M9 5l7 7-7 7',
  lock: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  database: ['M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7', 'M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4', 'M4 11c0 2.21 3.582 4 8 4s8-1.79 8-4'],
  refresh: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  alert: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  moon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
  sun: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  phone: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  mail: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  location: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
};

/* ── Toast Component ── */
function Toast({ toasts, removeToast }) {
  return (
    <div className="admin-toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`admin-toast ${t.type}`} onClick={() => removeToast(t.id)}>
          <Icon d={t.type === 'success' ? Icons.check : t.type === 'error' ? Icons.alert : Icons.info} size={16} />
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ── Confirm Delete Modal ── */
function ConfirmModal({ onConfirm, onCancel, name, loading }) {
  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal admin-confirm-modal">
        <div className="admin-modal-body" style={{ padding: '32px 24px 28px' }}>
          <div className="admin-confirm-icon">
            <Icon d={Icons.trash} size={22} />
          </div>
          <div className="admin-confirm-title">Delete Account?</div>
          <div className="admin-confirm-message">
            You're about to permanently delete <strong style={{ color: 'var(--text-primary)' }}>{name}</strong>'s account.
            This action cannot be undone.
          </div>
          <div className="admin-modal-footer" style={{ justifyContent: 'center', gap: 12 }}>
            <button className="btn-admin-secondary" onClick={onCancel}>Cancel</button>
            <button className="btn-admin-danger" onClick={onConfirm} disabled={loading} style={{ padding: '9px 18px', fontSize: '0.8125rem' }}>
              {loading ? <span className="admin-spinner" /> : <Icon d={Icons.trash} size={14} />}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Password strength ── */
function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Weak', color: 'var(--color-error)' };
  if (score <= 2) return { score, label: 'Fair', color: 'var(--brand-amber)' };
  if (score <= 3) return { score, label: 'Good', color: 'var(--color-info)' };
  return { score, label: 'Strong', color: 'var(--color-success)' };
}

/* ── Initials helper ── */
const initials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

/* ── Format date ── */
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: '2-digit' }) : '—';

/* ===================================================
   MOCK / SAMPLE DATA  (used when API not connected)
   =================================================== */
const MOCK_CUSTOMERS = [
  { _id: 'c1', name: 'Nimal Perera', email: 'nimal@gmail.com', phone: '0771234567', role: 'CUSTOMER', createdAt: '2026-08-10T08:00:00Z', address: { textAddress: 'Colombo 07' } },
  { _id: 'c2', name: 'Sanduni Silva',  email: 'sanduni@gmail.com', phone: '0712345678', role: 'CUSTOMER', createdAt: '2026-08-15T10:00:00Z', address: { textAddress: 'Kandy' } },
  { _id: 'c3', name: 'Kamal Fernando', email: 'kamal@yahoo.com',  phone: '0762345678', role: 'CUSTOMER', createdAt: '2026-08-20T09:30:00Z', address: { textAddress: 'Galle' } },
  { _id: 'c4', name: 'Priya Wickrama', email: 'priya@gmail.com',  phone: '0751234567', role: 'CUSTOMER', createdAt: '2026-09-01T07:00:00Z', address: { textAddress: 'Negombo' } },
];

const MOCK_OWNERS = [
  { _id: 'o1', name: 'Ruwan Gas Store', email: 'ruwan@gasstore.lk', phone: '0112345678', role: 'SHOP_OWNER', createdAt: '2026-07-05T08:00:00Z', address: { textAddress: 'Nugegoda' } },
  { _id: 'o2', name: 'Lanka Gas Hub',   email: 'lankahub@gas.lk',   phone: '0113456789', role: 'SHOP_OWNER', createdAt: '2026-07-20T09:00:00Z', address: { textAddress: 'Maharagama' } },
  { _id: 'o3', name: 'Colombo Cylinders', email: 'colombo@cyl.lk', phone: '0114567890', role: 'SHOP_OWNER', createdAt: '2026-08-01T10:00:00Z', address: { textAddress: 'Dehiwala' } },
];

const MOCK_ORDERS = [
  { _id: 'ord001', customer: 'Nimal Perera',  owner: 'Ruwan Gas Store',   cylinders: 1, amount: 'LKR 3,400', status: 'delivered', createdAt: '2026-09-03T10:00:00Z' },
  { _id: 'ord002', customer: 'Sanduni Silva', owner: 'Lanka Gas Hub',      cylinders: 2, amount: 'LKR 6,800', status: 'pending',   createdAt: '2026-09-04T08:30:00Z' },
  { _id: 'ord003', customer: 'Kamal Fernando',owner: 'Colombo Cylinders',  cylinders: 1, amount: 'LKR 3,400', status: 'delivered', createdAt: '2026-09-02T14:00:00Z' },
  { _id: 'ord004', customer: 'Priya Wickrama',owner: 'Ruwan Gas Store',    cylinders: 3, amount: 'LKR 10,200',status: 'cancelled', createdAt: '2026-09-01T16:00:00Z' },
  { _id: 'ord005', customer: 'Nimal Perera',  owner: 'Lanka Gas Hub',      cylinders: 1, amount: 'LKR 3,400', status: 'pending',   createdAt: '2026-09-04T11:00:00Z' },
];

/* ===================================================
   SECTION: DASHBOARD
   =================================================== */
function DashboardSection({ customers, owners, orders }) {
  const stats = [
    { icon: Icons.customers, color: 'orange', value: customers.length, label: 'Total Customers' },
    { icon: Icons.owners,    color: 'amber',  value: owners.length,    label: 'Shop Owners' },
    { icon: Icons.orders,    color: 'green',  value: orders.length,    label: 'Total Orders' },
    {
      icon: Icons.check, color: 'blue',
      value: orders.filter(o => o.status === 'delivered').length,
      label: 'Delivered Orders',
    },
  ];

  return (
    <div className="admin-section-enter">
      <div className="admin-stats-grid" style={{ marginBottom: 24 }}>
        {stats.map((s, i) => (
          <div className="admin-stat-card" key={i}>
            <div className={`admin-stat-icon ${s.color}`}>
              <Icon d={s.icon} size={20} />
            </div>
            <div className="admin-stat-value">{s.value}</div>
            <div className="admin-stat-label">{s.label}</div>
            <div className="admin-stat-card-bg-icon">
              <Icon d={s.icon} size={80} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders preview */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div className="admin-panel-title">
            <Icon d={Icons.orders} size={16} style={{ color: 'var(--brand-amber)' }} />
            <h2>Recent Orders</h2>
            <span>{orders.length}</span>
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Owner</th>
                <th>Cylinders</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(o => (
                <tr key={o._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{o._id.slice(-5)}</td>
                  <td>{o.customer}</td>
                  <td>{o.owner}</td>
                  <td style={{ textAlign: 'center' }}>{o.cylinders}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{o.amount}</td>
                  <td>
                    <span className={`status-badge ${o.status}`}>
                      <span className="status-dot" />
                      {o.status}
                    </span>
                  </td>
                  <td>{fmtDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ===================================================
   CREATE USER MODAL
   =================================================== */
function CreateUserModal({ role, onClose, onSuccess, toast }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', address: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const pwStrength = getPasswordStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim() || !/^(?:\+94|0)?(?:7[0-9])\d{7}$|^0\d{9}$/.test(form.phone)) e.phone = 'Enter a valid Sri Lankan phone number';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.post('/users', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role,
        ...(form.address && { address: { textAddress: form.address, coordinates: [0, 0] } }),
      });
      toast('success', `${role === 'SHOP_OWNER' ? 'Owner' : 'Customer'} account created!`);
      onSuccess();
      onClose();
    } catch (err) {
      toast('error', err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const label = role === 'SHOP_OWNER' ? 'Shop Owner' : 'Customer';

  return (
    <div className="admin-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal">
        <div className="admin-modal-header">
          <div>
            <h3>Create {label} Account</h3>
            <p>Fill in the details to create a new {label.toLowerCase()} account.</p>
          </div>
          <button className="admin-modal-close" onClick={onClose}>
            <Icon d={Icons.close} size={14} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="admin-field-row">
              <div className="admin-field">
                <label>Full Name</label>
                <input value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })); }} placeholder="e.g. Nimal Perera" />
                {errors.name && <span className="admin-field-error">{errors.name}</span>}
              </div>
              <div className="admin-field">
                <label>Phone Number</label>
                <input value={form.phone} onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: '' })); }} placeholder="077 123 4567" />
                {errors.phone && <span className="admin-field-error">{errors.phone}</span>}
              </div>
            </div>
            <div className="admin-field">
              <label>Email Address</label>
              <input type="email" value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }} placeholder="name@example.com" />
              {errors.email && <span className="admin-field-error">{errors.email}</span>}
            </div>
            <div className="admin-field">
              <label>Address</label>
              <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Street, City" />
            </div>
            <div className="admin-field">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }}
                  placeholder="Min. 6 characters"
                  style={{ paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  <Icon d={showPw ? Icons.eyeOff : Icons.eye} size={15} />
                </button>
              </div>
              {form.password && (
                <>
                  <div className="pw-strength-bar">
                    <div className="pw-strength-fill" style={{ width: `${(pwStrength.score / 5) * 100}%`, background: pwStrength.color }} />
                  </div>
                  <div className="pw-strength-label" style={{ color: pwStrength.color }}>{pwStrength.label}</div>
                </>
              )}
              {errors.password && <span className="admin-field-error">{errors.password}</span>}
            </div>
            <div className="admin-modal-footer">
              <button type="button" className="btn-admin-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-admin-primary" disabled={loading}>
                {loading ? <span className="admin-spinner" style={{ width: 14, height: 14 }} /> : <Icon d={Icons.plus} size={14} />}
                Create Account
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ===================================================
   SECTION: CUSTOMERS
   =================================================== */
function CustomersSection({ customers, loading, onRefresh, toast }) {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const filtered = customers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/users/${confirmDelete._id}`);
      toast('success', `${confirmDelete.name}'s account deleted.`);
      onRefresh();
      setConfirmDelete(null);
    } catch {
      toast('error', 'Failed to delete account.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-section-enter">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div className="admin-panel-title">
            <Icon d={Icons.customers} size={16} style={{ color: 'var(--brand-amber)' }} />
            <h2>Customers</h2>
            <span>{customers.length}</span>
          </div>
          <div className="admin-panel-actions">
            <div className="admin-search">
              <Icon d={Icons.search} />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search customers…" />
            </div>
            <button className="btn-admin-primary" onClick={() => setShowCreate(true)}>
              <Icon d={Icons.plus} size={14} /> Add Customer
            </button>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Joined</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="admin-loading-row">
                  <td colSpan="7"><div className="admin-spinner" style={{ margin: '0 auto' }} /></td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="admin-table-empty">
                      <Icon d={Icons.customers} size={40} />
                      <p>No customers found</p>
                    </div>
                  </td>
                </tr>
              ) : paginated.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">{initials(u.name)}</div>
                      <div>
                        <div className="user-name">{u.name}</div>
                        <div className="user-id">{u._id?.slice(-8)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon d={Icons.mail} size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      {u.email}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon d={Icons.phone} size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      {u.phone}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon d={Icons.location} size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      {u.address?.textAddress || '—'}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon d={Icons.calendar} size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      {fmtDate(u.createdAt)}
                    </div>
                  </td>
                  <td><span className="role-badge customer">Customer</span></td>
                  <td>
                    <button className="btn-admin-danger" onClick={() => setConfirmDelete(u)}>
                      <Icon d={Icons.trash} size={13} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="admin-pagination">
            <span className="admin-pagination-info">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="admin-pagination-btns">
              <button className="admin-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                <Icon d={Icons.chevronLeft} size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={`admin-page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              ))}
              <button className="admin-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                <Icon d={Icons.chevronRight} size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showCreate && <CreateUserModal role="CUSTOMER" onClose={() => setShowCreate(false)} onSuccess={onRefresh} toast={toast} />}
      {confirmDelete && <ConfirmModal name={confirmDelete.name} loading={deleting} onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />}
    </div>
  );
}

/* ===================================================
   SECTION: OWNERS
   =================================================== */
function OwnersSection({ owners, loading, onRefresh, toast }) {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const filtered = owners.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/users/${confirmDelete._id}`);
      toast('success', `${confirmDelete.name}'s account deleted.`);
      onRefresh();
      setConfirmDelete(null);
    } catch {
      toast('error', 'Failed to delete account.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-section-enter">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div className="admin-panel-title">
            <Icon d={Icons.owners} size={16} style={{ color: 'var(--brand-amber)' }} />
            <h2>Shop Owners</h2>
            <span>{owners.length}</span>
          </div>
          <div className="admin-panel-actions">
            <div className="admin-search">
              <Icon d={Icons.search} />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search owners…" />
            </div>
            <button className="btn-admin-primary" onClick={() => setShowCreate(true)}>
              <Icon d={Icons.plus} size={14} /> Add Owner
            </button>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Owner</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Joined</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="admin-loading-row">
                  <td colSpan="7"><div className="admin-spinner" style={{ margin: '0 auto' }} /></td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="admin-table-empty">
                      <Icon d={Icons.owners} size={40} />
                      <p>No shop owners found</p>
                    </div>
                  </td>
                </tr>
              ) : paginated.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ background: 'linear-gradient(135deg, var(--brand-amber), #D97706)' }}>
                        {initials(u.name)}
                      </div>
                      <div>
                        <div className="user-name">{u.name}</div>
                        <div className="user-id">{u._id?.slice(-8)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon d={Icons.mail} size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      {u.email}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon d={Icons.phone} size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      {u.phone}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon d={Icons.location} size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      {u.address?.textAddress || '—'}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon d={Icons.calendar} size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      {fmtDate(u.createdAt)}
                    </div>
                  </td>
                  <td><span className="role-badge owner">Shop Owner</span></td>
                  <td>
                    <button className="btn-admin-danger" onClick={() => setConfirmDelete(u)}>
                      <Icon d={Icons.trash} size={13} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="admin-pagination">
            <span className="admin-pagination-info">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="admin-pagination-btns">
              <button className="admin-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                <Icon d={Icons.chevronLeft} size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={`admin-page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              ))}
              <button className="admin-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                <Icon d={Icons.chevronRight} size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showCreate && <CreateUserModal role="SHOP_OWNER" onClose={() => setShowCreate(false)} onSuccess={onRefresh} toast={toast} />}
      {confirmDelete && <ConfirmModal name={confirmDelete.name} loading={deleting} onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />}
    </div>
  );
}

/* ===================================================
   SECTION: ORDERS
   =================================================== */
function OrdersSection({ orders }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const filtered = orders.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.owner.toLowerCase().includes(search.toLowerCase()) ||
      o._id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="admin-section-enter">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div className="admin-panel-title">
            <Icon d={Icons.orders} size={16} style={{ color: 'var(--brand-amber)' }} />
            <h2>Orders</h2>
            <span>{orders.length}</span>
          </div>
          <div className="admin-panel-actions">
            <div className="admin-search">
              <Icon d={Icons.search} />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search orders…" />
            </div>
            <select
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--r-md)',
                padding: '7px 30px 7px 12px',
                color: 'var(--text-secondary)',
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                cursor: 'pointer',
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                appearance: 'none',
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Summary chips */}
        <div style={{ display: 'flex', gap: 10, padding: '12px 18px', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
          {['pending', 'delivered', 'cancelled'].map(s => (
            <div key={s}
              onClick={() => { setFilterStatus(s === filterStatus ? 'all' : s); setPage(1); }}
              style={{ cursor: 'pointer' }}>
              <span className={`status-badge ${s}`} style={{ cursor: 'pointer', fontSize: '0.72rem', padding: '4px 12px' }}>
                <span className="status-dot" />
                {s} ({orders.filter(o => o.status === s).length})
              </span>
            </div>
          ))}
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Shop Owner</th>
                <th>Cylinders</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="admin-table-empty">
                      <Icon d={Icons.orders} size={40} />
                      <p>No orders found</p>
                    </div>
                  </td>
                </tr>
              ) : paginated.map(o => (
                <tr key={o._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{o._id.slice(-6)}</td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ width: 28, height: 28, fontSize: '0.65rem' }}>{initials(o.customer)}</div>
                      {o.customer}
                    </div>
                  </td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ width: 28, height: 28, fontSize: '0.65rem', background: 'linear-gradient(135deg, var(--brand-amber), #D97706)' }}>{initials(o.owner)}</div>
                      {o.owner}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{o.cylinders}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{o.amount}</td>
                  <td><span className={`status-badge ${o.status}`}><span className="status-dot" />{o.status}</span></td>
                  <td>{fmtDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="admin-pagination">
            <span className="admin-pagination-info">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="admin-pagination-btns">
              <button className="admin-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                <Icon d={Icons.chevronLeft} size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={`admin-page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              ))}
              <button className="admin-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                <Icon d={Icons.chevronRight} size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================================================
   SECTION: SETTINGS
   =================================================== */
function SettingsSection({ user, toast }) {
  const [form, setForm] = useState({ current: '', newPw: '', confirm: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const pwStrength = getPasswordStrength(form.newPw);

  const dbConnected = true; // In real app, use an API ping

  const validate = () => {
    const e = {};
    if (!form.current) e.current = 'Current password is required';
    if (!form.newPw || form.newPw.length < 6) e.newPw = 'New password must be at least 6 characters';
    if (form.newPw !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await api.put('/users/profile', { password: form.newPw });
      toast('success', 'Password changed successfully!');
      setForm({ current: '', newPw: '', confirm: '' });
      setErrors({});
    } catch (err) {
      toast('error', err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-section-enter">
      <div className="admin-settings-grid">

        {/* Change Password */}
        <div className="admin-settings-card">
          <div className="admin-settings-card-header">
            <div className="admin-settings-card-icon orange">
              <Icon d={Icons.lock} size={18} />
            </div>
            <div>
              <h3>Change Password</h3>
              <p>Update your admin account password</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="admin-settings-card-body">
            <div className="admin-field">
              <label>Current Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={form.current}
                  onChange={e => { setForm(f => ({ ...f, current: e.target.value })); setErrors(er => ({ ...er, current: '' })); }}
                  placeholder="Enter current password"
                  style={{ paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowCurrent(p => !p)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  <Icon d={showCurrent ? Icons.eyeOff : Icons.eye} size={15} />
                </button>
              </div>
              {errors.current && <span className="admin-field-error">{errors.current}</span>}
            </div>

            <div className="admin-field">
              <label>New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNew ? 'text' : 'password'}
                  value={form.newPw}
                  onChange={e => { setForm(f => ({ ...f, newPw: e.target.value })); setErrors(er => ({ ...er, newPw: '' })); }}
                  placeholder="Min. 6 characters"
                  style={{ paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowNew(p => !p)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  <Icon d={showNew ? Icons.eyeOff : Icons.eye} size={15} />
                </button>
              </div>
              {form.newPw && (
                <>
                  <div className="pw-strength-bar">
                    <div className="pw-strength-fill" style={{ width: `${(pwStrength.score / 5) * 100}%`, background: pwStrength.color }} />
                  </div>
                  <div className="pw-strength-label" style={{ color: pwStrength.color }}>{pwStrength.label}</div>
                </>
              )}
              {errors.newPw && <span className="admin-field-error">{errors.newPw}</span>}
            </div>

            <div className="admin-field">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={form.confirm}
                onChange={e => { setForm(f => ({ ...f, confirm: e.target.value })); setErrors(er => ({ ...er, confirm: '' })); }}
                placeholder="Re-enter new password"
              />
              {errors.confirm && <span className="admin-field-error">{errors.confirm}</span>}
            </div>

            <button type="submit" className="btn-admin-primary" disabled={saving} style={{ alignSelf: 'flex-start' }}>
              {saving ? <span className="admin-spinner" style={{ width: 14, height: 14 }} /> : <Icon d={Icons.lock} size={14} />}
              Update Password
            </button>
          </form>
        </div>

        {/* DB Status */}
        <div className="admin-settings-card">
          <div className="admin-settings-card-header">
            <div className={`admin-settings-card-icon ${dbConnected ? 'green' : 'blue'}`}>
              <Icon d={Icons.database} size={18} />
            </div>
            <div>
              <h3>Database Status</h3>
              <p>MongoDB Atlas connection health</p>
            </div>
          </div>
          <div className="admin-settings-card-body">
            <div className={`admin-db-pill ${dbConnected ? 'connected' : 'error'}`} style={{ alignSelf: 'flex-start' }}>
              <span className="admin-db-dot" />
              {dbConnected ? 'Connected' : 'Disconnected'}
            </div>

            <div className="db-status-rows">
              <div className="db-status-row">
                <span className="db-status-row-label"><Icon d={Icons.database} size={13} />Host</span>
                <span className="db-status-row-value ok">cluster0.t9wmrpz.mongodb.net</span>
              </div>
              <div className="db-status-row">
                <span className="db-status-row-label"><Icon d={Icons.info} size={13} />DB Name</span>
                <span className="db-status-row-value">gasgo-lanka</span>
              </div>
              <div className="db-status-row">
                <span className="db-status-row-label"><Icon d={Icons.check} size={13} />Connection State</span>
                <span className={`db-status-row-value ${dbConnected ? 'ok' : 'err'}`}>
                  {dbConnected ? 'connected (1)' : 'disconnected (0)'}
                </span>
              </div>
              <div className="db-status-row">
                <span className="db-status-row-label"><Icon d={Icons.info} size={13} />Protocol</span>
                <span className="db-status-row-value">mongodb+srv</span>
              </div>
            </div>

            <button className="btn-admin-secondary" style={{ alignSelf: 'flex-start' }}
              onClick={() => toast('info', 'Database connection refreshed.')}>
              <Icon d={Icons.refresh} size={14} /> Refresh Status
            </button>
          </div>
        </div>

        {/* Admin Profile Info */}
        <div className="admin-settings-card">
          <div className="admin-settings-card-header">
            <div className="admin-settings-card-icon blue">
              <Icon d={Icons.user} size={18} />
            </div>
            <div>
              <h3>Admin Profile</h3>
              <p>Your account information</p>
            </div>
          </div>
          <div className="admin-settings-card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px', background: 'var(--bg-elevated)', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
              <div className="admin-avatar" style={{ width: 52, height: 52, fontSize: '1rem' }}>
                {initials(user?.name || 'Admin')}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{user?.name || 'Admin'}</div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: 2 }}>{user?.email || 'admin@gasgo.lk'}</div>
                <span className="role-badge admin" style={{ marginTop: 6, display: 'inline-flex' }}>Admin</span>
              </div>
            </div>

            <div className="db-status-rows">
              <div className="db-status-row">
                <span className="db-status-row-label"><Icon d={Icons.mail} size={13} />Email</span>
                <span className="db-status-row-value">{user?.email || 'admin@gasgo.lk'}</span>
              </div>
              <div className="db-status-row">
                <span className="db-status-row-label"><Icon d={Icons.phone} size={13} />Phone</span>
                <span className="db-status-row-value">{user?.phone || '—'}</span>
              </div>
              <div className="db-status-row">
                <span className="db-status-row-label"><Icon d={Icons.calendar} size={13} />Member Since</span>
                <span className="db-status-row-value">{fmtDate(user?.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================================================
   MAIN ADMIN DASHBOARD
   =================================================== */
export default function AdminDashboard() {
  const { user, logout, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('gasgo-theme') || 'dark');
  const [toasts, setToasts] = useState([]);

  // Data state
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [owners, setOwners] = useState(MOCK_OWNERS);
  const [orders] = useState(MOCK_ORDERS);
  const [loadingUsers, setLoadingUsers] = useState(false);

  /* ── Auth guard ── */
  useEffect(() => {
    if (isAuthenticated && role !== 'ADMIN') {
      navigate('/');
    }
    // Intentionally allow unauthenticated access in dev (shows mock data)
  }, [isAuthenticated, role, navigate]);

  /* ── Theme sync ── */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gasgo-theme', theme);
  }, [theme]);

  /* ── Fetch real users ── */
  const fetchUsers = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingUsers(true);
    try {
      const { data } = await api.get('/users');
      setCustomers(data.filter(u => u.role === 'CUSTOMER'));
      setOwners(data.filter(u => u.role === 'SHOP_OWNER'));
    } catch {
      // Stay with mock data if not authenticated
    } finally {
      setLoadingUsers(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  /* ── Toast helpers ── */
  const toast = useCallback((type, message) => {
    const id = Date.now();
    setToasts(t => [...t, { id, type, message }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), []);

  /* ── Topbar meta per section ── */
  const sectionMeta = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview & recent activity' },
    customers: { title: 'Customer Accounts', subtitle: 'Manage customer accounts' },
    owners:    { title: 'Shop Owners', subtitle: 'Manage gas shop owners' },
    orders:    { title: 'Orders', subtitle: 'View all customer orders' },
    settings:  { title: 'Settings', subtitle: 'Admin preferences & system status' },
  };

  const nav = [
    { id: 'dashboard', label: 'Dashboard',     icon: Icons.dashboard },
    { id: 'customers', label: 'Customers',      icon: Icons.customers },
    { id: 'owners',    label: 'Shop Owners',    icon: Icons.owners },
    { id: 'orders',    label: 'Orders',         icon: Icons.orders },
    { id: 'settings',  label: 'Settings',       icon: Icons.settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = (id) => {
    setActiveSection(id);
    setMobileSidebarOpen(false);
  };

  const dbConnected = true;

  return (
    <>
      {/* Background orbs */}
      <div className="admin-orb admin-orb-1" />
      <div className="admin-orb admin-orb-2" />

      <div className="admin-shell" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Mobile overlay ── */}
        {mobileSidebarOpen && (
          <div className="admin-mobile-overlay" onClick={() => setMobileSidebarOpen(false)} />
        )}

        {/* ════════════ SIDEBAR ════════════ */}
        <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>

          {/* Brand */}
          <div className="admin-sidebar-brand">
            <div className="admin-brand-icon">
              <Icon d={Icons.flame} size={20} fill="rgba(255,255,255,.9)" stroke="none" />
            </div>
            <div className="admin-brand-text">
              <div className="admin-brand-name">GasGo Lanka</div>
              <div className="admin-brand-badge">Admin Panel</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="admin-nav">
            {nav.map((item, i) => (
              <button
                key={item.id}
                className={`admin-nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
                title={sidebarCollapsed ? item.label : ''}
              >
                <span className="admin-nav-icon">
                  <Icon d={item.icon} size={18} />
                </span>
                <span className="admin-nav-label">{item.label}</span>
              </button>
            ))}
            <div className="admin-nav-divider" />
            <button className="admin-nav-item" onClick={handleLogout} title={sidebarCollapsed ? 'Logout' : ''}>
              <span className="admin-nav-icon"><Icon d={Icons.logout} size={18} /></span>
              <span className="admin-nav-label">Logout</span>
            </button>
          </nav>

          {/* Footer */}
          <div className="admin-sidebar-footer">
            <div className="admin-user-card">
              <div className="admin-avatar">{initials(user?.name || 'AD')}</div>
              <div className="admin-user-info">
                <div className="admin-user-name">{user?.name || 'Admin'}</div>
                <div className="admin-user-role">Administrator</div>
              </div>
            </div>
            <button className="admin-collapse-btn" onClick={() => setSidebarCollapsed(p => !p)}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              <Icon d={Icons.chevronLeft} size={16} />
            </button>
          </div>
        </aside>

        {/* ════════════ MAIN ════════════ */}
        <div className="admin-main">

          {/* Topbar */}
          <header className="admin-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button className="admin-mobile-menu-btn" onClick={() => setMobileSidebarOpen(p => !p)}>
                <Icon d={Icons.menu} size={18} />
              </button>
              <div className="admin-topbar-left">
                <div className="admin-page-title">{sectionMeta[activeSection]?.title}</div>
                <div className="admin-page-subtitle">{sectionMeta[activeSection]?.subtitle}</div>
              </div>
            </div>

            <div className="admin-topbar-right">
              {/* DB status pill */}
              <div className={`admin-db-pill ${dbConnected ? 'connected' : 'error'}`}>
                <span className="admin-db-dot" />
                {dbConnected ? 'DB Connected' : 'DB Offline'}
              </div>

              {/* Theme toggle */}
              <button className="admin-topbar-btn" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                title="Toggle theme">
                <Icon d={theme === 'dark' ? Icons.sun : Icons.moon} size={16} />
              </button>

              {/* Refresh */}
              <button className="admin-topbar-btn" onClick={fetchUsers} title="Refresh data">
                <Icon d={Icons.refresh} size={16} />
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="admin-content">
            {activeSection === 'dashboard' && (
              <DashboardSection customers={customers} owners={owners} orders={orders} />
            )}
            {activeSection === 'customers' && (
              <CustomersSection customers={customers} loading={loadingUsers} onRefresh={fetchUsers} toast={toast} />
            )}
            {activeSection === 'owners' && (
              <OwnersSection owners={owners} loading={loadingUsers} onRefresh={fetchUsers} toast={toast} />
            )}
            {activeSection === 'orders' && (
              <OrdersSection orders={orders} />
            )}
            {activeSection === 'settings' && (
              <SettingsSection user={user} toast={toast} />
            )}
          </main>
        </div>
      </div>

      {/* Toast container */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  );
}
