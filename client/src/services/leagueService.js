import { apiClient, authApiClient } from './apiClient';

const getLeague = async (fsid) => {
  const response = await apiClient.get(`/leagues/${fsid}`);
  return response.data;
};

const getActiveLeague = async () => {
  const response = await apiClient.get('/leagues/latest');
  return response.data;
};

const updateMatchVoidStatus = async (fsid, matchId, isVoided, voidReason) => {
  const response = await authApiClient.patch(
    `/leagues/${fsid}/matches/${matchId}/void-status`,
    { isVoided, voidReason }
  );
  return response.data;
};

const fetchLeagueData = async (fsid, phpsessid) => {
  const response = await authApiClient.post('/leagues/fetch-league-data', {
    fsid,
    phpsessid,
  });
  return response.data;
};

export default {
  getLeague,
  getActiveLeague,
  updateMatchVoidStatus,
  fetchLeagueData,
};
