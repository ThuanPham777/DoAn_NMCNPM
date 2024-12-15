const express = require('express');
const router = express.Router();

const roundController = require('../controllers/round');

router.get('/:TournamentID/result', roundController.getRoundResult);

module.exports = router;
