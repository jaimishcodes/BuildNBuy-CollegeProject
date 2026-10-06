import api from './api';

export const contactApi = {
  submit: (data) => api.post('/contact', data),
};

export const requirementApi = {
  create: (data) => api.post('/construction-requirements', data),
  mine: () => api.get('/construction-requirements/mine'),
  received: (params) => api.get('/construction-requirements/received', { params }),
  updateStatus: (id, data) => api.put(`/construction-requirements/${id}/status`, data),
  sendMessage: (id, data) => api.post(`/construction-requirements/${id}/messages`, data),
};

export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),
  contactMessages: (params) => api.get('/contact', { params }),
  users: (params) => api.get('/users', { params }),
  toggleBlockUser: (id, data) => api.put(`/users/${id}/block`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};
