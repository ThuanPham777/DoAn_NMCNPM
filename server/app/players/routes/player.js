const express = require('express');
const router = express.Router();

const createUploadMiddleware = require('../../../middleware/uploadFile'); // Import middleware upload
const uploadPlayer = createUploadMiddleware('uploads/players'); // Middleware upload cho tournaments

const playerController = require('../controllers/player');

router.post(
  '/team/:TeamID/add',
  uploadPlayer.single('ProfileImg'),
  playerController.addPlayer
);

router.put('/team/:TeamID/edit/:PlayerID', playerController.updatePlayer);

router.get(
  '/tournament/:TournamentID',
  playerController.getAllPlayersAttendingTournament
);

router.get('/team/:TeamID', playerController.getAllPlayersOfTeam);

router.get('/:PlayerID', playerController.getPlayerById);

module.exports = router;
