import api from './api';

export const propertyApi = {
  list: (params) => api.get('/properties', { params }),
  getOne: (idOrSlug) => api.get(`/properties/${idOrSlug}`),
  mine: (params) => api.get('/properties/mine', { params }),
  createInquiry: (id, data) => api.post(`/properties/${id}/inquiries`, data),
  receivedInquiries: () => api.get('/properties/inquiries'),
  updateInquiryStatus: (inquiryId, data) => api.put(`/properties/inquiries/${inquiryId}/status`, data),
  create: (formData) => api.post('/properties', formData),
  update: (id, formData) => api.put(`/properties/${id}`, formData),
  remove: (id) => api.delete(`/properties/${id}`),
  adminList: (params) => api.get('/properties/admin/all', { params }),
  moderate: (id, data) => api.put(`/properties/${id}/moderate`, data),
};
