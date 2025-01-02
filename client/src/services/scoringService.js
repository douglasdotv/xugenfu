import { authApiClient } from './apiClient';

const getLeaderboard = async (fsid) => {
  const response = await authApiClient.get(
    `/scoring/leagues/${fsid}/leaderboard`
  );
  return response.data;
};

const getUserScores = async (fsid) => {
  const response = await authApiClient.get(`/scoring/leagues/${fsid}/scores`);
  return response.data;
};

export default {
  getLeaderboard,
  getUserScores,
};
