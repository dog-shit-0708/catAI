import apiClient from './client.js'

export default {
  register(email, password, nickname = '') {
    return apiClient.post('/auth/web-register', {
      email,
      password,
      nickname
    })
  },

  login(email, password) {
    return apiClient.post('/auth/web-login', {
      email,
      password
    })
  },

  getProfile() {
    return apiClient.get('/auth/profile')
  },

  updateProfile(data) {
    return apiClient.put('/auth/profile', data)
  },

  logout() {
    localStorage.removeItem('token')
  }
}
