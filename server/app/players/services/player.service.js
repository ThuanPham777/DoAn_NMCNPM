const prisma = require('../../../prisma');
const AppError = require('../../../utils/appError');
const {
  storeImageInCloudinary,
  deleteImageInCloudinary,
} = require('../../../utils/cloudinaryHelpers');

// Map PlayerType FE ↔ Prisma enum
const PLAYER_TYPE_INPUT = ['Trong nước', 'Ngoài nước'];
const PLAYER_TYPE_MAP = {
  'Trong nước': 'DOMESTIC',
  'Ngoài nước': 'FOREIGN',
};

const toResponsePlayerType = (enumVal) => {
  if (enumVal === 'DOMESTIC') return 'Trong nước';
  if (enumVal === 'FOREIGN') return 'Ngoài nước';
  return enumVal;
};

class PlayerService {
  // --------- ADD PLAYER ----------
  async addPlayer(teamIdRaw, body, file) {
    const TeamID = Number(teamIdRaw);
    if (!Number.isInteger(TeamID)) {
      throw new AppError('Invalid TeamID', 400);
    }

    const { DateOfBirth, PlayerName, JerseyNumber, HomeTown, PlayerType } =
      body;

    // Validate required fields
    if (
      !DateOfBirth ||
      !PlayerName ||
      !JerseyNumber ||
      !PlayerType ||
      HomeTown === undefined // cho phép null nhưng phải field tồn tại
    ) {
      throw new AppError('All required fields must be provided', 400);
    }

    if (!PLAYER_TYPE_INPUT.includes(PlayerType)) {
      throw new AppError(
        `Invalid PlayerType. Allowed values are: ${PLAYER_TYPE_INPUT.join(
          ', '
        )}`,
        400
      );
    }

    const parsedDob = new Date(DateOfBirth);
    if (Number.isNaN(parsedDob.getTime())) {
      throw new AppError('Invalid DateOfBirth format', 400);
    }

    const jerseyNumberNum = Number(JerseyNumber);
    if (!Number.isInteger(jerseyNumberNum) || jerseyNumberNum <= 0) {
      throw new AppError(
        'Invalid JerseyNumber. It must be a positive integer',
        400
      );
    }

    if (PlayerName.length > 100) {
      throw new AppError(
        'PlayerName cannot be longer than 100 characters',
        400
      );
    }

    // Kiểm tra Team có tồn tại không
    const team = await prisma.team.findUnique({
      where: { TeamID },
    });
    if (!team) {
      throw new AppError('Team not found', 404);
    }

    // Upload ảnh nếu có
    let profileImgUrl = null;
    if (file) {
      const folder = 'football/players';
      profileImgUrl = await storeImageInCloudinary(file, folder);
    }

    const prismaPlayerType = PLAYER_TYPE_MAP[PlayerType];

    const player = await prisma.player.create({
      data: {
        TeamID,
        DateOfBirth: parsedDob,
        PlayerName,
        JerseyNumber: jerseyNumberNum,
        HomeTown: HomeTown || null,
        ProfileImg: profileImgUrl,
        PlayerType: prismaPlayerType,
      },
    });

    return {
      ...player,
      PlayerType: toResponsePlayerType(player.PlayerType),
    };
  }

  // --------- GET ALL PLAYERS OF TEAM ----------
  async getAllPlayersOfTeam(teamIdRaw) {
    const TeamID = Number(teamIdRaw);
    if (!Number.isInteger(TeamID)) {
      throw new AppError('Missing or invalid TeamID', 400);
    }

    const players = await prisma.player.findMany({
      where: { TeamID },
      orderBy: { PlayerName: 'asc' },
    });

    return players.map((p) => ({
      ...p,
      PlayerType: toResponsePlayerType(p.PlayerType),
    }));
  }

  // --------- GET ALL PLAYERS ATTENDING TOURNAMENT ----------
  async getAllPlayersAttendingTournament(tournamentIdRaw) {
    const TournamentID = Number(tournamentIdRaw);
    if (!Number.isInteger(TournamentID)) {
      throw new AppError('Invalid TournamentID', 400);
    }

    const players = await prisma.player.findMany({
      where: {
        Team: {
          TeamAttendTournament: {
            some: { TournamentID },
          },
        },
      },
      include: {
        Team: true,
      },
      orderBy: {
        PlayerName: 'asc',
      },
    });

    return players.map((p) => ({
      PlayerID: p.PlayerID,
      TeamID: p.TeamID,
      DateOfBirth: p.DateOfBirth,
      PlayerName: p.PlayerName,
      JerseyNumber: p.JerseyNumber,
      HomeTown: p.HomeTown,
      ProfileImg: p.ProfileImg,
      PlayerType: toResponsePlayerType(p.PlayerType),
      TeamName: p.Team?.TeamName ?? null,
    }));
  }

