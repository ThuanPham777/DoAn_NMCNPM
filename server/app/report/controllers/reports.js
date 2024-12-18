const db = require('../../../config/db');

exports.getTopScorePlayers = async (req, res) => {
  try {
    const TournamentID = parseInt(req.params.TournamentID, 10);
    console.log('Tournament ID: ' + TournamentID);
    const pool = await db();
    const result = await pool
      .request()
      .input('TournamentID', TournamentID)
      .execute('getTopScorePlayers');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
