const express = require('express');
const router = express.Router();
const upload = require('../../../middleware/uploadFile');

const teamController = require('../controllers/team');
const authController = require('../../user/controllers/auth');

router.post(
  '/add',
  authController.protect,
  upload.single('TeamLogo'),
  teamController.addTeam
);

router.get(
  '/tournament/:TournamentID/teams-attend-tournament',
  teamController.getAllTeamsAttendTournament
);

router.get('/my-teams', authController.protect, teamController.getAllMyTeams);

router.get(
  '/teams-attend-tournaments',
  teamController.getTeamsAttendTournaments
);

router.put(
  '/:TeamID/update',
  authController.protect,
  upload.single('TeamLogo'),
  teamController.updateTeam
);

router.post(
  '/add-teams-tournament',
  authController.protect,
  teamController.addTeamsInTournament
);
module.exports = router;
