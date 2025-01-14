const User = require('../models/user');
const { MATCH_OUTCOMES } = require('../models/prediction');

const POINTS_FOR_CORRECT = 3;
const POINTS_FOR_INCORRECT = 0;

const getMatchOutcome = (result) => {
  if (!result || typeof result !== 'string') return null;

  const scores = result.trim().split('-');
  if (scores.length !== 2) return null;

  const [homeScore, awayScore] = scores.map((s) => parseInt(s, 10));
  if (isNaN(homeScore) || isNaN(awayScore)) return null;

  if (homeScore > awayScore) return MATCH_OUTCOMES.HOME_WIN;
  if (homeScore < awayScore) return MATCH_OUTCOMES.AWAY_WIN;
  return MATCH_OUTCOMES.DRAW;
};

const calculateRoundScore = (predictions, matches) => {
  const validMatches = matches.filter((match) => !match.isVoided);

  let totalPoints = 0;

  validMatches.forEach((match) => {
    const prediction = predictions.find((p) => p.matchId === match.matchId);
    if (!prediction || !match.result) return;

    const actualOutcome = getMatchOutcome(match.result);
    totalPoints +=
      prediction.prediction === actualOutcome
        ? POINTS_FOR_CORRECT
        : POINTS_FOR_INCORRECT;
  });

  return totalPoints;
};

const calculateLeaderboard = async (league, predictions) => {
  const activeUsers = await User.find(
    {},
    'username name mzUsername teamId teamName'
  );

  const userScores = {};
  activeUsers.forEach((user) => {
    userScores[user._id.toString()] = {
      userId: user._id,
      totalPoints: 0,
      roundScores: {},
    };
  });

  if (predictions && predictions.length > 0) {
    league.rounds.forEach((round) => {
      const roundPredictions = predictions.filter((prediction) =>
        round.matches.some((match) => match.matchId === prediction.matchId)
      );

      const userRoundPredictions = {};
      roundPredictions.forEach((prediction) => {
        if (!userRoundPredictions[prediction.userId]) {
          userRoundPredictions[prediction.userId] = [];
        }
        userRoundPredictions[prediction.userId].push(prediction);
      });

      Object.entries(userRoundPredictions).forEach(
        ([userId, userPredictions]) => {
          const roundScore = calculateRoundScore(
            userPredictions,
            round.matches
          );
          if (userScores[userId]) {
            userScores[userId].roundScores[round.roundNumber] = roundScore;
            userScores[userId].totalPoints += roundScore;
          }
        }
      );
    });
  }

  return Object.values(userScores)
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((score, index) => {
      const user = activeUsers.find(
        (u) => u._id.toString() === score.userId.toString()
      );
      return {
        ...score,
        rank: index + 1,
        username: user.username,
        name: user.name,
        mzUsername: user.mzUsername,
        teamId: user.teamId,
        teamName: user.teamName,
      };
    });
};

module.exports = {
  calculateRoundScore,
  calculateLeaderboard,
  POINTS_FOR_CORRECT,
  POINTS_FOR_INCORRECT,
};
