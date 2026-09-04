import { api } from './client';

// Customer
export const createOrder = (data) => api.post('/orders', data);
export const getMyOrders = () => api.get('/orders/my');
export const getOrderById = (id) => api.get(`/orders/${id}`);

// Shop Owner
export const getShopOrders = () => api.get('/orders/shop/all');
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status });
