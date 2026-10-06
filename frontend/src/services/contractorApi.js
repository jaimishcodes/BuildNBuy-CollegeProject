import api from './api';

export const contractorApi = {
  list: (params) => api.get('/contractors', { params }),
  getOne: (id) => api.get(`/contractors/${id}`),
  me: () => api.get('/contractors/me'),
  updateMe: (formData) => api.put('/contractors/me', formData),
  adminList: (params) => api.get('/contractors/admin/all', { params }),
  verify: (id, data) => api.put(`/contractors/${id}/verify`, data),
};
