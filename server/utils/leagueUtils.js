const cheerio = require('cheerio');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const logger = require('../utils/logger');

dayjs.extend(customParseFormat);

const parseLeagueData = (html) => {
  const $ = cheerio.load(html);
  const rounds = [];

  $('h2.subheader').each((_i, roundHeader) => {
    const roundText = $(roundHeader).text();
    const [roundNum, dateStr] = roundText.split(' - ');
    const roundNumber = parseInt(roundNum.split(' ')[1]);

    const parsed = dayjs(dateStr, 'DD/MM/YYYY h:mma');
    let date;
    if (parsed.isValid()) {
      date = parsed.toDate();
    } else {
      logger.error(`Unusual date detected: ${dateStr}`);
      date = null;
    }

    const matches = [];
    const matchTable = $(roundHeader).next('div').find('table tr');

    matchTable.each((j, match) => {
      const homeTeam = $(match).find('td:nth-child(1)').text().trim();
      const matchLink = $(match).find('td:nth-child(2) a');
      const awayTeam = $(match).find('td:nth-child(3)').text().trim();

      const matchId = matchLink.attr('href').split('mid=')[1];
      const result = matchLink.text();

      matches.push({
        homeTeam,
        awayTeam,
        matchId,
        result: result === 'X - X' ? null : result,
      });
    });

    rounds.push({
      roundNumber,
      date,
      matches,
    });
  });

  return rounds;
};

module.exports = {
  parseLeagueData,
};
