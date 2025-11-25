const TournamentService = require('../services/tournament.service');

exports.addTournament = async (req, res, next) => {
  try {
    const tournament = await TournamentService.addTournament(
      req.body,
      req.file
    );

    res.status(201).json({
      status: 'success',
      data: tournament,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllTournaments = async (req, res, next) => {
  try {
    const tournaments = await TournamentService.getAllTournaments();

    res.json({
      status: 'success',
      data: tournaments,
    });
  } catch (err) {
    next(err);
  }
};

exports.getTournamentById = async (req, res, next) => {
  try {
    const tournament = await TournamentService.getTournamentById(
      req.params.TournamentID
    );

    res.json({
      status: 'success',
      data: tournament,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTournament = async (req, res, next) => {
  try {
    const updated = await TournamentService.updateTournament(
      req.params.TournamentID,
      req.body,
      req.file
    );

    res.json({
      status: 'success',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};
