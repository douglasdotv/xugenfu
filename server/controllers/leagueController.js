const leagueService = require('../services/leagueService');

const fetchLeagueData = async (req, res) => {
  try {
    const { fsid, phpsessid } = req.body;

    if (!fsid) {
      return res.status(400).json({ error: 'Missing friendly league ID' });
    }

    await leagueService.fetchLeagueData(fsid, phpsessid);

    res.status(200).json({
      message: 'Friendly league data fetched and updated successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch friendly league data' });
  }
};

module.exports = {
  fetchLeagueData,
};
