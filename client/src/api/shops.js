import { api } from './client';

export const getAllShops = () => api.get('/shops');
export const getShopById = (id) => api.get(`/shops/${id}`);
export const getShopCylinders = (shopId) => api.get(`/cylinders/shop/${shopId}`);
export const getMyShop = () => api.get('/shops/mine');
export const createShop = (data) => api.post('/shops', data);
export const updateMyShop = (data) => api.patch('/shops/mine', data);
