const TeamService = require('../services/team.service');

exports.addTeam = async (req, res, next) => {
  try {
    const team = await TeamService.addTeam(req.body, req.file, req.user);

    res.status(201).json({
      status: 'success',
      data: team,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllMyTeams = async (req, res, next) => {
  try {
    const teams = await TeamService.getAllMyTeams(req.user.UserID);
    res.json({ status: 'success', data: teams });
  } catch (err) {
    next(err);
  }
};

exports.getAllTeamsAttendTournament = async (req, res, next) => {
  try {
    const teams = await TeamService.getAllTeamsAttendTournament(
      req.params.TournamentID
    );
    res.json({ status: 'success', data: teams });
  } catch (err) {
    next(err);
  }
};

exports.getTeamsAttendTournaments = async (req, res, next) => {
  try {
    const teams = await TeamService.getTeamsAttendTournaments();
    res.json({ status: 'success', data: teams });
  } catch (err) {
    next(err);
  }
};

exports.addTeamsInTournament = async (req, res, next) => {
  try {
    const { TeamIDs, TournamentID } = req.body;

    const result = await TeamService.addTeamsInTournament(
      TeamIDs,
      TournamentID,
      req.user
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.updateTeam = async (req, res, next) => {
  try {
    const updated = await TeamService.updateTeam(
      req.params.TeamID,
      req.body,
      req.file,
      req.user
    );

    res.json({
      status: 'success',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};
