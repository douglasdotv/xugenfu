const express = require('express');
const leagueController = require('../controllers/leagueController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', leagueController.getAllLeagues);
router.get('/latest', leagueController.getLatestLeague);
router.get('/:fsid', leagueController.getLeague);
router.patch(
  '/:fsid/matches/:matchId/void-status',
  authMiddleware.verifyToken,
  authMiddleware.requireAdmin,
  leagueController.updateMatchVoidStatus
);
router.post(
  '/fetch-league-data',
  authMiddleware.verifyToken,
  authMiddleware.requireAdmin,
  leagueController.fetchLeagueData
);

module.exports = router;
