const playerService = require('../services/player.service');

exports.addPlayer = async (req, res, next) => {
  try {
    const { TeamID } = req.params;
    const player = await playerService.addPlayer(TeamID, req.body, req.file);

    return res.status(201).json({
      message: 'Player added successfully',
      data: player,
    });
  } catch (error) {
    console.error('Error adding player:', error);
    next(error);
  }
};

exports.getAllPlayersOfTeam = async (req, res, next) => {
  try {
    const { TeamID } = req.params;
    const players = await playerService.getAllPlayersOfTeam(TeamID);

    res.json({
      message: 'Success',
      data: players,
    });
  } catch (error) {
    console.error('Error getAllPlayersOfTeam:', error);
    next(error);
  }
};

exports.getAllPlayersAttendingTournament = async (req, res, next) => {
  try {
    const { TournamentID } = req.params;
    const players = await playerService.getAllPlayersAttendingTournament(
      TournamentID
    );

    res.json({
      message: 'success',
      data: players,
    });
  } catch (error) {
    console.error('Error getAllPlayersAttendingTournament:', error);
    next(error);
  }
};

exports.getPlayerById = async (req, res, next) => {
  try {
    const { PlayerID } = req.params;
    const player = await playerService.getPlayerById(PlayerID);

    res.json({
      message: 'Success',
      data: player,
    });
  } catch (error) {
    console.error('Error getPlayerById:', error);
    next(error);
  }
};

exports.updatePlayer = async (req, res, next) => {
  try {
    const { PlayerID, TeamID } = req.params;
    const updated = await playerService.updatePlayer(
      PlayerID,
      TeamID,
      req.body,
      req.file
    );

    return res.status(200).json({
      message: 'Player updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating player:', error);
    next(error);
  }
};

exports.deletePlayer = async (req, res, next) => {
  try {
    const { PlayerID } = req.params;
    const result = await playerService.deletePlayer(PlayerID);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting player:', error);
    next(error);
  }
};
