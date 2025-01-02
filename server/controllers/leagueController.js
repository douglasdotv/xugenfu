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

const updateMatchVoidStatus = async (req, res) => {
  try {
    const { fsid, matchId } = req.params;
    const { isVoided, voidReason } = req.body;

    const league = await League.findOne({ fsid });
    if (!league) {
      return res.status(404).json({ error: 'League not found' });
    }

    let matchUpdated = false;

    for (const round of league.rounds) {
      const matchIndex = round.matches.findIndex((m) => m.matchId === matchId);
      if (matchIndex !== -1) {
        round.matches[matchIndex].isVoided = isVoided;
        round.matches[matchIndex].voidReason = voidReason;
        matchUpdated = true;
        break;
      }
    }

    if (!matchUpdated) {
      return res.status(404).json({ error: 'Match not found' });
    }

    await league.save();
    res.status(200).json({ message: 'Match void status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update match void status' });
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
  updateMatchVoidStatus,
  fetchLeagueData,
};
