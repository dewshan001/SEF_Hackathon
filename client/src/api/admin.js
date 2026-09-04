import { api } from './client';

export const getAdminStats = () => api.get('/admin/stats');
export const getAdminUsers = () => api.get('/admin/users');
export const getAdminCustomers = () => api.get('/admin/customers');
export const getAdminOwners = () => api.get('/admin/owners');
export const getAdminShops = () => api.get('/admin/shops');
export const getAdminCylinders = () => api.get('/admin/cylinders');
export const getAdminOrders = () => api.get('/admin/orders');
