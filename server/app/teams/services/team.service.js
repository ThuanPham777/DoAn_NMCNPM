const prisma = require('../../../prisma');
const AppError = require('../../../utils/appError');
const {
  storeImageInCloudinary,
  deleteImageInCloudinary,
} = require('../../../utils/cloudinaryHelpers');

class TeamService {
  async addTeam(data, file, user) {
    const { TeamName, Stadium, Coach } = data;

    if (user.Role !== 'Manager') {
      throw new AppError('Only Managers can add a team.', 403);
    }

    let TeamLogo = null;
    if (file) {
      TeamLogo = await storeImageInCloudinary(file, 'football/teams');
    }

    const team = await prisma.team.create({
      data: {
        TeamName,
        Stadium,
        Coach,
        TeamLogo,
        UserID: user.UserID,
      },
    });

    return team;
  }

  async getAllMyTeams(userID) {
    return await prisma.team.findMany({
      where: { UserID: Number(userID) },
    });
  }

  async getAllTeamsAttendTournament(TournamentID) {
    return await prisma.teamAttendTournament.findMany({
      where: { TournamentID: Number(TournamentID) },
      include: {
        team: true,
        tournament: true,
      },
    });
  }

  async getTeamsAttendTournaments() {
    return await prisma.teamAttendTournament.findMany({
      include: {
        team: true,
        tournament: true,
      },
    });
  }

  async addTeamsInTournament(TeamIDs, TournamentID, user) {
    if (user.Role !== 'Manager') {
      throw new AppError(
        'Only Managers can register teams to tournaments.',
        403
      );
    }

    // Check tournament exists
    const tournament = await prisma.tournament.findUnique({
      where: { TournamentID: Number(TournamentID) },
    });
    if (!tournament) throw new AppError('Tournament not found.', 404);

    // Check team exists
    const existingTeams = await prisma.teamAttendTournament.findMany({
      where: {
        TournamentID: Number(TournamentID),
        TeamID: { in: TeamIDs },
      },
    });

    if (existingTeams.length > 0) {
      const existed = existingTeams.map((t) => t.TeamID).join(', ');
      throw new AppError(`Teams already registered: ${existed}`, 400);
    }

    // Bulk insert
    const data = TeamIDs.map((teamID) => ({
      TeamID: Number(teamID),
      TournamentID: Number(TournamentID),
    }));

    await prisma.teamAttendTournament.createMany({ data });

    return { message: 'Teams registered successfully' };
  }

  async updateTeam(TeamID, data, file, user) {
    const { TeamName, Stadium, Coach } = data;

    if (user.Role !== 'Manager')
      throw new AppError('Only Managers can update a team.', 403);

    const team = await prisma.team.findUnique({
      where: { TeamID: Number(TeamID) },
    });

    if (!team) throw new AppError('Team not found', 404);

    if (team.UserID !== user.UserID)
      throw new AppError('You do not own this team.', 403);

    let TeamLogo = team.TeamLogo;
    if (file) {
      const newLogo = await storeImageInCloudinary(file, 'football/teams');
      if (TeamLogo) await deleteImageInCloudinary(TeamLogo);
      TeamLogo = newLogo;
    }

    const updated = await prisma.team.update({
      where: { TeamID: Number(TeamID) },
      data: {
        TeamName,
        Stadium,
        Coach,
        TeamLogo,
      },
    });

    return updated;
  }
}

module.exports = new TeamService();
