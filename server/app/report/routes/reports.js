const express = require('express');

const router = express.Router();

const reportController = require('../controllers/reports');

router.get(
  '/tournament/:TournamentID/topScorePlayers',
  reportController.getTopScorePlayers
);

router.get(
  '/tournament/:TournamentID/rank',
  reportController.getTournamentRank
);

module.exports = router;
