const express = require('express');
const router = express.Router();

const ruleController = require('../controllers/rule.controller');
const { protect } = require('../../../middleware/auth.middleware');

router.get('/tournament/:TournamentID', ruleController.getRule);

router.put(
  '/tournament/:TournamentID/update',
  protect,
  ruleController.updateRule
);

module.exports = router;
