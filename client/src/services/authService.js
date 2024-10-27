import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

const login = async (credentials) => {
  const response = await apiClient.post('/users/login', credentials)
  return response.data
}

const register = async (userData) => {
  const response = await apiClient.post('/users/register', userData)
  return response.data
}

export default {
  login,
  register,
}
