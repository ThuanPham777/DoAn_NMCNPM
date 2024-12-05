const express = require('express');
const router = express.Router();

const ruleController = require('../controllers/rule');

router.get('/tournament/:TournamentID', ruleController.getRule);

router.put('/tournament/:TournamentID/update', ruleController.updateRule);

module.exports = router;
