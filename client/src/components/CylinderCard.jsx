import { useCart } from '../context/CartContext';
import './CylinderCard.css';

const SIZE_LABELS = {
  '5kg': '5 KG',
  '9kg': '9 KG',
  '18kg': '18 KG',
  '45kg': '45 KG',
  '90kg': '90 KG',
};

function formatLKR(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString('en-LK')}`;
}

export default function CylinderCard({ cylinder, shop, onCartConflict }) {
  const { cartItems, addItem } = useCart();
  const cartItem = cartItems.find(i => i.cylinder._id === cylinder._id);
  const isInCart = Boolean(cartItem);
  const isAvailable = cylinder.availableQuantity > 0;
  const isLowStock = cylinder.availableQuantity > 0 && cylinder.availableQuantity <= 5;

  const handleAdd = () => {
    const result = addItem(cylinder, shop, 1);
    if (!result.success && onCartConflict) {
      onCartConflict(result.message);
    }
  };

  return (
    <div className={`cyl-card glass-card ${!isAvailable ? 'cyl-card--unavailable' : ''}`}>
      <div className="cyl-card-top">
        <span className="cyl-gas-type">{cylinder.gasType}</span>
        {isLowStock && isAvailable && (
          <span className="cyl-low-stock-badge">Low Stock</span>
        )}
      </div>

      <div className="cyl-size-display">
        {SIZE_LABELS[cylinder.sizeKg] || cylinder.sizeKg}
      </div>

      {cylinder.capacityLitres && (
        <div className="cyl-detail-row">
          <span className="cyl-label">Capacity</span>
          <span className="cyl-value">{cylinder.capacityLitres} L</span>
        </div>
      )}

      <div className="cyl-price">{formatLKR(cylinder.price)}</div>

      <div className={`cyl-qty-badge ${isAvailable ? 'qty-available' : 'qty-out'}`}>
        {isAvailable ? `${cylinder.availableQuantity} available` : 'Out of Stock'}
      </div>

      {cylinder.description && (
        <p className="cyl-description">{cylinder.description}</p>
      )}

      {isAvailable ? (
        <button
          className={`btn-primary cyl-add-btn ${isInCart ? 'cyl-add-btn--in-cart' : ''}`}
          id={`add-to-cart-${cylinder._id}`}
          onClick={handleAdd}
        >
          {isInCart ? `In Cart (×${cartItem.quantity})` : 'Add to Order'}
        </button>
      ) : (
        <button className="btn-secondary cyl-add-btn" disabled>
          Unavailable
        </button>
      )}
    </div>
  );
}
