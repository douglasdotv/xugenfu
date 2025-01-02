const express = require('express');
const scoreController = require('../controllers/scoreController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/leagues/:fsid/leaderboard', scoreController.getLeaderboard);
router.get(
  '/leagues/:fsid/scores',
  authMiddleware.verifyToken,
  scoreController.getUserScores
);

module.exports = router;
