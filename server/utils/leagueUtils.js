const cheerio = require('cheerio');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { APP_ELECTED_TIMEZONE } = require('../utils/config');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const logger = require('./logger');

dayjs.extend(utc);
dayjs.extend(timezone);
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

    let parsed = dayjs.tz(dateStr, format, APP_ELECTED_TIMEZONE);
    if (!parsed.isValid()) {
      logger.error(
        `Invalid date detected for round ${roundNumber}: ${dateStr}`
      );
      return;
    }
    logger.info(
      `Round ${roundNumber} adjusted time: ${parsed.format(
        'YYYY-MM-DD HH:mm:ss Z'
      )}`
    );

    const matches = [];
    const matchTable = $(roundHeader).next('div').find('table tr');

    matchTable.each((j, match) => {
      const homeTeam = $(match).find('td:nth-child(1)').text().trim();
      const matchLink = $(match).find('td:nth-child(2) a');
      const awayTeam = $(match).find('td:nth-child(3)').text().trim();

      const matchId = matchLink.attr('href')?.split('mid=')[1];
      const result = matchLink.text();

      if (!matchId) {
        logger.error(`Invalid match ID for ${homeTeam} vs ${awayTeam}`);
        return;
      }

      matches.push({
        homeTeam,
        awayTeam,
        matchId,
        result: result === 'X - X' ? null : result,
        isVoided: false,
        voidReason: null,
      });
    });

    if (matches.length > 0) {
      rounds.push({
        roundNumber,
        date: parsed.toDate(),
        matches,
      });
    } else {
      logger.error(`No valid matches found for round ${roundNumber}`);
    }
  });

  if (rounds.length === 0) {
    logger.error('No valid rounds parsed from league data');
  } else {
    logger.info(`Successfully parsed ${rounds.length} rounds`);
  }

  return rounds;
};

module.exports = {
  parseLeagueData,
};
