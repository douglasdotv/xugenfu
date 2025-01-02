import { authApiClient } from './apiClient';

const getAvailableMatches = async (fsid) => {
  const response = await authApiClient.get(
    `/predictions/available-matches/${fsid}`
  );
  return response.data;
};

const getUserPredictions = async (fsid) => {
  const response = await authApiClient.get(`/predictions/league/${fsid}`);
  return response.data;
};

const submitPrediction = async (matchId, prediction, fsid) => {
  const response = await authApiClient.post(`/predictions/${matchId}`, {
    prediction,
    fsid,
  });
  return response.data;
};

export default {
  getAvailableMatches,
  getUserPredictions,
  submitPrediction,
};
