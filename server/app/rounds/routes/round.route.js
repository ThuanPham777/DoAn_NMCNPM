const express = require('express');
const router = express.Router();

const roundController = require('../controllers/round.controller');

router.get('/:TournamentID/result', roundController.getScheduleWithResult);

module.exports = router;
