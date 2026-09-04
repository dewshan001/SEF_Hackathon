import { api } from './client';

export const getStocks = () => api.get('/stocks');
export const getMyStocks = () => api.get('/stocks/mine');
export const createStock = (data) => api.post('/stocks', data);
export const updateStock = (id, data) => api.put(`/stocks/${id}`, data);
export const deleteStock = (id) => api.del(`/stocks/${id}`);
