import './StatusBadge.css';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   className: 'status-pending' },
  ready:     { label: 'Ready',     className: 'status-ready' },
  collected: { label: 'Collected', className: 'status-collected' },
  cancelled: { label: 'Cancelled', className: 'status-cancelled' },
};

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] || { label: status || 'Unknown', className: 'status-pending' };
  return (
    <span className={`status-badge-pill ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
