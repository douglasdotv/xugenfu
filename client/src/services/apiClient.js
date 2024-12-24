import axios from 'axios';

const createApiClient = (useAuth = true) => {
  const client = axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (useAuth) {
    client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  return client;
};

export const apiClient = createApiClient(false);
export const authApiClient = createApiClient(true);
