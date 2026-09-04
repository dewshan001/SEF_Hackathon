import { useState } from 'react';
import { createStock, updateStock } from '../api/stocks';
import { ApiError } from '../api/client';

const SIZES = ['2.5kg', '5kg', '12.5kg', '37.5kg'];

export default function StockFormModal({ stock, onClose, onSaved }) {
  const isEdit = Boolean(stock);
  const [brand, setBrand] = useState(stock?.brand || '');
  const [size, setSize] = useState(stock?.size || SIZES[0]);
  const [quantity, setQuantity] = useState(stock?.quantity ?? 0);
  const [price, setPrice] = useState(stock?.price ?? 0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const payload = { brand, size, quantity: Number(quantity), price: Number(price) };
    try {
      if (isEdit) {
        await updateStock(stock._id, payload);
      } else {
        await createStock(payload);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card glass-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="form-step-title" style={{ marginBottom: 0 }}>{isEdit ? 'Edit Stock' : 'Add Stock'}</h3>
          <button className="modal-close-btn" id="stock-modal-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label className="field-label" htmlFor="stock-brand-input">Brand</label>
            <input
              id="stock-brand-input"
              type="text"
              className="field-input"
              placeholder="e.g. Litro, Laugfs"
              value={brand}
              onChange={e => setBrand(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="stock-size-select">Size</label>
            <select
              id="stock-size-select"
              className="field-input"
              value={size}
              onChange={e => setSize(e.target.value)}
            >
              {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-row">
            <div className="field-group">
              <label className="field-label" htmlFor="stock-qty-input">Quantity</label>
              <input
                id="stock-qty-input"
                type="number"
                min="0"
                className="field-input"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="stock-price-input">Price (LKR)</label>
              <input
                id="stock-price-input"
                type="number"
                min="0"
                className="field-input"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div className="modal-error">{error}</div>}

          <button
            type="submit"
            className="btn-primary form-submit-btn"
            id="stock-save-btn"
            disabled={submitting || !brand}
          >
            {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Stock'}
          </button>
        </form>
      </div>
    </div>
  );
}
