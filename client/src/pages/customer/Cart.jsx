import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../api/orders';
import { ApiError } from '../../api/client';
import TokenCard from '../../components/TokenCard';

function formatLKR(v) {
  return `Rs. ${Number(v || 0).toLocaleString('en-LK')}`;
}

export default function Cart() {
  const { cartItems, cartShop, totalAmount, totalItems, updateQty, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  const handlePlaceOrder = async () => {
    if (!cartShop || cartItems.length === 0) return;
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        shopId: cartShop._id,
        items: cartItems.map(i => ({
          cylinderId: i.cylinder._id,
          quantity: i.quantity,
        })),
      };
      const order = await createOrder(payload);
      clearCart();
      setCompletedOrder(order);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to place your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show token success screen
  if (completedOrder) {
    return (
      <div>
        <div className="dash-page-header">
          <h1 className="dash-page-title">Order <span className="gradient-text">Confirmed!</span></h1>
        </div>
        <TokenCard
          order={completedOrder}
          onViewOrder={() => navigate(`/customer/orders/${completedOrder._id}`)}
        />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div>
        <div className="dash-page-header">
          <h1 className="dash-page-title">My <span className="gradient-text">Cart</span></h1>
        </div>
        <div className="dash-state glass-card">
          <span style={{ fontSize: '2.5rem' }}>🛒</span>
          <span>Your cart is empty.</span>
          <button className="btn-primary" onClick={() => navigate('/customer/shops')}>
            Browse Shops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="dash-page-header">
        <h1 className="dash-page-title">My <span className="gradient-text">Cart</span></h1>
        <p className="dash-page-subtitle">
          {cartShop && <>Ordering from: <strong>{cartShop.shopName}</strong></>}
        </p>
      </div>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items-col">
          {cartItems.map(({ cylinder, quantity }) => {
            const subtotal = cylinder.price * quantity;
            return (
              <div key={cylinder._id} className="cart-item-card glass-card" id={`cart-item-${cylinder._id}`}>
                <div className="cart-item-top">
                  <div>
                    <div className="cart-item-size gradient-text">{cylinder.sizeKg}</div>
                    <div className="cart-item-gas">{cylinder.gasType}</div>
                    {cylinder.capacityLitres && <div className="cart-item-cap">{cylinder.capacityLitres} L</div>}
                  </div>
                  <button
                    className="cart-remove-btn"
                    id={`remove-cart-${cylinder._id}`}
                    onClick={() => removeItem(cylinder._id)}
                    aria-label="Remove item"
                  >✕</button>
                </div>

                <div className="cart-item-mid">
                  <div className="cart-qty-control">
                    <button
                      className="qty-quick-btn"
                      onClick={() => updateQty(cylinder._id, quantity - 1)}
                      disabled={quantity <= 1}
                    >−</button>
                    <span className="qty-display">{quantity}</span>
                    <button
                      className="qty-quick-btn"
                      onClick={() => updateQty(cylinder._id, quantity + 1)}
                      disabled={quantity >= cylinder.availableQuantity}
                    >+</button>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {formatLKR(cylinder.price)} each
                    </div>
                    <div className="cart-item-subtotal gradient-text">{formatLKR(subtotal)}</div>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            className="btn-secondary"
            id="clear-cart-btn"
            onClick={clearCart}
            style={{ marginTop: 'var(--space-3)', fontSize: '0.875rem' }}
          >
            Clear Cart
          </button>
        </div>

        {/* Order summary */}
        <div className="cart-summary-col">
          <div className="cart-summary-card glass-card">
            <h3 className="form-step-title" style={{ marginBottom: 'var(--space-5)' }}>Order Summary</h3>

            {cartShop && (
              <div className="summary-shop-row">
                <span>🏪 {cartShop.shopName}</span>
              </div>
            )}

            {cartItems.map(({ cylinder, quantity }) => (
              <div key={cylinder._id} className="summary-item-row">
                <span>{cylinder.sizeKg} {cylinder.gasType} × {quantity}</span>
                <span>{formatLKR(cylinder.price * quantity)}</span>
              </div>
            ))}

            <div className="summary-divider" />

            <div className="summary-total-row">
              <span>Total ({totalItems} items)</span>
              <span className="gradient-text">{formatLKR(totalAmount)}</span>
            </div>

            {error && (
              <div style={{ color: 'var(--color-error)', fontSize: '0.875rem', padding: 'var(--space-3)', background: 'rgba(239,68,68,0.08)', borderRadius: 'var(--r-md)', border: '1px solid rgba(239,68,68,0.2)', marginTop: 'var(--space-4)' }}>
                {error}
              </div>
            )}

            <button
              className="btn-primary"
              id="place-order-btn"
              style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-5)' }}
              onClick={handlePlaceOrder}
              disabled={submitting || cartItems.length === 0}
            >
              {submitting ? 'Placing Order…' : '⚡ Place Order'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: var(--space-6);
          align-items: start;
        }
        @media (max-width: 768px) {
          .cart-layout { grid-template-columns: 1fr; }
        }
        .cart-items-col { display: flex; flex-direction: column; gap: var(--space-4); }
        .cart-item-card { padding: var(--space-5); }
        .cart-item-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-4); }
        .cart-item-size { font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; }
        .cart-item-gas { font-size: 0.875rem; color: var(--text-secondary); }
        .cart-item-cap { font-size: 0.75rem; color: var(--text-muted); }
        .cart-remove-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1rem; padding: 4px; }
        .cart-remove-btn:hover { color: var(--color-error); }
        .cart-item-mid { display: flex; justify-content: space-between; align-items: center; }
        .cart-qty-control { display: flex; align-items: center; gap: var(--space-3); }
        .qty-quick-btn {
          width: 32px; height: 32px;
          background: var(--glass-bg); border: 1px solid var(--border-default);
          border-radius: var(--r-md); color: var(--text-primary); cursor: pointer;
          font-size: 1.1rem; font-weight: 600; display: flex; align-items: center; justify-content: center;
          transition: background var(--dur-fast);
        }
        .qty-quick-btn:hover:not(:disabled) { background: var(--brand-tint); border-color: var(--brand-border-soft); }
        .qty-quick-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .qty-display { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; min-width: 28px; text-align: center; }
        .cart-item-subtotal { font-family: var(--font-display); font-size: 1.1rem; font-weight: 800; }
        .cart-summary-card { padding: var(--space-6); }
        .summary-shop-row { font-size: 0.875rem; font-weight: 600; color: var(--text-secondary); margin-bottom: var(--space-4); padding-bottom: var(--space-4); border-bottom: 1px solid var(--border-subtle); }
        .summary-item-row { display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--text-secondary); padding: var(--space-2) 0; }
        .summary-divider { height: 1px; background: var(--border-default); margin: var(--space-4) 0; }
        .summary-total-row { display: flex; justify-content: space-between; font-weight: 700; font-size: 1rem; }
      `}</style>
    </div>
  );
}
