const { generateScheduleWithResult } = require('../services/round.service');

exports.getScheduleWithResult = async (req, res, next) => {
  try {
    const { TournamentID } = req.params;
    const schedule = await generateScheduleWithResult(TournamentID);
    res.status(200).json({ data: schedule });
  } catch (error) {
    console.error('Error generating schedule with result:', error);
    next(error);
  }
};
