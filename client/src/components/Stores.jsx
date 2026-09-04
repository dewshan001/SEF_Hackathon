import { useState } from 'react';
import './Stores.css';

const STORES_DATA = [
  {
    id: 1,
    name: 'Colombo Central Gas Wholesale',
    district: 'Colombo',
    address: 'No. 45, Union Place, Colombo 02',
    phone: '+94 11 234 5678',
    status: 'In Stock',
    stock12: 42,
    stock5: 18,
    stock35: 6,
    distance: '1.2 km',
  },
  {
    id: 2,
    name: 'Gampaha Gas Distributors',
    district: 'Gampaha',
    address: 'No. 112, Kandy Road, Kadawatha',
    phone: '+94 33 222 1980',
    status: 'In Stock',
    stock12: 29,
    stock5: 12,
    stock35: 4,
    distance: '3.8 km',
  },
  {
    id: 3,
    name: 'Kandy City Gas Point',
    district: 'Kandy',
    address: 'No. 88, Peradeniya Road, Kandy',
    phone: '+94 81 223 4567',
    status: 'In Stock',
    stock12: 35,
    stock5: 20,
    stock35: 8,
    distance: '5.1 km',
  },
  {
    id: 4,
    name: 'Galle Main Street Dealers',
    district: 'Galle',
    address: 'No. 19, Main Street, Galle Fort',
    phone: '+94 91 224 8900',
    status: 'Low Stock',
    stock12: 8,
    stock5: 5,
    stock35: 2,
    distance: '8.4 km',
  },
  {
    id: 5,
    name: 'Dehiwala Wholesale Energy Hub',
    district: 'Colombo',
    address: 'No. 204, Galle Road, Dehiwala',
    phone: '+94 11 271 3344',
    status: 'In Stock',
    stock12: 56,
    stock5: 24,
    stock35: 10,
    distance: '2.5 km',
  },
  {
    id: 6,
    name: 'Negombo Coastal Gas Supply',
    district: 'Gampaha',
    address: 'No. 76, Greens Road, Negombo',
    phone: '+94 31 222 7890',
    status: 'In Stock',
    stock12: 31,
    stock5: 14,
    stock35: 5,
    distance: '6.2 km',
  },
];

export default function Stores({ onNavigateHome }) {
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  const districts = ['All', 'Colombo', 'Gampaha', 'Kandy', 'Galle'];

  const filteredStores = STORES_DATA.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.address.toLowerCase().includes(search.toLowerCase());
    const matchesDistrict = selectedDistrict === 'All' || store.district === selectedDistrict;
    return matchesSearch && matchesDistrict;
  });

  return (
    <section className="stores-page" id="stores-page" aria-label="Find Wholesale Gas Stores">
      <div className="container">
        {/* Header */}
        <div className="stores-header">
          <div className="section-label">
            <span className="dot" />
            Verified Wholesale Stores
          </div>
          <h1 className="stores-title">
            Find Available <span className="gradient-text">Gas Near You</span>
          </h1>
          <p className="stores-subtitle">
            Browse real-time cylinder inventory across certified wholesale gas stores in Sri Lanka.
          </p>

          {/* Search & Filter bar */}
          <div className="stores-filter-bar glass-card">
            <div className="search-input-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                className="store-search-input"
                placeholder="Search store name, area or street..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="district-filter-pills">
              {districts.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`filter-pill ${selectedDistrict === d ? 'active' : ''}`}
                  onClick={() => setSelectedDistrict(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stores Grid */}
        <div className="stores-grid">
          {filteredStores.map((store) => (
            <div key={store.id} className="store-card glass-card">
              <div className="store-card-top">
                <div>
                  <span className="store-district-tag">{store.district}</span>
                  <h3 className="store-card-name">{store.name}</h3>
                </div>
                <span className={`store-status-badge ${store.status === 'Low Stock' ? 'low' : 'ok'}`}>
                  {store.status}
                </span>
              </div>

              <p className="store-card-address">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {store.address}
              </p>

              <div className="store-stock-counts">
                <div className="stock-count-item">
                  <span className="count-label">12.5 kg</span>
                  <span className="count-val">{store.stock12} available</span>
                </div>
                <div className="stock-count-item">
                  <span className="count-label">5 kg</span>
                  <span className="count-val">{store.stock5} available</span>
                </div>
                <div className="stock-count-item">
                  <span className="count-label">35 kg</span>
                  <span className="count-val">{store.stock35} available</span>
                </div>
              </div>

              <div className="store-card-actions">
                <a href={`tel:${store.phone.replace(/\s+/g, '')}`} className="btn-secondary store-call-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.42 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.1a16 16 0 0 0 6 6l.98-.98a2 2 0 0 1 2.1-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  {store.phone}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Action */}
        <div className="stores-bottom-action">
          <button onClick={onNavigateHome} className="btn-secondary">
            ← Back to Home
          </button>
        </div>
      </div>
    </section>
  );
}
