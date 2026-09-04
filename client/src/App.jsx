import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import BookingForm from './components/BookingForm';
import Testimonials from './components/Testimonials';
import CTABanner from './components/CTABanner';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import ShopOwnerDashboard from './pages/ShopOwnerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const AUTH_ROUTES = ['/login', '/register'];

function Landing() {
  return (
    <>
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <BookingForm />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    // Persist theme across reloads
    return localStorage.getItem('gasgo-theme') || 'dark';
  });

  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gasgo-theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <div className="app">
      {!isAuthPage && <Navbar theme={theme} onToggleTheme={toggleTheme} />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/customer"
          element={
            <ProtectedRoute role="CUSTOMER">
              <main><CustomerDashboard /></main>
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop-owner"
          element={
            <ProtectedRoute role="SHOP_OWNER">
              <main><ShopOwnerDashboard /></main>
              <Footer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
