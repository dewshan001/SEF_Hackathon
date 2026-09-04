import { useState } from 'react';
import StatusBadge from './StatusBadge';
import './TokenCard.css';

function formatLKR(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString('en-LK')}`;
}

export default function TokenCard({ order, onViewOrder }) {
  const [copied, setCopied] = useState(false);
  const shop = order?.shopId;
  const items = order?.items || [];
  const token = order?.token || 'GAS-PENDING';
  const orderId = order?._id;

  const handleCopy = () => {
    if (order?.token) {
      navigator.clipboard.writeText(order.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="token-card glass-card" id="token-success-card">
      <div className="token-card-success-icon" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <p className="token-card-heading">Order Placed Successfully! 🎉</p>
      <p className="token-card-sub">Your Pickup Token Number</p>

      {/* Token Box */}
      <div className="token-number-box">
        <div className="token-number">{token}</div>
        <button
          type="button"
          className="token-copy-btn"
          onClick={handleCopy}
          title="Copy Token to clipboard"
        >
          {copied ? '✓ Token Copied!' : '📋 Copy Token'}
        </button>
      </div>

      {orderId && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
          Order Ref ID: <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{orderId}</span>
        </div>
      )}

      {/* Pickup instructions */}
      <div style={{
        background: 'rgba(232, 93, 26, 0.08)',
        border: '1px solid var(--brand-border-soft)',
        borderRadius: 'var(--r-md)',
        padding: '10px 14px',
        fontSize: '0.825rem',
        color: 'var(--brand-amber)',
        marginBottom: 'var(--space-4)',
        textAlign: 'center',
        lineHeight: 1.4
      }}>
        💡 <strong>Pickup Notice:</strong> Show this token number at the gas shop counter when collecting your cylinders.
      </div>

      {shop && (
        <div className="token-shop-name">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          {shop.shopName}
        </div>
      )}

      <div className="token-items-list">
        {items.map((item, idx) => (
          <div key={idx} className="token-item-row">
            <span>{item.cylinderSize} {item.gasType}</span>
            <span>× {item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="token-total-row">
        <span>Total Amount</span>
        <span className="gradient-text">{formatLKR(order?.totalAmount)}</span>
      </div>

      <div className="token-status-row">
        <StatusBadge status={order?.status} />
      </div>

      {onViewOrder && (
        <button className="btn-primary token-view-btn" id="token-view-order-btn" onClick={onViewOrder}>
          View Full Order Details →
        </button>
      )}
    </div>
  );
}
