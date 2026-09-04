import { useState } from 'react';
import './About.css';

export default function About({ onNavigateHome }) {
  const [activeTab, setActiveTab] = useState('mission'); // 'mission' | 'platform' | 'safety' | 'help'

  const SAFETY_TIPS = [
    {
      title: 'Always Keep Cylinders Upright',
      desc: 'Store and transport gas cylinders in an upright, vertical position in well-ventilated spaces away from heat sources or open flames.',
      icon: '🛡️',
    },
    {
      title: 'Check the Safety Seal & Valve',
      desc: 'Ensure the tamper-evident safety seal is intact upon purchasing and check the rubber washer inside the valve before attaching your regulator.',
      icon: '🔍',
    },
    {
      title: 'Use Soapy Water for Leak Testing',
      desc: 'Never use a match or lighter to check for leaks. Apply soapy water over the valve and hose connection — if bubbles form, there is a leak.',
      icon: '🧼',
    },
    {
      title: 'Certified Regulators & Hoses Only',
      desc: 'Use only SLS-certified LP gas regulators and approved reinforced gas tubing. Replace gas hoses every 2 years for safety.',
      icon: '⚙️',
    },
  ];

  const FAQS = [
    {
      q: 'How does GasGo Lanka show live stock?',
      a: 'Authorized wholesale dealers and registered stores across Sri Lanka update their cylinder stock counts directly on our platform in real time.',
    },
    {
      q: 'Are all stores listed certified by government authorities?',
      a: 'Yes, 100% of distributors and stores on GasGo Lanka are vetted and verified authorized LP gas dealers with valid safety certifications.',
    },
    {
      q: 'Do I need to pay or create an account to view store inventory?',
      a: 'No, browsing store stock availability across all 25 districts is completely free and open to everyone without requiring sign-up.',
    },
    {
      q: 'How can store owners register on GasGo Lanka?',
      a: 'Certified wholesale dealers can click "Sign In" or contact our dealer onboarding hotline to get verified and list their live inventory.',
    },
  ];

  return (
    <section className="about-page" id="about" aria-label="About GasGo Lanka">
      {/* Background decoration */}
      <div className="about-orbs" aria-hidden="true">
        <div className="about-orb about-orb-1" />
        <div className="about-orb about-orb-2" />
      </div>

      <div className="container">
        {/* Main Header */}
        <div className="about-header">
          <div className="section-label">
            <span className="dot" />
            About GasGo Lanka
          </div>
          <h1 className="about-title">
            Sri Lanka's Most Trusted<br />
            <span className="gradient-text">LP Gas Stock Platform</span>
          </h1>
          <p className="about-subtitle">
            Safe, certified, and hassle-free. Giving Sri Lankan households and businesses live visibility into LP gas cylinder availability without queues.
          </p>

          {/* Section Navigation Tabs */}
          <div className="about-tabs" role="tablist">
            <button
              className={`about-tab ${activeTab === 'mission' ? 'active' : ''}`}
              onClick={() => setActiveTab('mission')}
              role="tab"
              aria-selected={activeTab === 'mission'}
            >
              🏢 Our Mission
            </button>
            <button
              className={`about-tab ${activeTab === 'platform' ? 'active' : ''}`}
              onClick={() => setActiveTab('platform')}
              role="tab"
              aria-selected={activeTab === 'platform'}
            >
              ⚡ The Platform
            </button>
            <button
              className={`about-tab ${activeTab === 'safety' ? 'active' : ''}`}
              onClick={() => setActiveTab('safety')}
              role="tab"
              aria-selected={activeTab === 'safety'}
            >
              🛡️ Safety Guidelines
            </button>
            <button
              className={`about-tab ${activeTab === 'help' ? 'active' : ''}`}
              onClick={() => setActiveTab('help')}
              role="tab"
              aria-selected={activeTab === 'help'}
            >
              💬 Help Center
            </button>
          </div>
        </div>

        {/* Tab 1: Our Mission & Company */}
        {activeTab === 'mission' && (
          <div className="tab-content fade-in-panel">
            <div className="about-mission-card glass-card">
              <div className="mission-content">
                <span className="mission-tag">Company Vision</span>
                <h2 className="mission-headline">
                  "Empowering every Sri Lankan family and enterprise with transparent, queue-free access to clean energy."
                </h2>
                <p className="mission-desc">
                  GasGo Lanka was created to eliminate the hours wasted driving from store to store or standing in long queues. We bridge authorized wholesale distributors directly with consumers, providing reliable, verified stock data you can depend on every single day.
                </p>
              </div>
              <div className="mission-stats-grid">
                <div className="mission-stat">
                  <span className="stat-num gradient-text">120+</span>
                  <span className="stat-name">Verified Stores</span>
                </div>
                <div className="mission-stat">
                  <span className="stat-num gradient-text">25</span>
                  <span className="stat-name">Districts Covered</span>
                </div>
                <div className="mission-stat">
                  <span className="stat-num gradient-text">50K+</span>
                  <span className="stat-name">Active Users</span>
                </div>
                <div className="mission-stat">
                  <span className="stat-num gradient-text">100%</span>
                  <span className="stat-name">SLS Certified</span>
                </div>
              </div>
            </div>

            {/* Core Values */}
            <div className="about-values-grid">
              <div className="value-card glass-card">
                <div className="value-icon">⏱️</div>
                <h3>Save Your Time</h3>
                <p>Locate in-stock cylinders near you in seconds before stepping out of your home.</p>
              </div>
              <div className="value-card glass-card">
                <div className="value-icon">🔒</div>
                <h3>Verified Safety</h3>
                <p>Direct partnerships with authorized dealers guarantee 100% genuine and safe cylinders.</p>
              </div>
              <div className="value-card glass-card">
                <div className="value-icon">🤝</div>
                <h3>Community Centric</h3>
                <p>Built by Sri Lankans for Sri Lankans, keeping everyday households and businesses moving.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: The Platform */}
        {activeTab === 'platform' && (
          <div className="tab-content fade-in-panel">
            <div className="platform-overview glass-card">
              <h2 className="section-heading">How the GasGo Platform Works</h2>
              <p className="section-lead">
                A seamless real-time stock network connecting certified wholesale distributors across Colombo, Gampaha, Kandy, Galle, and all 25 districts.
              </p>

              <div className="platform-features-grid">
                <div className="p-feature-item">
                  <div className="p-num">01</div>
                  <h3>Find Nearby Stores</h3>
                  <p>Filter certified dealers by district, city, or distance with live inventory indicators.</p>
                </div>
                <div className="p-feature-item">
                  <div className="p-num">02</div>
                  <h3>Live Cylinder Stock</h3>
                  <p>View exact counts for 12.5 kg domestic, 5 kg mini, and 35 kg commercial cylinders.</p>
                </div>
                <div className="p-feature-item">
                  <div className="p-num">03</div>
                  <h3>Direct Store Contact</h3>
                  <p>Call store managers directly with one tap to confirm before visiting.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Safety Guidelines */}
        {activeTab === 'safety' && (
          <div className="tab-content fade-in-panel">
            <div className="safety-section-header">
              <h2 className="section-heading">LP Gas Safety Guidelines</h2>
              <p className="section-lead">
                Follow these essential government & manufacturer safety procedures when handling LP gas cylinders.
              </p>
            </div>

            <div className="safety-grid">
              {SAFETY_TIPS.map((tip, idx) => (
                <div key={idx} className="safety-card glass-card">
                  <span className="safety-icon">{tip.icon}</span>
                  <h3 className="safety-title">{tip.title}</h3>
                  <p className="safety-desc">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Help Center */}
        {activeTab === 'help' && (
          <div className="tab-content fade-in-panel">
            <div className="help-section-header">
              <h2 className="section-heading">Help Center & Frequently Asked Questions</h2>
              <p className="section-lead">
                Find quick answers to common questions or reach out to our customer support team.
              </p>
            </div>

            <div className="faqs-grid">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="faq-card glass-card">
                  <h3 className="faq-question">
                    <span className="q-badge">Q</span>
                    {faq.q}
                  </h3>
                  <p className="faq-answer">{faq.a}</p>
                </div>
              ))}
            </div>

            {/* Support hotline contact card */}
            <div className="support-contact-card glass-card">
              <div className="contact-info">
                <h3>Need additional support or want to report an issue?</h3>
                <p>Our Sri Lankan support desk is available Monday – Sunday, 8:00 AM – 8:00 PM.</p>
              </div>
              <a href="tel:+94112345678" className="btn-primary support-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.42 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.1a16 16 0 0 0 6 6l.98-.98a2 2 0 0 1 2.1-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Call: +94 11 234 5678
              </a>
            </div>
          </div>
        )}

        {/* Back to Home CTA */}
        <div className="about-footer-action">
          <button onClick={onNavigateHome} className="btn-secondary" id="about-home-btn">
            ← Back to Home
          </button>
        </div>
      </div>
    </section>
  );
}
