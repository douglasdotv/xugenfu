import { authApiClient } from './apiClient';

const login = async (credentials) => {
  const response = await authApiClient.post('/users/login', credentials);
  return response.data;
};

const register = async (userData) => {
  const response = await authApiClient.post('/users/register', userData);
  return response.data;
};

export default {
  login,
  register,
};
