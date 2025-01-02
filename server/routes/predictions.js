const express = require('express');
const predictionController = require('../controllers/predictionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware.verifyToken);

router.get(
  '/available-matches/:fsid',
  predictionController.getAvailableMatches
);
router.get('/league/:fsid', predictionController.getUserPredictions);
router.post('/:matchId', predictionController.submitPrediction);

module.exports = router;
