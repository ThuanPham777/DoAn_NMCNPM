const express = require('express');
const router = express.Router();
const createUploadMiddleware = require('../../../middleware/uploadFile'); // Import middleware upload
const uploadTournament = createUploadMiddleware('uploads/teams'); // Middleware upload cho tournaments

const teamController = require('../controllers/team');
const authController = require('../../user/controllers/auth');

router.post(
  '/add',
  authController.protect,
  uploadTournament.single('TeamLogo'),
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
  uploadTournament.single('TeamLogo'),
  teamController.updateTeam
);

router.post(
  '/add-teams-tournament',
  authController.protect,
  teamController.addTeamsInTournament
);
module.exports = router;
