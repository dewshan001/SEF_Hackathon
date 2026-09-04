export default function MapButton({ lat, lng, address, label = 'Map' }) {
  let url = null;
  const hasCoords = lat && lng && !(Number(lat) === 0 && Number(lng) === 0);

  if (hasCoords) {
    url = `https://www.google.com/maps?q=${lat},${lng}`;
  } else if (address && address.trim()) {
    url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}`;
  }

  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-secondary map-btn"
      onClick={e => e.stopPropagation()}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontSize: '0.875rem' }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      {label}
    </a>
  );
}
