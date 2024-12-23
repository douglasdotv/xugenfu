const axios = require('axios');
const { PHPSESSID } = require('../utils/config');
const League = require('../models/league');
const { parseLeagueData } = require('../utils/leagueUtils');

const MANAGERZONE_FRIENDLY_LEAGUE_URL =
  'https://www.managerzone.com/ajax.php?p=friendlySeries&sub=matches';

const fetchLeagueData = async (fsid, phpsessid) => {
  if (!phpsessid) {
    phpsessid = PHPSESSID;
  }

  const response = await axios.get(
    `${MANAGERZONE_FRIENDLY_LEAGUE_URL}&fsid=${fsid}&sport=soccer`,
    {
      headers: {
        Cookie: `PHPSESSID=${phpsessid}`,
      },
    }
  );

  const rounds = parseLeagueData(response.data);

  const updatedLeague = await League.findOneAndUpdate(
    { fsid },
    {
      fsid,
      lastUpdated: new Date(),
      rounds,
    },
    { upsert: true, new: true }
  );

  return updatedLeague;
};

module.exports = {
  fetchLeagueData,
};
