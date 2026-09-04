import { useEffect, useState } from 'react';
import { getMyCylinders, createCylinder, updateCylinder, deleteCylinder, updateCylinderStock } from '../../api/cylinders';
import { ApiError } from '../../api/client';

const CYLINDER_SIZES = ['5kg', '9kg', '18kg', '45kg', '90kg'];
const SIZE_LABELS = {
  '5kg': '5 kg – Compact',
  '9kg': '9 kg – Standard Domestic',
  '18kg': '18 kg – Forklift / Commercial',
  '45kg': '45 kg – Industrial',
  '90kg': '90 kg – Commercial Max',
};

const GAS_BRANDS = ['Litro', 'Laugfs'];

function CylinderForm({ cylinder, onSaved, onCancel }) {
  const isEdit = Boolean(cylinder);
  const [sizeKg, setSizeKg] = useState(cylinder?.sizeKg || CYLINDER_SIZES[0]);
  const [gasType, setGasType] = useState(cylinder?.gasType || 'Litro');
  const [price, setPrice] = useState(cylinder?.price ?? '');
  const [availableQuantity, setAvailableQuantity] = useState(cylinder?.availableQuantity ?? 10);
  const [description, setDescription] = useState(cylinder?.description || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!price || Number(price) <= 0) {
      setError('Please enter a valid price in LKR (e.g. 2500).');
      return;
    }

    setSubmitting(true);
    setError('');

    const payload = {
      sizeKg,
      gasType,
      price: Number(price),
      availableQuantity: Math.max(0, parseInt(availableQuantity, 10) || 0),
      description: description.trim(),
    };

    try {
      if (isEdit) {
        await updateCylinder(cylinder._id, payload);
      } else {
        await createCylinder(payload);
      }
      onSaved(isEdit ? 'Cylinder updated successfully!' : `Added ${sizeKg} ${gasType} cylinder to inventory!`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save cylinder. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div className="form-row">
        <div className="field-group">
          <label className="field-label" htmlFor="cyl-size-select">Cylinder Size *</label>
          <select id="cyl-size-select" className="field-input custom-select" value={sizeKg} onChange={e => setSizeKg(e.target.value)}>
            {CYLINDER_SIZES.map(s => (
              <option key={s} value={s}>{SIZE_LABELS[s] || s}</option>
            ))}
          </select>
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor="cyl-brand-select">Gas Brand / Type *</label>
          <select id="cyl-brand-select" className="field-input custom-select" value={gasType} onChange={e => setGasType(e.target.value)}>
            {GAS_BRANDS.map(b => (
              <option key={b} value={b}>{b} Gas</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="field-group">
          <label className="field-label" htmlFor="cyl-price-input">Price (LKR / Rs.) *</label>
          <input
            id="cyl-price-input"
            type="number"
            min="1"
            className="field-input"
            placeholder="e.g. 2980"
            value={price}
            onChange={e => { setError(''); setPrice(e.target.value); }}
            required
          />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor="cyl-qty-input">Available Quantity (Stock) *</label>
          <input
            id="cyl-qty-input"
            type="number"
            min="0"
            className="field-input"
            value={availableQuantity}
            onChange={e => setAvailableQuantity(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="field-group">
        <label className="field-label" htmlFor="cyl-desc-input">Description / Notes <span style={{ color: 'var(--text-muted)' }}>optional</span></label>
        <textarea
          id="cyl-desc-input"
          className="field-input"
          rows={2}
          placeholder="e.g. Domestic refillable cylinder, PUCSL approved"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      {error && (
        <div className="form-error-box">
          <span>⚠️</span> {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
        <button type="submit" className="btn-primary" id="cyl-save-btn" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Cylinder to Shop'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function StockStatus({ qty }) {
  if (qty === 0) return <span className="status-badge-stock out">Out of Stock</span>;
  if (qty <= 5) return <span className="status-badge-stock low">Low Stock ({qty})</span>;
  return <span className="status-badge-stock in">In Stock ({qty})</span>;
}

export default function ManageCylinders() {
  const [cylinders, setCylinders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState('');

  const load = () => {
    setLoading(true);
    getMyCylinders()
      .then(d => setCylinders(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this cylinder? Customers will no longer be able to order it.')) return;
    try {
      await deleteCylinder(id);
      showNotification('Cylinder removed from shop inventory.');
      load();
    } catch {
      window.alert('Could not delete. Please try again.');
    }
  };

  const handleQuickQty = async (cyl, newQty) => {
    if (newQty < 0) return;
    setUpdatingId(cyl._id);
    setCylinders(prev => prev.map(c => c._id === cyl._id ? { ...c, availableQuantity: newQty } : c));
    try {
      await updateCylinderStock(cyl._id, newQty);
    } catch {
      window.alert('Failed to update quantity.');
      load();
    } finally {
      setUpdatingId(null);
    }
  };

  const totalStock = cylinders.reduce((acc, c) => acc + (c.availableQuantity || 0), 0);
  const lowStockCount = cylinders.filter(c => c.availableQuantity > 0 && c.availableQuantity <= 5).length;
  const outOfStockCount = cylinders.filter(c => c.availableQuantity === 0).length;

  return (
    <div className="manage-cylinders-page">
      {/* Toast banner */}
      {toast && (
        <div className="toast-banner">
          <span>✓</span> {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="cyl-header-row">
        <div className="dash-page-header" style={{ marginBottom: 0 }}>
          <h1 className="dash-page-title">Manage <span className="gradient-text">Cylinders</span></h1>
          <p className="dash-page-subtitle">Add and manage Litro & Laugfs gas cylinder stock in real time.</p>
        </div>
        {!showForm && (
          <button className="btn-primary" id="add-cylinder-btn" onClick={() => { setEditing(null); setShowForm(true); }}>
            + Add Cylinder
          </button>
        )}
      </div>

      {/* Summary Stat Cards */}
      <div className="stats-container">
        <div className="stat-box">
          <div className="stat-title">Cylinder Varieties</div>
          <div className="stat-number color-amber">{cylinders.length}</div>
          <div className="stat-sub">Active in catalog</div>
        </div>
        <div className="stat-box">
          <div className="stat-title">Total Units in Stock</div>
          <div className="stat-number color-green">{totalStock}</div>
          <div className="stat-sub">Ready for ordering</div>
        </div>
        <div className="stat-box">
          <div className="stat-title">Low / Out of Stock</div>
          <div className={`stat-number ${outOfStockCount > 0 ? 'color-red' : lowStockCount > 0 ? 'color-orange' : 'color-normal'}`}>
            {outOfStockCount + lowStockCount}
          </div>
          <div className="stat-sub">{outOfStockCount > 0 ? `${outOfStockCount} out of stock` : 'Inventory healthy'}</div>
        </div>
      </div>

      {/* Form Drawer / Card */}
      {(showForm || editing) && (
        <div className="form-card-container">
          <div className="form-card-header">
            <h3 className="form-step-title" style={{ margin: 0 }}>
              {editing ? `Edit ${editing.sizeKg} ${editing.gasType} Cylinder` : 'Add New Cylinder to Shop'}
            </h3>
            <button type="button" className="close-form-btn" onClick={() => { setShowForm(false); setEditing(null); }}>✕</button>
          </div>
          <CylinderForm
            cylinder={editing}
            onSaved={(msg) => {
              setShowForm(false);
              setEditing(null);
              showNotification(msg);
              load();
            }}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      )}

      {loading && <div className="dash-state"><div className="dash-spinner" /><span>Loading inventory…</span></div>}

      {!loading && cylinders.length === 0 && (
        <div className="dash-state empty-state-box">
          <span style={{ fontSize: '3rem' }}>⛽</span>
          <h3 style={{ margin: 'var(--space-2) 0', color: 'var(--text-primary)' }}>No cylinders in shop inventory</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-5)' }}>Add your Litro or Laugfs cylinders so customers can order online.</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Your First Cylinder</button>
        </div>
      )}

      {!loading && cylinders.length > 0 && (
        <div className="table-wrapper">
          <table className="cylinders-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Brand / Gas Type</th>
                <th>Price (LKR)</th>
                <th>Available Stock</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cylinders.map(c => (
                <tr key={c._id} id={`cyl-row-${c._id}`}>
                  <td>
                    <span className="cyl-size-name">{SIZE_LABELS[c.sizeKg] || c.sizeKg}</span>
                  </td>
                  <td>
                    <span className={`brand-badge ${c.gasType?.toLowerCase().includes('litro') ? 'brand-litro' : 'brand-laugfs'}`}>
                      {c.gasType?.toLowerCase().includes('litro') ? '🟦 Litro Gas' : '🟨 Laugfs Gas'}
                    </span>
                  </td>
                  <td>
                    <span className="cyl-price-val">Rs. {Number(c.price).toLocaleString('en-LK')}</span>
                  </td>
                  <td>
                    <div className="cyl-qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => handleQuickQty(c, c.availableQuantity - 1)}
                        disabled={c.availableQuantity <= 0 || updatingId === c._id}
                        title="Reduce stock by 1"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        className="qty-input"
                        value={c.availableQuantity}
                        min="0"
                        onChange={e => handleQuickQty(c, Math.max(0, parseInt(e.target.value, 10) || 0))}
                        disabled={updatingId === c._id}
                      />
                      <button
                        className="qty-btn"
                        onClick={() => handleQuickQty(c, c.availableQuantity + 1)}
                        disabled={updatingId === c._id}
                        title="Increase stock by 1"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    <StockStatus qty={c.availableQuantity} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        className="action-btn edit-btn"
                        id={`edit-cyl-${c._id}`}
                        onClick={() => { setEditing(c); setShowForm(false); window.scrollTo({ top: 120, behavior: 'smooth' }); }}
                      >
                        Edit
                      </button>
                      <button
                        className="action-btn del-btn"
                        id={`del-cyl-${c._id}`}
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .manage-cylinders-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .cyl-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: var(--space-4);
        }

        /* ── Toast Banner ── */
        .toast-banner {
          padding: 12px 18px;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.35);
          border-radius: var(--r-md);
          color: #22c55e;
          font-weight: 600;
          font-size: 0.925rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* ── Top Stat Cards ── */
        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: var(--space-5);
        }

        .stat-box {
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--r-lg);
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: 6px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          transition: transform var(--dur-fast), border-color var(--dur-fast);
        }

        .stat-box:hover {
          border-color: var(--brand-border-soft);
          transform: translateY(-2px);
        }

        .stat-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .stat-number {
          font-family: var(--font-display);
          font-size: 2.25rem;
          font-weight: 800;
          line-height: 1.1;
        }

        .stat-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .color-amber { color: var(--brand-amber); }
        .color-green { color: #22c55e; }
        .color-orange { color: #f97316; }
        .color-red { color: #ef4444; }
        .color-normal { color: var(--text-primary); }

        /* ── Form Card ── */
        .form-card-container {
          background: var(--bg-surface);
          border: 1px solid var(--border-strong);
          border-radius: var(--r-lg);
          padding: var(--space-7);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
        }

        .form-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-5);
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--border-subtle);
        }

        .close-form-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.25rem;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: var(--r-sm);
        }
        .close-form-btn:hover { color: var(--text-primary); background: var(--glass-bg); }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-5);
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .field-label {
          font-size: 0.825rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .field-input {
          background: var(--bg-elevated, #10192e);
          border: 1.5px solid var(--border-default);
          border-radius: var(--r-md);
          color: var(--text-primary, #ffffff);
          padding: 12px 16px;
          font-family: var(--font-body);
          font-size: 0.95rem;
          outline: none;
          transition: border-color var(--dur-fast), box-shadow var(--dur-fast);
        }

        .field-input:focus {
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 3px rgba(232, 93, 26, 0.18);
        }

        /* ── Select Dropdowns in Dark Mode ── */
        select.custom-select {
          background-color: var(--bg-elevated, #10192e) !important;
          color: var(--text-primary, #ffffff) !important;
          cursor: pointer;
          font-weight: 500;
        }

        select.custom-select option {
          background-color: #0b1324 !important;
          color: #ffffff !important;
          padding: 12px;
          font-size: 0.95rem;
        }

        [data-theme="light"] select.custom-select option {
          background-color: #ffffff !important;
          color: #111827 !important;
        }

        .form-error-box {
          color: var(--color-error);
          font-size: 0.875rem;
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.1);
          border-radius: var(--r-md);
          border: 1px solid rgba(239, 68, 68, 0.25);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* ── Table Styling ── */
        .table-wrapper {
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--r-lg);
          overflow-x: auto;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
        }

        .cylinders-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          min-width: 680px;
        }

        .cylinders-table th {
          padding: 16px 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid var(--border-default);
        }

        .cylinders-table td {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-subtle);
          vertical-align: middle;
          color: var(--text-primary);
          font-size: 0.925rem;
        }

        .cylinders-table tr:last-child td { border-bottom: none; }
        .cylinders-table tr:hover td { background: rgba(255, 255, 255, 0.03); }

        .cyl-size-name {
          font-family: var(--font-display);
          font-weight: 700;
          color: var(--text-primary);
        }

        .brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--r-pill);
        }

        .brand-litro {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .brand-laugfs {
          background: rgba(245, 166, 35, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 166, 35, 0.3);
        }

        .cyl-price-val {
          font-family: var(--font-display);
          font-weight: 700;
          color: var(--text-primary);
        }

        /* ── Inline Quantity Controls ── */
        .cyl-qty-control {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .qty-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--r-sm);
          background: var(--bg-elevated, #1a253c);
          border: 1px solid var(--border-default);
          color: var(--text-primary);
          font-weight: bold;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--dur-fast);
        }

        .qty-btn:hover:not(:disabled) {
          border-color: var(--brand-primary);
          color: var(--brand-primary);
          background: var(--brand-tint);
        }

        .qty-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .qty-input {
          width: 56px;
          height: 32px;
          text-align: center;
          background: var(--bg-elevated, #10192e);
          border: 1px solid var(--border-default);
          border-radius: var(--r-sm);
          color: var(--text-primary);
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.95rem;
        }

        /* ── Stock status badges ── */
        .status-badge-stock {
          display: inline-block;
          font-size: 0.775rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--r-pill);
        }

        .status-badge-stock.in {
          background: rgba(34, 197, 94, 0.12);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.25);
        }

        .status-badge-stock.low {
          background: rgba(249, 115, 22, 0.12);
          color: #f97316;
          border: 1px solid rgba(249, 115, 22, 0.25);
        }

        .status-badge-stock.out {
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.25);
        }

        .action-btn {
          padding: 8px 14px;
          font-size: 0.825rem;
          font-weight: 600;
          border-radius: var(--r-pill);
          cursor: pointer;
          transition: all var(--dur-fast);
        }

        .edit-btn {
          background: var(--glass-bg);
          border: 1px solid var(--border-default);
          color: var(--text-primary);
        }
        .edit-btn:hover {
          border-color: var(--brand-primary);
          color: var(--brand-primary);
        }

        .del-btn {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #ef4444;
        }
        .del-btn:hover {
          background: rgba(239, 68, 68, 0.18);
          border-color: #ef4444;
        }

        .empty-state-box {
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--r-lg);
          padding: var(--space-12);
        }

        @media (max-width: 640px) {
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
