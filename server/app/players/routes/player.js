const express = require('express');
const router = express.Router();

const upload = require('../../../middleware/uploadFile');

const playerController = require('../controllers/player');

router.post(
  '/team/:TeamID/add',
  upload.single('ProfileImg'),
  playerController.addPlayer
);

router.put(
  '/team/:TeamID/edit/:PlayerID',
  upload.single('ProfileImg'),
  playerController.updatePlayer
);

router.get(
  '/tournament/:TournamentID',
  playerController.getAllPlayersAttendingTournament
);

router.get('/team/:TeamID', playerController.getAllPlayersOfTeam);

router.get('/:PlayerID', playerController.getPlayerById);

router.delete('/:PlayerID/delete', playerController.deletePlayer);

module.exports = router;
