// src/controllers/schedule.controller.js
const ScheduleService = require('../services/schedule.service');

exports.createSchedule = async (req, res, next) => {
  try {
    const { TournamentID } = req.params;
    const result = await ScheduleService.createSchedule(TournamentID);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating schedule:', error);
    next(error);
  }
};

exports.getSchedule = async (req, res, next) => {
  try {
    const { TournamentID } = req.params;
    const schedule = await ScheduleService.getSchedule(TournamentID);
    res.status(200).json({ data: schedule });
  } catch (error) {
    console.error('Error getting schedule:', error);
    next(error);
  }
};

exports.updateDatetimeOfMatch = async (req, res, next) => {
  try {
    const { TournamentID, RoundID, MatchID } = req.params;
    const { date } = req.body;

    const result = await ScheduleService.updateDatetimeOfMatch(
      TournamentID,
      RoundID,
      MatchID,
      date
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating match datetime:', error);
    next(error);
  }
};
