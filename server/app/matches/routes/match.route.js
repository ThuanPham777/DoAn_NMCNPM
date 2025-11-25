const express = require('express');
const router = express.Router();

const matchController = require('../controllers/match.controller');

router.post(
  '/:MatchID/round/:RoundID/tournament/:TournamentID/add-goal/player/:PlayerID',
  matchController.addMatchScore
);

router.post(
  '/:MatchID/round/:RoundID/tournament/:TournamentID/add-card/player/:PlayerID',
  matchController.addMatchCard
);

router.delete(
  '/:MatchID/round/:RoundID/tournament/:TournamentID/delete-goal/player/:PlayerID/minute/:minute',
  matchController.deleteMatchScore
);

router.get(
  '/:MatchID/round/:RoundID/tournament/:TournamentID/details',
  matchController.getMatchDetails
);

module.exports = router;
