import { useEffect, useState } from 'react';
import './Dashboard.css';
import './ShopOwnerDashboard.css';
import { useAuth } from '../context/AuthContext';
import { getMyShop, createShop } from '../api/shops';
import { getMyStocks, deleteStock } from '../api/stocks';
import { getShopOrders, updateOrderStatus } from '../api/orders';
import { ApiError } from '../api/client';
import StockFormModal from './StockFormModal';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'];

function formatLKR(amount) {
  return `LKR ${Number(amount).toLocaleString('en-LK')}`;
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
    if (!window.confirm('Delete this stock entry?')) return;
    try {
      await deleteStock(id);
      loadStocks();
    } catch {
      window.alert('Could not delete this stock entry. Please try again.');
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
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'there'}</span>
          </h1>
          <p className="section-subtitle" style={{ textAlign: 'left' }}>
            Manage your shop, keep your stock up to date, and track incoming bookings.
          </p>
        </header>

        {/* ── My Shop ── */}
        <section className="shop-card-section">
          <h2 className="form-step-title">My Shop</h2>

          {shopState === 'loading' && (
            <div className="dash-state dash-loading">
              <div className="dash-spinner" aria-hidden="true" />
              <span>Loading your shop…</span>
            </div>
          )}

          {shopState === 'error' && (
            <div className="dash-state dash-error glass-card">
              <span>Couldn't load your shop right now. The shop service may not be available yet.</span>
              <button className="btn-secondary" id="retry-shop-btn" onClick={loadShop}>Retry</button>
            </div>
          )}

          {shopState === 'ready' && !shop && (
            <CreateShopForm onCreated={(created) => setShop(created)} />
          )}

          {shopState === 'ready' && shop && (
            <div className="shop-card glass-card">
              <div className="shop-card-name">{shop.shopName}</div>
              <div className="shop-card-row"><span>Contact</span><span>{shop.contactNumber}</span></div>
              <div className="shop-card-row">
                <span>Status</span>
                <span className={`status-badge ${shop.isActive === false ? 'status-unavailable' : 'status-available'}`}>
                  {shop.isActive === false ? 'Inactive' : 'Active'}
                </span>
              </div>
              <div className="shop-card-row">
                <span>Coordinates</span>
                <span>{shop.location?.coordinates?.join(', ') || '0, 0'}</span>
              </div>
            </div>
          )}
        </section>

        {/* ── Manage Stock ── */}
        <section className="stock-manage-section">
          <div className="section-row-header">
            <h2 className="form-step-title">Manage Stock</h2>
            <button
              className="btn-primary"
              id="add-stock-btn"
              disabled={!shop}
              onClick={() => { setEditingStock(null); setStockModalOpen(true); }}
            >
              + Add Stock
            </button>
          </div>

          {!shop && shopState === 'ready' && (
            <div className="dash-state dash-empty glass-card">
              <span>Create your shop above before adding stock.</span>
            </div>
          )}

          {shop && stocksState === 'loading' && (
            <div className="dash-state dash-loading">
              <div className="dash-spinner" aria-hidden="true" />
              <span>Loading your stock…</span>
            </div>
          )}

          {shop && stocksState === 'error' && (
            <div className="dash-state dash-error glass-card">
              <span>Couldn't load your stock right now.</span>
              <button className="btn-secondary" id="retry-stocks-btn" onClick={loadStocks}>Retry</button>
            </div>
          )}

          {shop && stocksState === 'ready' && stocks.length === 0 && (
            <div className="dash-state dash-empty glass-card">
              <span>No stock added yet. Click "+ Add Stock" to list your first cylinder.</span>
            </div>
          )}

          {shop && stocksState === 'ready' && stocks.length > 0 && (
            <div className="stock-table glass-card">
              <div className="stock-table-head">
                <span>Brand</span><span>Size</span><span>Qty</span><span>Price (LKR)</span><span>Status</span><span></span>
              </div>
              {stocks.map(s => {
                const available = s.isAvailable !== false && s.quantity > 0;
                return (
                  <div key={s._id} className="stock-table-row">
                    <span>{s.brand}</span>
                    <span>{s.size}</span>
                    <span>{s.quantity}</span>
                    <span>{formatLKR(s.price)}</span>
                    <span className={`status-badge ${available ? 'status-available' : 'status-unavailable'}`}>
                      {available ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <div className="stock-row-actions">
                      <button
                        className="btn-secondary"
                        id={`edit-stock-${s._id}-btn`}
                        onClick={() => { setEditingStock(s); setStockModalOpen(true); }}
                      >
                        Edit
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

        {/* ── Booked Gas Orders ── */}
        <section className="shop-orders-section">
          <h2 className="form-step-title">Booked Gas Orders</h2>

          {ordersState === 'loading' && (
            <div className="dash-state dash-loading">
              <div className="dash-spinner" aria-hidden="true" />
              <span>Loading booked orders…</span>
            </div>
          )}

          {ordersState === 'error' && (
            <div className="dash-state dash-error glass-card">
              <span>Couldn't load orders right now.</span>
              <button className="btn-secondary" id="retry-orders-btn" onClick={loadOrders}>Retry</button>
            </div>
          )}

          {ordersState === 'ready' && orders.length === 0 && (
            <div className="dash-state dash-empty glass-card">
              <span>No orders booked at your shop yet.</span>
            </div>
          )}

          {ordersState === 'ready' && orders.length > 0 && (
            <div className="orders-list">
              {orders.map(o => (
                <div key={o._id} className="order-row glass-card">
                  <div className="order-row-main">
                    <span className="order-customer-name">{o.customer?.name || o.customerId?.name}</span>
                    <span className="text-muted">{o.customer?.phone || o.customerId?.phone}</span>
                    <span className="text-secondary">
                      {o.cylinderDetails?.brand} · {o.cylinderDetails?.size} × {o.cylinderDetails?.quantityPurchased}
                    </span>
                    <span className="text-secondary">{formatLKR(o.totalAmount)}</span>
                    {o.deliveryAddress?.text && (
                      <span className="text-muted">{o.deliveryAddress.text}</span>
                    )}
                  </div>
                  <select
                    className="field-input order-status-select"
                    id={`order-status-${o._id}`}
                    value={o.status}
                    onChange={e => handleStatusChange(o._id, e.target.value)}
                    aria-label={`Update status for order ${o._id}`}
                  >
                    {ORDER_STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
              ))}
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
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
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
      <div className="field-group">
        <label className="field-label" htmlFor="shop-name-input">Shop Name</label>
        <input
          id="shop-name-input"
          type="text"
          className="field-input"
          placeholder="e.g. Perera Gas Traders"
          value={shopName}
          onChange={e => setShopName(e.target.value)}
          required
        />
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="shop-contact-input">Contact Number</label>
        <input
          id="shop-contact-input"
          type="tel"
          className="field-input"
          placeholder="+94 71 987 6543"
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
        {submitting ? 'Creating…' : 'Create Shop'}
      </button>
    </form>
  );
}
