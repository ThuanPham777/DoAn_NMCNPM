const express = require('express');

const router = express.Router();

const reportController = require('../controllers/reports');

router.get(
  '/tournament/:TournamentID/topScorePlayers',
  reportController.getTopScorePlayers
);

module.exports = router;
