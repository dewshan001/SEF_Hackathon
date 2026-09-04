import './Footer.css';

export default function Footer({ onNavigate }) {
  const handleLinkClick = (pageId, e) => {
    if (pageId && onNavigate) {
      e.preventDefault();
      onNavigate(pageId);
    }
  };

  return (
    <footer className="footer" id="footer">
      <div className="footer-glow" aria-hidden="true" />
      <div className="container footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <ellipse cx="16" cy="20" rx="9" ry="6" fill="url(#f-cyl)"/>
              <rect x="7" y="8" width="18" height="13" rx="6" fill="url(#f-cylb)"/>
              <ellipse cx="16" cy="8" rx="9" ry="3.5" fill="url(#f-cylt)"/>
              <rect x="13" y="4" width="6" height="5" rx="2" fill="url(#f-valve)"/>
              <defs>
                <linearGradient id="f-cyl" x1="7" y1="20" x2="25" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ff6b2b"/><stop offset="1" stopColor="#ffa726"/>
                </linearGradient>
                <linearGradient id="f-cylb" x1="7" y1="8" x2="25" y2="21" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffa726"/><stop offset="1" stopColor="#ff6b2b"/>
                </linearGradient>
                <linearGradient id="f-cylt" x1="7" y1="5" x2="25" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffcc02"/><stop offset="1" stopColor="#ffa726"/>
                </linearGradient>
                <linearGradient id="f-valve" x1="13" y1="4" x2="19" y2="9" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#e0e0e0"/><stop offset="1" stopColor="#9e9e9e"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="footer-logo-text">GasGo <span className="logo-accent">Lanka</span></span>
          </div>
          <p className="footer-tagline">
            Sri Lanka's most trusted LP gas cylinder stock platform.
            Safe, certified, and hassle-free.
          </p>
          <div className="footer-socials">
            {[
              { label: 'Facebook', href: '#', icon: 'f' },
              { label: 'Instagram', href: '#', icon: 'in' },
              { label: 'WhatsApp', href: '#', icon: 'wa' },
            ].map(s => (
              <a key={s.label} href={s.href} className="social-btn" aria-label={s.label} id={`footer-social-${s.label.toLowerCase()}`}>
                {s.icon === 'f' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                )}
                {s.icon === 'in' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                )}
                {s.icon === 'wa' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="footer-links-group">
          <h4 className="footer-heading">Platform</h4>
          <ul>
            <li><a href="#stores" className="footer-link" onClick={(e) => handleLinkClick('stores', e)}>Find Stores</a></li>
            <li><a href="#about" className="footer-link" onClick={(e) => handleLinkClick('about', e)}>About Us</a></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Company</h4>
          <ul>
            <li><a href="#about" className="footer-link" onClick={(e) => handleLinkClick('about', e)}>Our Mission</a></li>
            <li><a href="#" className="footer-link" onClick={(e) => handleLinkClick('home', e)}>Home</a></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Support</h4>
          <ul>
            <li><a href="#about" className="footer-link" onClick={(e) => handleLinkClick('about', e)}>Safety Guidelines</a></li>
            <li><a href="#about" className="footer-link" onClick={(e) => handleLinkClick('about', e)}>Help Center</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copy">© 2025 GasGo Lanka (Pvt) Ltd. All rights reserved. Registered in Sri Lanka.</p>
          <p className="footer-made">Made with ❤️ in Sri Lanka 🇱🇰</p>
        </div>
      </div>
    </footer>
  );
}
