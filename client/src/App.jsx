import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import BookingForm from './components/BookingForm';
import Testimonials from './components/Testimonials';
import CTABanner from './components/CTABanner';
import Footer from './components/Footer';
import CustomerDashboard from './pages/CustomerDashboard';
import ShopOwnerDashboard from './pages/ShopOwnerDashboard';

function LandingPage({ theme, onToggleTheme }) {
  return (
    <div className="app">
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <BookingForm />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    // Persist theme across reloads
    return localStorage.getItem('gasgo-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gasgo-theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <Routes>
      <Route path="/" element={<LandingPage theme={theme} onToggleTheme={toggleTheme} />} />
      <Route
        path="/customer"
        element={
          <div className="app">
            <Navbar theme={theme} onToggleTheme={toggleTheme} />
            <main><CustomerDashboard /></main>
            <Footer />
          </div>
        }
      />
      <Route
        path="/shop-owner"
        element={
          <div className="app">
            <Navbar theme={theme} onToggleTheme={toggleTheme} />
            <main><ShopOwnerDashboard /></main>
            <Footer />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
