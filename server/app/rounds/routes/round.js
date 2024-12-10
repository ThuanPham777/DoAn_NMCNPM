const express = require('express');
const router = express.Router();

const roundController = require('../controllers/round');

router.post('/:TournamentID/create', roundController.createRounds);

module.exports = router;
