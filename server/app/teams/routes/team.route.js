const express = require('express');
const router = express.Router();
const upload = require('../../../middleware/uploadFile.middleware');

const teamController = require('../controllers/team.controller');
const { protect } = require('../../../middleware/auth.middleware');

router.post('/add', protect, upload.single('TeamLogo'), teamController.addTeam);

router.get(
  '/tournament/:TournamentID/teams-attend-tournament',
  teamController.getAllTeamsAttendTournament
);

router.get('/my-teams', protect, teamController.getAllMyTeams);

router.get(
  '/teams-attend-tournaments',
  teamController.getTeamsAttendTournaments
);

router.put(
  '/:TeamID/update',
  protect,
  upload.single('TeamLogo'),
  teamController.updateTeam
);

router.post(
  '/add-teams-tournament',
  protect,
  teamController.addTeamsInTournament
);
module.exports = router;
