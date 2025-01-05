const cheerio = require('cheerio');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const logger = require('../utils/logger');

dayjs.extend(customParseFormat);

const ROUND_PATTERNS = {
  CHINESE: /轮 (\d+) - (\d{4}-\d{2}-\d{2} \d{2}:\d{2})/,
  ENGLISH: /Round (\d+) - (\d{2}\/\d{2}\/\d{4} \d{1,2}:\d{2}(?:am|pm))/i,
};

const DATE_FORMATS = {
  CHINESE: 'YYYY-MM-DD HH:mm',
  ENGLISH: 'DD/MM/YYYY h:mma',
};

const parseRoundText = (text) => {
  let match = text.match(ROUND_PATTERNS.CHINESE);
  if (match) {
    return {
      roundNumber: parseInt(match[1]),
      dateStr: match[2],
      format: DATE_FORMATS.CHINESE,
    };
  }

  match = text.match(ROUND_PATTERNS.ENGLISH);
  if (match) {
    return {
      roundNumber: parseInt(match[1]),
      dateStr: match[2],
      format: DATE_FORMATS.ENGLISH,
    };
  }

  logger.error(`Unable to parse round text: ${text}`);
  return null;
};

const parseLeagueData = (html) => {
  const $ = cheerio.load(html);
  const rounds = [];

  $('h2.subheader').each((_i, roundHeader) => {
    const roundText = $(roundHeader).text();
    const parsedRound = parseRoundText(roundText);

    if (!parsedRound) {
      logger.error(`Skipping round due to parsing failure: ${roundText}`);
      return;
    }

    const { roundNumber, dateStr, format } = parsedRound;
    const parsed = dayjs(dateStr, format);
    let date;

    if (parsed.isValid()) {
      date = parsed.toDate();
    } else {
      logger.error(`Invalid date detected: ${dateStr}`);
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
