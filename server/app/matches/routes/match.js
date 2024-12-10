const express = require('express');
const router = express.Router();

const matchController = require('../controllers/match');

router.post('/:TournamentID/create', matchController.createMatches);

module.exports = router;
