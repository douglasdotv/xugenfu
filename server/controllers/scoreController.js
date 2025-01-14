const League = require('../models/league');
const { Prediction } = require('../models/prediction');
const User = require('../models/user');
const scoringService = require('../services/scoringService');

const getLeaderboard = async (req, res) => {
  try {
    const { fsid } = req.params;

    const [league, predictions, users] = await Promise.all([
      League.findOne({ fsid }),
      Prediction.find({ fsid }),
      User.find({}, 'username name mzUsername teamId teamName'),
    ]);

    if (!league) {
      return res.status(404).json({ error: 'League not found' });
    }

    const leaderboard = users.map((user) => ({
      userId: user._id,
      username: user.username,
      name: user.name,
      mzUsername: user.mzUsername,
      teamId: user.teamId,
      teamName: user.teamName,
      totalPoints: 0,
      roundScores: {},
      rank: 1, // Just a placeholder value, will be properly calculated later
    }));

    if (predictions && predictions.length > 0) {
      const scoredLeaderboard = await scoringService.calculateLeaderboard(
        league,
        predictions
      );

      scoredLeaderboard.forEach((entry) => {
        const userIndex = leaderboard.findIndex(
          (item) => item.userId.toString() === entry.userId.toString()
        );
        if (userIndex !== -1) {
          leaderboard[userIndex] = {
            ...leaderboard[userIndex],
            totalPoints: entry.totalPoints,
            roundScores: entry.roundScores,
            rank: entry.rank,
          };
        }
      });
    }

    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    res.json(leaderboard);
  } catch (error) {
    console.error('Error in getLeaderboard:', error);
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

    const scores = {
      totalScore: 0,
      roundScores: league.rounds.map((round) => ({
        roundNumber: round.roundNumber,
        score: 0,
        predictions: [],
      })),
    };

    if (predictions && predictions.length > 0) {
      scores.roundScores = league.rounds.map((round) => {
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

      scores.totalScore = scores.roundScores.reduce(
        (sum, round) => sum + round.score,
        0
      );
    }

    res.json(scores);
  } catch (error) {
    console.error('Error in getUserScores:', error);
    res.status(500).json({ error: 'Failed to calculate user scores' });
  }
};

module.exports = {
  getLeaderboard,
  getUserScores,
};
