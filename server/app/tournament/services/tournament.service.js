const prisma = require('../../../prisma');
const AppError = require('../../../utils/appError');
const {
  storeImageInCloudinary,
  deleteImageInCloudinary,
} = require('../../../utils/cloudinaryHelpers');

class TournamentService {
  async addTournament(data, file) {
    const { TournamentName, StartDate, EndDate } = data;

    if (!TournamentName || !StartDate || !EndDate) {
      throw new AppError('Missing required fields', 400);
    }

    const now = new Date();
    if (new Date(StartDate) < now || new Date(EndDate) < now) {
      throw new AppError('Invalid date range', 400);
    }

    let TournamentLogo = null;
    if (file) {
      const folder = 'football/tournaments';
      TournamentLogo = await storeImageInCloudinary(file, folder);
    }

    const tournament = await prisma.tournament.create({
      data: {
        TournamentName,
        StartDate: new Date(StartDate),
        EndDate: new Date(EndDate),
        TournamentLogo,
      },
    });

    return tournament;
  }

  async getAllTournaments() {
    return await prisma.tournament.findMany({
      orderBy: { TournamentID: 'desc' },
    });
  }

  async getTournamentById(TournamentID) {
    const tournament = await prisma.tournament.findUnique({
      where: { TournamentID: Number(TournamentID) },
    });

    if (!tournament) throw new AppError('Tournament not found', 404);

    return tournament;
  }

  async updateTournament(TournamentID, data, file) {
    const { TournamentName, StartDate, EndDate } = data;

    if (!TournamentName || !StartDate || !EndDate) {
      throw new AppError('Missing required fields', 400);
    }

    const oldTournament = await prisma.tournament.findUnique({
      where: { TournamentID: Number(TournamentID) },
    });

    if (!oldTournament) throw new AppError('Tournament not found', 404);

    let TournamentLogo = oldTournament.TournamentLogo;

    // Nếu upload file mới → xóa file cũ → upload file mới
    if (file) {
      const folder = 'football/tournaments';
      const newImage = await storeImageInCloudinary(file, folder);

      if (TournamentLogo) await deleteImageInCloudinary(TournamentLogo);

      TournamentLogo = newImage;
    }

    const updated = await prisma.tournament.update({
      where: { TournamentID: Number(TournamentID) },
      data: {
        TournamentName,
        StartDate: new Date(StartDate),
        EndDate: new Date(EndDate),
        TournamentLogo,
      },
    });

    return updated;
  }
}

module.exports = new TournamentService();
