const db = require('../../../config/db');
const { generateScheduleWithResult } = require('../services/round');

exports.getRoundResult = async (req, res) => {
  try {
    const TournamentID = parseInt(req.params.TournamentID, 10);
    const pool = await db();
    const schedule = await generateScheduleWithResult(pool, TournamentID);

    res.status(200).json({ data: schedule });
  } catch (error) {
    console.error('Error getting schedule with scores:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
