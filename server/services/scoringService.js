const User = require('../models/user');

const calculateRoundScore = (predictions, matches) => {
  const validMatches = matches.filter((match) => !match.isVoided);
  const totalMatches = validMatches.length;

  if (totalMatches === 0) return 0;

  let correctPredictions = 0;

  validMatches.forEach((match) => {
    const prediction = predictions.find((p) => p.matchId === match.matchId);
    if (prediction && match.result && prediction.prediction === match.result) {
      correctPredictions++;
    }
  });

  const scoreTable = {
    8: { pointsPerMatch: 3, total: 24 },
    7: { pointsPerMatch: 2.5, total: 17.5 },
    6: { pointsPerMatch: 2, total: 12 },
    5: { pointsPerMatch: 1.5, total: 7.5 },
    4: { pointsPerMatch: 1, total: 4 },
    3: { pointsPerMatch: 1, total: 3 },
    2: { pointsPerMatch: 1, total: 2 },
    1: { pointsPerMatch: 1, total: 1 },
    0: { pointsPerMatch: 0, total: 0 },
  };

  return scoreTable[correctPredictions]?.total || 0;
};

const calculateLeaderboard = async (league, predictions) => {
  const activeUsers = await User.find(
    {},
    'username name mzUsername teamId teamName'
  );
  const activeUserIds = activeUsers.reduce((map, user) => {
    map[user._id.toString()] = user;
    return map;
  }, {});

  const activePredictions = predictions.filter(
    (prediction) => activeUserIds[prediction.userId.toString()]
  );

  const userScores = {};

  activePredictions.forEach((prediction) => {
    if (!userScores[prediction.userId]) {
      userScores[prediction.userId] = {
        userId: prediction.userId,
        totalPoints: 0,
        roundScores: {},
      };
    }
  });

  league.rounds.forEach((round) => {
    const roundPredictions = activePredictions.filter((prediction) =>
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
        const roundScore = calculateRoundScore(userPredictions, round.matches);
        userScores[userId].roundScores[round.roundNumber] = roundScore;
        userScores[userId].totalPoints += roundScore;
      }
    );
  });

  return Object.values(userScores)
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((score, index) => {
      const user = activeUserIds[score.userId.toString()];
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
};
