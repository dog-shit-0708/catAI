import apiClient from './client.js'

export default {
  getCats(params = {}) {
    const { keyword, adoption_status, location_area, page = 1, page_size = 20 } = params
    let url = `/cats?page=${page}&page_size=${page_size}`
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`
    if (adoption_status !== undefined && adoption_status !== null) url += `&adoption_status=${adoption_status}`
    if (location_area) url += `&location_area=${encodeURIComponent(location_area)}`
    return apiClient.get(url)
  },

  getCat(id) {
    return apiClient.get(`/cats/${id}`)
  },

  getCatGallery(id) {
    return apiClient.get(`/cats/${id}/gallery`)
  },

  feedCat(id) {
    return apiClient.post(`/cats/${id}/feed`)
  },

  favoriteCat(id) {
    return apiClient.post(`/cats/${id}/favorite`)
  },

  uploadIdentifyImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/cats/identify/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 100000
    })
  }
}
