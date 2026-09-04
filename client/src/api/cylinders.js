import { api } from './client';

export const getMyCylinders = () => api.get('/cylinders');
export const createCylinder = (data) => api.post('/cylinders', data);
export const updateCylinder = (id, data) => api.patch(`/cylinders/${id}`, data);
export const updateCylinderStock = (id, availableQuantity) => api.patch(`/cylinders/${id}/stock`, { availableQuantity });
export const deleteCylinder = (id) => api.del(`/cylinders/${id}`);
export const getShopCylinders = (shopId) => api.get(`/cylinders/shop/${shopId}`);
