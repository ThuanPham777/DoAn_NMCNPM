const express = require('express');
const router = express.Router();

const tournamentController = require('../controllers/tournament');
const upload = require('../../../middleware/uploadFile');

router.post(
  '/add',
  upload.single('TournamentLogo'),
  tournamentController.addTournament
);

router.put(
  '/update/:TournamentID',
  upload.single('TournamentLogo'),
  tournamentController.updateTournament
);

router.get('/', tournamentController.getAllTournaments);

router.get('/:id', tournamentController.getTournamentById);

module.exports = router;
