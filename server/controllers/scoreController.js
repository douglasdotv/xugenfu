const League = require('../models/league');
const Prediction = require('../models/prediction');
const User = require('../models/user');
const scoringService = require('../services/scoringService');

const getLeaderboard = async (req, res) => {
  try {
    const { fsid } = req.params;

    const [league, predictions] = await Promise.all([
      League.findOne({ fsid }),
      Prediction.find({ fsid }),
    ]);

    if (!league) {
      return res.status(404).json({ error: 'League not found' });
    }

    const leaderboard = await scoringService.calculateLeaderboard(
      league,
      predictions
    );

    const userIds = leaderboard.map((entry) => entry.userId);
    const users = await User.find({ _id: { $in: userIds } });
    const userMap = users.reduce((acc, user) => {
      acc[user._id] = user;
      return acc;
    }, {});

    const leaderboardWithUserDetails = leaderboard.map((entry) => ({
      ...entry,
      username: userMap[entry.userId]?.username,
      name: userMap[entry.userId]?.name,
    }));

    res.json(leaderboardWithUserDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate leaderboard' });
  }
};

const getUserScores = async (req, res) => {
  try {
    const { fsid } = req.params;
    const userId = req.user._id;

    const [league, predictions] = await Promise.all([
      League.findOne({ fsid }),
      Prediction.find({ fsid, userId }),
    ]);

    if (!league) {
      return res.status(404).json({ error: 'League not found' });
    }

    const scores = league.rounds.map((round) => {
      const roundPredictions = predictions.filter((prediction) =>
        round.matches.some((match) => match.matchId === prediction.matchId)
      );

      return {
        roundNumber: round.roundNumber,
        score: scoringService.calculateRoundScore(
          roundPredictions,
          round.matches
        ),
        predictions: roundPredictions,
      };
    });

    const totalScore = scores.reduce((sum, round) => sum + round.score, 0);

    res.json({
      totalScore,
      roundScores: scores,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate user scores' });
  }
};

module.exports = {
  getLeaderboard,
  getUserScores,
};
