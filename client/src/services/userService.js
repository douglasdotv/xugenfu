import { authApiClient } from './apiClient';

const getAllUsers = async () => {
  const response = await authApiClient.get('/users');
  return response.data;
};

const updateUser = async (userId, userData) => {
  const response = await authApiClient.patch(`/users/${userId}`, userData);
  return response.data;
};

const deleteUser = async (userId) => {
  await authApiClient.delete(`/users/${userId}`);
};

const updatePassword = async (userId, password) => {
  const response = await authApiClient.patch(`/users/${userId}/password`, {
    password,
  });
  return response.data;
};

export default {
  getAllUsers,
  updateUser,
  deleteUser,
  updatePassword,
};