  // --------- GET PLAYER BY ID ----------
  async getPlayerById(playerIdRaw) {
    const PlayerID = Number(playerIdRaw);
    if (!Number.isInteger(PlayerID)) {
      throw new AppError('Missing or invalid PlayerID', 400);
    }

    const player = await prisma.player.findUnique({
      where: { PlayerID },
      include: {
        Team: true,
      },
    });

    if (!player) {
      throw new AppError('Player not found', 404);
    }

    return {
      ...player,
      PlayerType: toResponsePlayerType(player.PlayerType),
    };
  }

  // --------- UPDATE PLAYER ----------
  async updatePlayer(playerIdRaw, teamIdRaw, body, file) {
    const PlayerID = Number(playerIdRaw);
    const TeamID = Number(teamIdRaw);

    if (!Number.isInteger(PlayerID) || !Number.isInteger(TeamID)) {
      throw new AppError('Invalid PlayerID or TeamID', 400);
    }

    const { DateOfBirth, PlayerName, JerseyNumber, HomeTown, PlayerType } =
      body;

    if (
      !DateOfBirth ||
      !PlayerName ||
      !JerseyNumber ||
      !HomeTown ||
      !PlayerType
    ) {
      throw new AppError('All required fields must be provided', 400);
    }

    if (!PLAYER_TYPE_INPUT.includes(PlayerType)) {
      throw new AppError(
        `Invalid PlayerType. Allowed values are: ${PLAYER_TYPE_INPUT.join(
          ', '
        )}`,
        400
      );
    }

    const parsedDob = new Date(DateOfBirth);
    if (Number.isNaN(parsedDob.getTime())) {
      throw new AppError('Invalid DateOfBirth format', 400);
    }

    const jerseyNumberNum = Number(JerseyNumber);
    if (!Number.isInteger(jerseyNumberNum) || jerseyNumberNum <= 0) {
      throw new AppError(
        'Invalid JerseyNumber. It must be a positive number',
        400
      );
    }

    // Lấy player hiện tại
    const existing = await prisma.player.findUnique({
      where: { PlayerID },
    });

    if (!existing) {
      throw new AppError('Player not found', 404);
    }

    // Nếu bạn muốn đảm bảo Player thuộc đúng TeamID:
    if (existing.TeamID !== TeamID) {
      throw new AppError('Player does not belong to this team', 400);
    }

    let profileImgUrl = existing.ProfileImg;

    if (file) {
      const folder = 'football/players';
      const newUrl = await storeImageInCloudinary(file, folder);
      if (profileImgUrl) {
        await deleteImageInCloudinary(profileImgUrl);
      }
      profileImgUrl = newUrl;
    }

    const prismaPlayerType = PLAYER_TYPE_MAP[PlayerType];

    const updated = await prisma.player.update({
      where: { PlayerID },
      data: {
        TeamID,
        DateOfBirth: parsedDob,
        PlayerName,
        JerseyNumber: jerseyNumberNum,
        HomeTown: HomeTown || null,
        ProfileImg: profileImgUrl,
        PlayerType: prismaPlayerType,
      },
    });

    return {
      ...updated,
      PlayerType: toResponsePlayerType(updated.PlayerType),
    };
  }

  // --------- DELETE PLAYER ----------
  async deletePlayer(playerIdRaw) {
    const PlayerID = Number(playerIdRaw);
    if (!Number.isInteger(PlayerID)) {
      throw new AppError('Invalid PlayerID', 400);
    }

    const existing = await prisma.player.findUnique({
      where: { PlayerID },
    });

    if (!existing) {
      throw new AppError('Player not found', 404);
    }

    const img = existing.ProfileImg;

    // xóa DB trước → nếu Cloudinary fail thì chỉ log.
    await prisma.player.delete({
      where: { PlayerID },
    });

    if (img) {
      try {
        await deleteImageInCloudinary(img);
      } catch (e) {
        console.error('Error deleting image from Cloudinary:', e);
      }
    }

    return { success: true, message: 'Player deleted successfully' };
  }
}

module.exports = new PlayerService();
