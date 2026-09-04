import { api } from './client';

export const getMyShop = () => api.get('/shops/mine');
export const createShop = (data) => api.post('/shops', data);
