const express = require('express');
const router = express.Router();
const createUploadMiddleware = require('../../../middleware/uploadFile'); // Import middleware upload
const uploadTournament = createUploadMiddleware('uploads/tournaments'); // Middleware upload cho tournaments

const tournamentController = require('../controllers/tournament');

router.post(
  '/add',
  uploadTournament.single('TournamentLogo'),
  tournamentController.addTournament
);

router.get('/', tournamentController.getAllTournaments);

router.get('/:id', tournamentController.getTournamentById);

module.exports = router;
