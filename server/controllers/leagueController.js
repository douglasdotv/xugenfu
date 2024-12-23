const leagueService = require('../services/leagueService');
const League = require('../models/league');

const getAllLeagues = async (_req, res) => {
  try {
    const leagues = await League.find({}).lean();
    res.status(200).json(leagues);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leagues' });
  }
};

const getLatestLeague = async (_req, res) => {
  try {
    const latestLeague = await League.findOne({})
      .sort({ lastUpdated: -1 })
      .lean();

    if (!latestLeague) {
      return res.status(404).json({ error: 'No leagues found' });
    }

    res.status(200).json(latestLeague);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get latest league' });
  }
};

const getLeague = async (req, res) => {
  try {
    const { fsid } = req.params;

    if (!fsid) {
      return res.status(400).json({ error: 'Missing friendly league ID' });
    }

    const league = await League.findOne({ fsid }).lean();

    if (!league) {
      return res.status(404).json({ error: 'League not found' });
    }

    return res.status(200).json(league);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Failed to get friendly league data' });
  }
};

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
  getAllLeagues,
  getLatestLeague,
  getLeague,
  fetchLeagueData,
};
