import { api } from './client';

export const getShopFeedbacks = (shopId) => api.get(`/feedbacks/shop/${shopId}`);
export const getOrderFeedback = (orderId) => api.get(`/feedbacks/order/${orderId}`);
export const createFeedback = (shopId, data) => api.post(`/feedbacks/shop/${shopId}`, data);
export const updateFeedback = (id, data) => api.put(`/feedbacks/${id}`, data);
export const deleteFeedback = (id) => api.del(`/feedbacks/${id}`);
