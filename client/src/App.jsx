import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import AdminDashboard from './pages/admin/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import ShopOwnerDashboard from './pages/ShopOwnerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Customer pages
import CustomerLayout from './pages/customer/CustomerLayout';
import CustomerDashboardHome from './pages/customer/CustomerDashboardHome';
import ShopList from './pages/customer/ShopList';
import ShopDetail from './pages/customer/ShopDetail';
import Cart from './pages/customer/Cart';
import OrderHistory from './pages/customer/OrderHistory';
import CustomerOrderDetail from './pages/customer/CustomerOrderDetail';

// Owner pages
import OwnerLayout from './pages/owner/OwnerLayout';
import OwnerDashboardHome from './pages/owner/OwnerDashboardHome';
import ManageCylinders from './pages/owner/ManageCylinders';
import ManageOrders from './pages/owner/ManageOrders';
import ManageShop from './pages/owner/ManageShop';
import OwnerFeedbacks from './pages/owner/OwnerFeedbacks';

// Admin pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminUsers from './pages/admin/AdminUsers';
import AdminShops from './pages/admin/AdminShops';
import AdminOrders from './pages/admin/AdminOrders';

const AUTH_ROUTES = ['/login', '/register'];
const DASH_PREFIXES = ['/customer', '/owner', '/admin'];

function Landing() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      }
    }
  }, [location.hash]);

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

function RootRoute() {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (role === 'SHOP_OWNER') return <Navigate to="/owner/dashboard" replace />;
  if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/customer/dashboard" replace />;
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('gasgo-theme') || 'dark');
  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);
  const isDashPage = DASH_PREFIXES.some(p => location.pathname.startsWith(p));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gasgo-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <div className="app">
      {!isAuthPage && !isDashPage && <Navbar theme={theme} onToggleTheme={toggleTheme} />}
      <Routes>
        {/* Root URL -> Login (or role dashboard if authenticated) */}
        <Route path="/" element={<RootRoute />} />

        {/* Landing Page */}
        <Route path="/home" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Legacy redirects */}
        <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="/shop-owner" element={<Navigate to="/owner/dashboard" replace />} />

        {/* ── Customer Routes ─────────────────────────────────────────────── */}
        <Route
          path="/customer/*"
          element={
            <ProtectedRoute role="CUSTOMER">
              <CustomerLayout>
                <Routes>
                  <Route path="dashboard" element={<CustomerDashboardHome />} />
                  <Route path="shops" element={<ShopList />} />
                  <Route path="shops/:id" element={<ShopDetail />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="orders" element={<OrderHistory />} />
                  <Route path="orders/:id" element={<CustomerOrderDetail />} />
                  <Route path="*" element={<Navigate to="/customer/dashboard" replace />} />
                </Routes>
              </CustomerLayout>
            </ProtectedRoute>
          }
        />

        {/* ── Owner Routes ────────────────────────────────────────────────── */}
        <Route
          path="/owner/*"
          element={
            <ProtectedRoute role="SHOP_OWNER">
              <OwnerLayout>
                <Routes>
                  <Route path="dashboard" element={<OwnerDashboardHome />} />
                  <Route path="cylinders" element={<ManageCylinders />} />
                  <Route path="orders" element={<ManageOrders />} />
                  <Route path="feedbacks" element={<OwnerFeedbacks />} />
                  <Route path="shop" element={<ManageShop />} />
                  <Route path="*" element={<Navigate to="/owner/dashboard" replace />} />
                </Routes>
              </OwnerLayout>
            </ProtectedRoute>
          }
        />

        {/* ── Admin Routes ────────────────────────────────────────────────── */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="shops" element={<AdminShops />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
