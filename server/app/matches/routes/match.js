const express = require('express');
const router = express.Router();

const matchController = require('../controllers/match');

router.post(
  '/:MatchID/round/:RoundID/tournament/:TournamentID/add-score/player/:PlayerID',
  matchController.addMatchScore
);

router.get(
  '/:MatchID/round/:RoundID/tournament/:TournamentID/details',
  matchController.getMatchDetails
);

module.exports = router;
