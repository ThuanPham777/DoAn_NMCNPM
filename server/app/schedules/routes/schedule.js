const express = require('express');
const router = express.Router();

const scheduleController = require('../controllers/schedule');

router.post('/:TournamentID/create', scheduleController.createSchedule);

router.get('/:TournamentID', scheduleController.getSchedule);

module.exports = router;
