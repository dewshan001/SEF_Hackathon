import { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

// ── Helper: load persisted state from localStorage ────────────────────────
function loadPersistedAuth() {
  try {
    const user  = JSON.parse(localStorage.getItem('gasgo-user') || 'null');
    const token = localStorage.getItem('gasgo-token') || null;
    return { user, token };
  } catch {
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(() => loadPersistedAuth().user);
  const [token, setToken] = useState(() => loadPersistedAuth().token);

  // ── Persist helpers ────────────────────────────────────────────────────
  const persistAuth = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('gasgo-user',  JSON.stringify(userData));
    localStorage.setItem('gasgo-token', jwtToken);
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('gasgo-user');
    localStorage.removeItem('gasgo-token');
  };

  // ── login ──────────────────────────────────────────────────────────────
  // Returns { success: true } or { success: false, message, fieldErrors }
  const login = useCallback(async ({ email, password }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      persistAuth(data, data.token);
      return { success: true, user: data };
    } catch (err) {
      const res = err.response?.data;
      return {
        success: false,
        message: res?.message || 'Login failed. Please try again.',
        fieldErrors: res?.errors || [],
      };
    }
  }, []);

  // ── register ───────────────────────────────────────────────────────────
  const register = useCallback(async ({ name, email, phone, address, password, role }) => {
    try {
      const cleanPhone = phone ? String(phone).trim().replace(/[\s-]/g, '') : phone;
      const payload = {
        name: name ? String(name).trim() : '',
        email: email ? String(email).trim() : '',
        phone: cleanPhone,
        password,
        ...(role && { role }),
        ...(address && {
          address: {
            textAddress: typeof address === 'string' ? address.trim() : address,
            coordinates: [0, 0], // coordinates updated later via map
          },
        }),
      };
      const { data } = await api.post('/auth/register', payload);
      persistAuth(data, data.token);
      return { success: true, user: data };
    } catch (err) {
      const res = err.response?.data;
      let errorMsg = res?.message || 'Registration failed. Please try again.';
      if (res?.errors && Array.isArray(res.errors) && res.errors.length > 0) {
        errorMsg = res.errors.map(e => e.message || `${e.field}: invalid`).join('. ');
      }
      return {
        success: false,
        message: errorMsg,
        fieldErrors: res?.errors || [],
      };
    }
  }, []);

  // ── logout ─────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearAuth();
  }, []);

  // ── fetchMe: refresh user from server ─────────────────────────────────
  const fetchMe = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
      localStorage.setItem('gasgo-user', JSON.stringify(data));
    } catch {
      clearAuth();
    }
  }, [token]);

  const isAuthenticated = Boolean(token && user);
  const role = user?.role || null;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, role, login, register, logout, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
