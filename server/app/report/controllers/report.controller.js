const report = require('../services/report.service');

exports.getTopScorePlayers = async (req, res, next) => {
  try {
    const { TournamentID } = req.params;
    const players = await report.getTopScorePlayers(TournamentID);
    res.status(200).json(players);
  } catch (err) {
    console.error('Error getTopScorePlayers:', err);
    next(err);
  }
};

exports.getTournamentRank = async (req, res, next) => {
  try {
    const { TournamentID } = req.params;
    const ranking = await report.getTournamentRanking(TournamentID);
    res.status(200).json({ data: ranking });
  } catch (err) {
    console.error('Error getTournamentRank:', err);
    next(err);
  }
};
