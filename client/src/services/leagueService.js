import { apiClient, authApiClient } from './apiClient';

const getLeague = async (fsid) => {
  const response = await apiClient.get(`/leagues/${fsid}`);
  return response.data;
};

const getActiveLeague = async () => {
  const response = await apiClient.get('/leagues/latest');
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
  fetchLeagueData,
};
