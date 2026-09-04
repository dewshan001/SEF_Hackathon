import { useEffect, useMemo, useState } from 'react';
import './Dashboard.css';
import './CustomerDashboard.css';
import { useAuth } from '../context/AuthContext';
import { getStocks } from '../api/stocks';
import { getMyOrders, createOrder } from '../api/orders';
import { ApiError } from '../api/client';

const SIZES = ['2.5kg', '5kg', '12.5kg', '37.5kg'];

function formatLKR(amount) {
  return `LKR ${Number(amount).toLocaleString('en-LK')}`;
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [stocksState, setStocksState] = useState('loading'); // loading | error | ready
  const [brandFilter, setBrandFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');

  const [bookings, setBookings] = useState([]);
  const [bookingsState, setBookingsState] = useState('loading');

  const [modalStock, setModalStock] = useState(null);

  const loadStocks = async () => {
    setStocksState('loading');
    try {
      const data = await getStocks();
      setStocks(Array.isArray(data) ? data : data?.stocks || []);
      setStocksState('ready');
    } catch {
      setStocksState('error');
    }
  };

  const loadBookings = async () => {
    setBookingsState('loading');
    try {
      const data = await getMyOrders();
      setBookings(Array.isArray(data) ? data : data?.orders || []);
      setBookingsState('ready');
    } catch {
      setBookingsState('error');
    }
  };

  useEffect(() => {
    loadStocks();
    loadBookings();
  }, []);

  const brands = useMemo(() => {
    const set = new Set(stocks.map(s => s.brand).filter(Boolean));
    return Array.from(set);
  }, [stocks]);

  const filteredStocks = useMemo(() => {
    return stocks.filter(s => {
      if (brandFilter !== 'all' && s.brand !== brandFilter) return false;
      if (sizeFilter !== 'all' && s.size !== sizeFilter) return false;
      return true;
    });
  }, [stocks, brandFilter, sizeFilter]);

  const handleBooked = () => {
    setModalStock(null);
    loadBookings();
  };

  return (
    <section className="cust-dash section-py" id="customer-dashboard">
      <div className="container">
        <header className="cust-dash-header">
          <div className="section-label"><span className="dot" />Customer Portal</div>
          <h1 className="section-title" style={{ textAlign: 'left' }}>
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'there'}</span>
          </h1>
          <p className="section-subtitle" style={{ textAlign: 'left' }}>
            Browse available LP gas stock near you and book a cylinder in seconds.
          </p>
        </header>

        {/* ── Filters ── */}
        <div className="stock-filter-bar">
          <div className="field-group">
            <label className="field-label" htmlFor="brand-filter">Brand</label>
            <select
              id="brand-filter"
              className="field-input"
              value={brandFilter}
              onChange={e => setBrandFilter(e.target.value)}
            >
              <option value="all">All Brands</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="size-filter">Size</label>
            <select
              id="size-filter"
              className="field-input"
              value={sizeFilter}
              onChange={e => setSizeFilter(e.target.value)}
            >
              <option value="all">All Sizes</option>
              {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* ── Stock grid ── */}
        {stocksState === 'loading' && (
          <div className="dash-state dash-loading">
            <div className="dash-spinner" aria-hidden="true" />
            <span>Loading available stock…</span>
          </div>
        )}

        {stocksState === 'error' && (
          <div className="dash-state dash-error glass-card">
            <span>Couldn't load stock right now. The stock service may not be available yet.</span>
            <button className="btn-secondary" id="retry-stocks-btn" onClick={loadStocks}>Retry</button>
          </div>
        )}

        {stocksState === 'ready' && filteredStocks.length === 0 && (
          <div className="dash-state dash-empty glass-card">
            <span>No stock matches your filters right now. Try a different brand or size.</span>
          </div>
        )}

        {stocksState === 'ready' && filteredStocks.length > 0 && (
          <div className="stock-grid">
            {filteredStocks.map(s => {
              const available = s.isAvailable !== false && s.quantity > 0;
              return (
                <div key={s._id} className="stock-card glass-card">
                  <div className="stock-card-top">
                    <span className="stock-brand">{s.brand}</span>
                    <span className="stock-size-tag">{s.size}</span>
                  </div>
                  <div className="stock-price gradient-text">{formatLKR(s.price)}</div>
                  <div className="stock-shop-info">
                    <span className="text-primary">{s.shop?.shopName || 'Local Shop'}</span>
                    <span className="text-muted">{s.shop?.contactNumber || '—'}</span>
                  </div>
                  <div className={`stock-qty-avail ${available ? 'text-secondary' : ''}`} style={!available ? { color: 'var(--color-error)' } : undefined}>
                    {available ? `${s.quantity} in stock` : 'Out of stock'}
                  </div>
                  <button
                    className="btn-primary stock-book-btn"
                    id={`book-stock-${s._id}-btn`}
                    disabled={!available}
                    onClick={() => setModalStock(s)}
                  >
                    {available ? 'Book Now' : 'Out of Stock'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {modalStock && (
          <BookModal
            stock={modalStock}
            onClose={() => setModalStock(null)}
            onBooked={handleBooked}
          />
        )}

        {/* ── My bookings ── */}
        <section className="my-bookings">
          <h2 className="form-step-title">My Bookings</h2>

          {bookingsState === 'loading' && (
            <div className="dash-state dash-loading">
              <div className="dash-spinner" aria-hidden="true" />
              <span>Loading your bookings…</span>
            </div>
          )}

          {bookingsState === 'error' && (
            <div className="dash-state dash-error glass-card">
              <span>Couldn't load your bookings right now.</span>
              <button className="btn-secondary" id="retry-bookings-btn" onClick={loadBookings}>Retry</button>
            </div>
          )}

          {bookingsState === 'ready' && bookings.length === 0 && (
            <div className="dash-state dash-empty glass-card">
              <span>You haven't booked any cylinders yet. Browse the stock above to get started.</span>
            </div>
          )}

          {bookingsState === 'ready' && bookings.length > 0 && (
            <div className="orders-list">
              {bookings.map(o => {
                const statusClass = `status-${(o.status || 'pending').toLowerCase()}`;
                return (
                  <div key={o._id} className="order-row glass-card">
                    <div className="order-row-main">
                      <span className="order-shop-name">{o.shop?.shopName || o.shopId?.shopName || 'Shop'}</span>
                      <span className="text-muted">
                        {o.cylinderDetails?.brand} · {o.cylinderDetails?.size} × {o.cylinderDetails?.quantityPurchased}
                      </span>
                      <span className="text-secondary">{formatLKR(o.totalAmount)}</span>
                      {o.createdAt && (
                        <span className="text-muted">{new Date(o.createdAt).toLocaleString('en-LK')}</span>
                      )}
                    </div>
                    <span className={`status-badge ${statusClass}`}>{o.status}</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

function BookModal({ stock, onClose, onBooked }) {
  const maxQty = stock.quantity || 1;
  const [qty, setQty] = useState(1);
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  const total = (stock.price || 0) * qty;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const created = await createOrder({
        stockId: stock._id,
        quantity: qty,
        deliveryAddress: { coordinates: [0, 0], text: address },
      });
      setOrder(created);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card glass-card" onClick={e => e.stopPropagation()}>
        {!order ? (
          <>
            <div className="modal-header">
              <h3 className="form-step-title" style={{ marginBottom: 0 }}>Book {stock.brand} · {stock.size}</h3>
              <button className="modal-close-btn" id="book-modal-close-btn" onClick={onClose} aria-label="Close">✕</button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="qty-field" style={{ marginBottom: 'var(--space-6)' }}>
                <label className="field-label" htmlFor="book-qty-input">Quantity</label>
                <div className="qty-control">
                  <button
                    type="button"
                    className="qty-btn"
                    id="book-qty-dec-btn"
                    aria-label="Decrease quantity"
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                  >−</button>
                  <input id="book-qty-input" type="number" value={qty} readOnly className="qty-input" aria-label="Quantity" />
                  <button
                    type="button"
                    className="qty-btn"
                    id="book-qty-inc-btn"
                    aria-label="Increase quantity"
                    onClick={() => setQty(q => Math.min(maxQty, q + 1))}
                  >+</button>
                </div>
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="book-address-input">Delivery Address</label>
                <textarea
                  id="book-address-input"
                  className="field-input field-textarea"
                  placeholder="No. 12, Galle Road, Colombo 03"
                  rows={3}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="order-summary">
                <div className="summary-row">
                  <span>{stock.brand} {stock.size} × {qty}</span>
                  <span>{formatLKR(total)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span className="text-success">FREE</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row total">
                  <span>Total</span>
                  <span className="gradient-text">{formatLKR(total)}</span>
                </div>
              </div>

              {error && <div className="modal-error">{error}</div>}

              <button
                type="submit"
                className="btn-primary form-submit-btn"
                id="book-confirm-btn"
                disabled={submitting || !address}
              >
                {submitting ? 'Booking…' : 'Confirm Booking'}
              </button>
            </form>
          </>
        ) : (
          <div className="booking-success">
            <div className="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="success-title">Booking Placed! 🎉</h2>
            <p className="success-msg">
              Your <strong>{stock.brand} {stock.size}</strong> booking has been sent to the shop owner. No payment is required now — this simply connects you with the shop.
            </p>
            <div className="success-details">
              <div className="detail-row">
                <span>Order ID</span>
                <span className="gradient-text">#{(order._id || '').toString().slice(-8).toUpperCase()}</span>
              </div>
              <div className="detail-row">
                <span>Quantity</span>
                <span>{qty}</span>
              </div>
              <div className="detail-row">
                <span>Total</span>
                <span>{formatLKR(order.totalAmount ?? total)}</span>
              </div>
              <div className="detail-row">
                <span>Status</span>
                <span>{order.status || 'PENDING'}</span>
              </div>
            </div>
            <p className="success-msg" style={{ marginBottom: 'var(--space-6)' }}>
              A confirmation email has been sent to you and to the shop owner.
            </p>
            <button className="btn-primary" id="book-modal-done-btn" onClick={onBooked}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
