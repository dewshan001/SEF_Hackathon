import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_HOME = {
  CUSTOMER: '/customer',
  SHOP_OWNER: '/shop-owner',
  ADMIN: '/admin',
};

export default function ProtectedRoute({ role, children }) {
  const { isAuthenticated, role: userRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to={ROLE_HOME[userRole] || '/'} replace />;
  }

  return children;
}
