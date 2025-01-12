const League = require('../models/league');
const Prediction = require('../models/prediction');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { APP_ELECTED_TIMEZONE } = require('../utils/config');

dayjs.extend(utc);
dayjs.extend(timezone);

const getAvailableMatches = async (req, res) => {
  try {
    const { fsid } = req.params;
    const now = new Date();

    const league = await League.findOne({ fsid });
    if (!league) {
      return res.status(404).json({ error: 'League not found' });
    }

    const availableMatches = [];

    league.rounds.forEach((round) => {
      const roundDate = new Date(round.date);

      if (roundDate > now) {
        round.matches.forEach((match) => {
          const deadline = dayjs(roundDate)
            .tz(APP_ELECTED_TIMEZONE)
            .subtract(2, 'hour')
            .toDate();

          if (dayjs().tz(APP_ELECTED_TIMEZONE).isBefore(deadline)) {
            availableMatches.push({
              roundNumber: round.roundNumber,
              matchDate: roundDate,
              deadline,
              ...match.toObject(),
            });
          }
        });
      }
    });

    res.status(200).json(availableMatches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available matches' });
  }
};

const getUserPredictions = async (req, res) => {
  try {
    const { fsid } = req.params;
    const userId = req.user._id;

    const predictions = await Prediction.find({ userId, fsid });
    res.status(200).json(predictions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
};

const submitPrediction = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { prediction, fsid } = req.body;
    const userId = req.user._id;

    const league = await League.findOne({ fsid });
    if (!league) {
      return res.status(404).json({ error: 'League not found' });
    }

    let matchFound = false;
    let matchDate;

    for (const round of league.rounds) {
      const match = round.matches.find((m) => m.matchId === matchId);
      if (match) {
        matchFound = true;
        matchDate = round.date;
        break;
      }
    }

    if (!matchFound) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (dayjs(matchDate).isBefore(dayjs())) {
      return res.status(400).json({ error: 'Cannot predict past matches' });
    }

    const deadline = dayjs(matchDate)
      .tz(APP_ELECTED_TIMEZONE)
      .subtract(2, 'hour');
    if (dayjs().isAfter(deadline)) {
      return res.status(400).json({ error: 'Prediction deadline has passed' });
    }

    const predictionUpdate = await Prediction.findOneAndUpdate(
      { userId, matchId },
      { userId, matchId, fsid, prediction },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json(predictionUpdate);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to submit prediction' });
  }
};

module.exports = {
  getAvailableMatches,
  getUserPredictions,
  submitPrediction,
};
