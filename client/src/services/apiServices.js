import api from './api'

export const authService = {
  register: (name, username, email, password) =>
    api.post('/auth/register', { name, username, email, password }),

  login: (identifier, password) =>
    api.post('/auth/login', { identifier, password }),

  getMe: () => api.get('/auth/me'),

  logout: () => api.post('/auth/logout'),
}

export const userService = {
  getProfile: () => api.get('/users/profile'),

  updateProfile: (data) => api.put('/users/profile', data),

  updatePreferences: (prefs) => api.put('/users/preferences', prefs),

  changePassword: (currentPassword, newPassword) =>
    api.put('/users/password', { currentPassword, newPassword }),

  getStats: () => api.get('/users/stats'),

  getPublicProfile: (username) => api.get(`/users/${username}`),
}

export const testService = {
  submit: (testData) => api.post('/tests', testData),

  getHistory: (params) => api.get('/tests/history', { params }),

  getTest: (id) => api.get(`/tests/${id}`),

  deleteTest: (id) => api.delete(`/tests/${id}`),

  clearHistory: () => api.delete('/tests'),
}

export const leaderboardService = {
  get: (params) => api.get('/leaderboard', { params }),
}

export const passageService = {
  get: (params) => api.get('/passages', { params }),

  create: (data) => api.post('/passages', data),

  update: (id, data) => api.put(`/passages/${id}`, data),

  delete: (id) => api.delete(`/passages/${id}`),
}

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleBan: (id) => api.put(`/admin/users/${id}/ban`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
}
