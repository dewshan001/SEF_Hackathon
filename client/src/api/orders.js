import { api } from './client';

export const createOrder = (data) => api.post('/orders', data);
export const getMyOrders = () => api.get('/orders/mine');
export const getShopOrders = () => api.get('/orders/shop');
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
