import { useEffect, useState } from 'react';
import './Dashboard.css';
import './ShopOwnerDashboard.css';
import { useAuth } from '../context/AuthContext';
import { getMyShop, createShop } from '../api/shops';
import { getMyStocks, deleteStock, updateStock } from '../api/stocks';
import { getShopOrders, updateOrderStatus } from '../api/orders';
import { ApiError } from '../api/client';
import StockFormModal from './StockFormModal';

const ORDER_STATUSES = ['PENDING', 'READY FOR PICKUP', 'PICKED UP', 'CANCELLED'];

function formatLKR(amount) {
  return `LKR ${Number(amount || 0).toLocaleString('en-LK')}`;
}

export default function ShopOwnerDashboard() {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [shopState, setShopState] = useState('loading'); // loading | error | ready

  const [stocks, setStocks] = useState([]);
  const [stocksState, setStocksState] = useState('loading');

  const [orders, setOrders] = useState([]);
  const [ordersState, setOrdersState] = useState('loading');

  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [updatingQtyId, setUpdatingQtyId] = useState(null);

  const loadShop = async () => {
    setShopState('loading');
    try {
      const data = await getMyShop();
      setShop(data || null);
      setShopState('ready');
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setShop(null);
        setShopState('ready');
      } else {
        setShopState('error');
      }
    }
  };

  const loadStocks = async () => {
    setStocksState('loading');
    try {
      const data = await getMyStocks();
      setStocks(Array.isArray(data) ? data : data?.stocks || []);
      setStocksState('ready');
    } catch {
      setStocksState('error');
    }
  };

  const loadOrders = async () => {
    setOrdersState('loading');
    try {
      const data = await getShopOrders();
      setOrders(Array.isArray(data) ? data : data?.orders || []);
      setOrdersState('ready');
    } catch {
      setOrdersState('error');
    }
  };

  useEffect(() => {
    loadShop();
    loadStocks();
    loadOrders();
  }, []);

  const handleDeleteStock = async (id) => {
    if (!window.confirm('Delete this stock item? It will no longer be visible to customers.')) return;
    try {
      await deleteStock(id);
      loadStocks();
    } catch {
      window.alert('Could not delete this stock item. Please try again.');
    }
  };

  const handleQuickQty = async (stockItem, newQty) => {
    if (newQty < 0) return;
    setUpdatingQtyId(stockItem._id);
    const prev = stocks;
    setStocks(ss => ss.map(s => s._id === stockItem._id ? { ...s, quantity: newQty, isAvailable: newQty > 0 } : s));
    try {
      await updateStock(stockItem._id, {
        brand: stockItem.brand,
        size: stockItem.size,
        price: stockItem.price,
        quantity: Number(newQty),
      });
    } catch {
      setStocks(prev);
      window.alert('Failed to update stock quantity. Please try again.');
    } finally {
      setUpdatingQtyId(null);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    const prev = orders;
    setOrders(os => os.map(o => (o._id === orderId ? { ...o, status } : o)));
    try {
      await updateOrderStatus(orderId, status);
    } catch {
      setOrders(prev);
      window.alert('Could not update order status. Please try again.');
    }
  };

  return (
    <section className="owner-dash section-py" id="shop-owner-dashboard">
      <div className="container">
        <header className="owner-dash-header">
          <div className="section-label"><span className="dot" />Shop Owner Portal</div>
          <h1 className="section-title" style={{ textAlign: 'left' }}>
            Inventory & <span className="gradient-text">Orders</span>
          </h1>
          <p className="section-subtitle" style={{ textAlign: 'left' }}>
            Manage customer pickup orders, update your cylinder stock in real-time, and control inventory shown to customers.
          </p>
        </header>

        {/* ── Store Registration (if not created yet) ── */}
        {shopState === 'ready' && !shop && (
          <section className="shop-card-section">
            <CreateShopForm onCreated={(created) => setShop(created)} />
          </section>
        )}

        {/* ── Manage Customer-Visible Stock Quantities ── */}
        <section className="stock-manage-section">
          <div className="section-row-header">
            <div>
              <h2 className="form-step-title">Manage Cylinder Stock (Customer Visible)</h2>
              <p className="section-desc-sub">Edit the exact quantities and prices shown to customers in real-time.</p>
            </div>
            <button
              className="btn-primary"
              id="add-stock-btn"
              disabled={!shop}
              onClick={() => { setEditingStock(null); setStockModalOpen(true); }}
            >
              + Add New Cylinder Size
            </button>
          </div>

          {!shop && shopState === 'ready' && (
            <div className="dash-state dash-empty glass-card">
              <span>Create your store above before managing stock.</span>
            </div>
          )}

          {shop && stocksState === 'loading' && (
            <div className="dash-state dash-loading">
              <div className="dash-spinner" aria-hidden="true" />
              <span>Loading current inventory…</span>
            </div>
          )}

          {shop && stocksState === 'error' && (
            <div className="dash-state dash-error glass-card">
              <span>Couldn't load inventory.</span>
              <button className="btn-secondary" id="retry-stocks-btn" onClick={loadStocks}>Retry</button>
            </div>
          )}

          {shop && stocksState === 'ready' && stocks.length === 0 && (
            <div className="dash-state dash-empty glass-card">
              <span>No stock items listed. Click "+ Add New Cylinder Size" to make items visible to customers.</span>
            </div>
          )}

          {shop && stocksState === 'ready' && stocks.length > 0 && (
            <div className="stock-table glass-card">
              <div className="stock-table-head">
                <span>Brand</span>
                <span>Size</span>
                <span>Customer Visible Qty</span>
                <span>Price (LKR)</span>
                <span>Availability</span>
                <span>Actions</span>
              </div>
              {stocks.map(s => {
                const available = s.isAvailable !== false && s.quantity > 0;
                return (
                  <div key={s._id} className="stock-table-row">
                    <span className="stock-brand-name">{s.brand}</span>
                    <span className="stock-size-pill">{s.size}</span>
                    
                    {/* Inline Quick Quantity Adjuster */}
                    <div className="quick-qty-box">
                      <button
                        type="button"
                        className="qty-quick-btn"
                        onClick={() => handleQuickQty(s, s.quantity - 1)}
                        disabled={s.quantity <= 0 || updatingQtyId === s._id}
                        title="Decrease customer quantity"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        className="qty-quick-input"
                        value={s.quantity}
                        onChange={(e) => handleQuickQty(s, Math.max(0, parseInt(e.target.value) || 0))}
                        min="0"
                        title="Directly edit quantity visible to customers"
                      />
                      <button
                        type="button"
                        className="qty-quick-btn"
                        onClick={() => handleQuickQty(s, s.quantity + 1)}
                        disabled={updatingQtyId === s._id}
                        title="Increase customer quantity"
                      >
                        +
                      </button>
                    </div>

                    <span className="stock-price-val">{formatLKR(s.price)}</span>
                    <span className={`status-badge ${available ? 'status-available' : 'status-unavailable'}`}>
                      {available ? `${s.quantity} In Stock` : 'Out of Stock'}
                    </span>
                    <div className="stock-row-actions">
                      <button
                        className="btn-secondary edit-qty-btn"
                        id={`edit-stock-${s._id}-btn`}
                        onClick={() => { setEditingStock(s); setStockModalOpen(true); }}
                      >
                        ✏️ Edit Item
                      </button>
                      <button
                        className="btn-secondary stock-delete-btn"
                        id={`delete-stock-${s._id}-btn`}
                        onClick={() => handleDeleteStock(s._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {stockModalOpen && (
            <StockFormModal
              stock={editingStock}
              onClose={() => setStockModalOpen(false)}
              onSaved={() => { setStockModalOpen(false); loadStocks(); }}
            />
          )}
        </section>

        {/* ── Customer Pickup Orders ── */}
        <section className="shop-orders-section">
          <div className="section-row-header">
            <div>
              <h2 className="form-step-title">Customer Pickup Orders</h2>
              <p className="section-desc-sub">View incoming cylinder pickup reservations made by customers.</p>
            </div>
            <button className="btn-secondary" onClick={loadOrders}>↻ Refresh Orders</button>
          </div>

          {ordersState === 'loading' && (
            <div className="dash-state dash-loading">
              <div className="dash-spinner" aria-hidden="true" />
              <span>Loading customer pickup reservations…</span>
            </div>
          )}

          {ordersState === 'error' && (
            <div className="dash-state dash-error glass-card">
              <span>Couldn't load customer orders.</span>
              <button className="btn-secondary" id="retry-orders-btn" onClick={loadOrders}>Retry</button>
            </div>
          )}

          {ordersState === 'ready' && orders.length === 0 && (
            <div className="dash-state dash-empty glass-card">
              <span>No customer pickup orders recorded yet.</span>
            </div>
          )}

          {ordersState === 'ready' && orders.length > 0 && (
            <div className="orders-grid-list">
              {orders.map(o => {
                const orderToken = `#GGL-${(o._id || '').slice(-5).toUpperCase()}`;

                return (
                  <div key={o._id} className="order-card-pickup glass-card">
                    <div className="order-card-header">
                      <div className="order-token-badge">{orderToken}</div>
                      <span className={`order-status-tag status-${(o.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                        {o.status || 'PENDING'}
                      </span>
                    </div>

                    <div className="order-item-summary">
                      <div className="summary-line">
                        <span>Cylinder Size & Brand:</span>
                        <strong>{o.cylinderDetails?.brand || 'LP Gas'} · {o.cylinderDetails?.size || '12.5kg'}</strong>
                      </div>
                      <div className="summary-line">
                        <span>Reserved Quantity:</span>
                        <strong>× {o.cylinderDetails?.quantityPurchased || 1}</strong>
                      </div>
                      <div className="summary-line">
                        <span>Total Price:</span>
                        <strong className="gradient-text">{formatLKR(o.totalAmount)}</strong>
                      </div>
                      <div className="summary-line">
                        <span>Pickup Method:</span>
                        <span className="pickup-tag">🏬 In-Store Pickup</span>
                      </div>
                    </div>

                    <div className="order-card-footer">
                      <label className="field-label" htmlFor={`order-status-${o._id}`}>Update Pickup Status:</label>
                      <select
                        className="field-input order-status-select"
                        id={`order-status-${o._id}`}
                        value={o.status || 'PENDING'}
                        onChange={e => handleStatusChange(o._id, e.target.value)}
                      >
                        {ORDER_STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
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

function CreateShopForm({ onCreated }) {
  const [shopName, setShopName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [lng, setLng] = useState(79.8612);
  const [lat, setLat] = useState(6.9271);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const created = await createShop({
        shopName,
        contactNumber,
        location: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
      });
      onCreated(created);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="create-shop-form glass-card" onSubmit={handleSubmit} noValidate>
      <h3 className="form-step-title">Register Your Store</h3>
      <div className="field-group">
        <label className="field-label" htmlFor="shop-name-input">Shop / Business Name</label>
        <input
          id="shop-name-input"
          type="text"
          className="field-input"
          placeholder="e.g. Colombo Central Gas Dealers"
          value={shopName}
          onChange={e => setShopName(e.target.value)}
          required
        />
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="shop-contact-input">Contact Phone Number</label>
        <input
          id="shop-contact-input"
          type="tel"
          className="field-input"
          placeholder="+94 77 123 4567"
          value={contactNumber}
          onChange={e => setContactNumber(e.target.value)}
          required
        />
      </div>
      <div className="form-row">
        <div className="field-group">
          <label className="field-label" htmlFor="shop-lng-input">Longitude</label>
          <input
            id="shop-lng-input"
            type="number"
            step="any"
            className="field-input"
            value={lng}
            onChange={e => setLng(e.target.value)}
          />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor="shop-lat-input">Latitude</label>
          <input
            id="shop-lat-input"
            type="number"
            step="any"
            className="field-input"
            value={lat}
            onChange={e => setLat(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="modal-error">{error}</div>}

      <button type="submit" className="btn-primary form-submit-btn" id="create-shop-btn" disabled={submitting || !shopName || !contactNumber}>
        {submitting ? 'Registering…' : 'Register Store'}
      </button>
    </form>
  );
}
