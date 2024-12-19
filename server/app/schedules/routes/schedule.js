const express = require('express');
const router = express.Router();

const scheduleController = require('../controllers/schedule');

router.post('/:TournamentID/create', scheduleController.createSchedule);

router.get('/:TournamentID', scheduleController.getSchedule);

router.put(
  '/tournament/:TournamentID/round/:RoundID/match/:MatchID/update',
  scheduleController.updateDatetimeOfMatch
);

module.exports = router;
