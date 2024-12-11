const db = require('../../../config/db');

exports.addMatchScore = async (req, res) => {
  try {
    const { MatchID, RoundID, TournamentID, TeamID, PlayerID } = req.params;
    const { ScoreTime, ScoreType } = req.body;

    const pool = await db();
    const result = await pool
      .request()
      .input('MatchID', MatchID)
      .input('RoundID', RoundID)
      .input('TournamentID', TournamentID)
      .input('TeamID', TeamID)
      .input('PlayerID', PlayerID)
      .input('ScoreTime', ScoreTime)
      .input('ScoreType', ScoreType)
      .execute('addMatchScore');

    res.status(200).json({ message: 'Match score updated successfully' });
    return;
  } catch (error) {
    console.error('Error updating match score:', error);
  }
};
