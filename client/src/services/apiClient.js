import axios from 'axios';

const AUTH_ERROR_EVENT = 'auth-error';

export const authErrorEventEmitter = {
  listeners: [],
  emit() {
    this.listeners.forEach((listener) => listener());
  },
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  },
};

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

    client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          authErrorEventEmitter.emit();
        }
        return Promise.reject(error);
      }
    );
  }

  return client;
};

export const apiClient = createApiClient(false);
export const authApiClient = createApiClient(true);
