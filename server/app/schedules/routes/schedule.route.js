const express = require('express');
const router = express.Router();

const scheduleController = require('../controllers/schedule.controller');
const { protect } = require('../../../middleware/auth.middleware');

router.post(
  '/:TournamentID/create',
  protect,
  scheduleController.createSchedule
);

router.get('/:TournamentID', scheduleController.getSchedule);

router.put(
  '/tournament/:TournamentID/round/:RoundID/match/:MatchID/update',
  protect,
  scheduleController.updateDatetimeOfMatch
);

module.exports = router;
