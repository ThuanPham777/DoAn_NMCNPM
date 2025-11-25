const prisma = require('../../../prisma');
const dayjs = require('dayjs');
const AppError = require('../../../utils/appError');

// Hàm tạo lịch thi đấu
function generateSchedule(teams, startDate, endDate) {
  const teamIds = [...teams];
  if (teamIds.length % 2 !== 0) teamIds.push(null); // Bye round nếu số đội lẻ

  const numRounds = teamIds.length - 1; // Số vòng lượt đi
  const rounds = [];

  // Tính số ngày giữa các vòng đấu
  const totalDays = dayjs(endDate).diff(dayjs(startDate), 'days');
  const daysPerRound = Math.floor(totalDays / numRounds); // Lượt đi + lượt về

  // Tạo lịch thi đấu lượt đi
  for (let round = 0; round < numRounds; round++) {
    const matches = [];
    const roundDate = dayjs(startDate)
      .add(round * daysPerRound, 'days')
      .format('YYYY-MM-DD');

    for (let i = 0; i < teamIds.length / 2; i++) {
      const team1 = teamIds[i];
      const team2 = teamIds[teamIds.length - 1 - i];

      if (team1 && team2) {
        matches.push({
          team1ID: team1.TeamID,
          team2ID: team2.TeamID,
          stadium: team1.Stadium, // sân lượt đi
          date: `${roundDate} ${14 + i}:00`, // mỗi trận cách nhau 1h
        });
      }
    }

    rounds.push({ id: round + 1, date: roundDate, matches });
    teamIds.splice(1, 0, teamIds.pop()); // Xoay vòng các đội
  }

  // Tạo lượt về
  const returnRounds = rounds.map((round, index) => ({
    id: numRounds + index + 1,
    date: dayjs(round.date)
      .add(numRounds * daysPerRound, 'days')
      .format('YYYY-MM-DD'),
    matches: round.matches.map((match) => {
      const team1 = teams.find((t) => t.TeamID === match.team1ID);
      const team2 = teams.find((t) => t.TeamID === match.team2ID);

      return {
        team1ID: match.team2ID,
        team2ID: match.team1ID,
        stadium: team2?.Stadium || team1?.Stadium || 'Default Stadium',
        date: `${dayjs(round.date)
          .add(numRounds * daysPerRound, 'days')
          .format('YYYY-MM-DD')} ${match.date.split(' ')[1]}`,
      };
    }),
  }));

  return [...rounds, ...returnRounds];
}

class ScheduleService {
  // Tạo lịch thi đấu cho 1 giải
  async createSchedule(tournamentIdRaw) {
    const TournamentID = Number(tournamentIdRaw);

    // 1) Lấy info Tournament
    const tournament = await prisma.tournament.findUnique({
      where: { TournamentID },
    });
    if (!tournament) throw new AppError('Tournament not found', 404);

    const { StartDate, EndDate } = tournament;

    // 2) Lấy danh sách đội tham dự giải
    const teamsAttend = await prisma.teamAttendTournament.findMany({
      where: { TournamentID },
      include: {
        Team: {
          select: {
            TeamID: true,
            Stadium: true,
          },
        },
      },
    });

    const teams = teamsAttend.map((tat) => ({
      TeamID: tat.TeamID,
      Stadium: tat.Team.Stadium,
    }));

    if (teams.length < 2) {
      throw new AppError('Not enough teams to create schedule', 400);
    }

    // 3) Xóa lịch cũ (Match trước, rồi Round)
    await prisma.match.deleteMany({ where: { TournamentID } });
    await prisma.round.deleteMany({ where: { TournamentID } });

    // 4) Generate lịch mới
    const schedule = generateSchedule(teams, StartDate, EndDate);

    // 5) Lưu Round + Match bằng transaction
    await prisma.$transaction(async (tx) => {
      for (const round of schedule) {
        // tạo Round
        await tx.round.create({
          data: {
            RoundID: round.id,
            TournamentID,
          },
        });

        // tạo Match
        const matchesData = round.matches.map((match, idx) => ({
          MatchID: idx + 1, // giống code cũ: index trong round
          RoundID: round.id,
          TournamentID,
          Team1ID: match.team1ID,
          Team2ID: match.team2ID,
          MatchDate: new Date(match.date), // chú ý schema đang @db.Date → mất giờ
        }));

        if (matchesData.length > 0) {
          await tx.match.createMany({ data: matchesData });
        }
      }
    });

    return { success: true };
  }

  // Lấy lịch thi đấu của 1 giải
  async getSchedule(tournamentIdRaw) {
    const TournamentID = Number(tournamentIdRaw);

    // Lấy tất cả Round
    const rounds = await prisma.round.findMany({
      where: { TournamentID },
      orderBy: { RoundID: 'asc' },
    });

    // Lấy tất cả Match kèm team1, team2
    const matches = await prisma.match.findMany({
      where: { TournamentID },
      orderBy: [{ RoundID: 'asc' }, { MatchID: 'asc' }],
      include: {
        Team_Match_Team1IDToTeam: true,
        Team_Match_Team2IDToTeam: true,
      },
    });

    // Build lại dữ liệu đúng format cũ
    const schedule = rounds.map((round) => ({
      id: round.RoundID,
      matches: matches
        .filter((m) => m.RoundID === round.RoundID)
        .map((m) => ({
          matchID: m.MatchID,
          roundID: m.RoundID,
          team1ID: m.Team1ID,
          team1Name: m.Team_Match_Team1IDToTeam?.TeamName || 'Unknown',
          team1Logo: m.Team_Match_Team1IDToTeam?.TeamLogo || 'Unknown',
          team2ID: m.Team2ID,
          team2Name: m.Team_Match_Team2IDToTeam?.TeamName || 'Unknown',
          team2Logo: m.Team_Match_Team2IDToTeam?.TeamLogo || 'Unknown',
          // trước đây lấy từ Match.Stadium, giờ suy từ Team
          stadium:
            m.Team_Match_Team1IDToTeam?.Stadium ||
            m.Team_Match_Team2IDToTeam?.Stadium ||
            null,
          date: dayjs(m.MatchDate).format('YYYY-MM-DD HH:mm:ss'),
        })),
    }));

    return schedule;
  }

  // Update datetime 1 trận đấu
  async updateDatetimeOfMatch(tournamentIdRaw, roundIdRaw, matchIdRaw, date) {
    const TournamentID = Number(tournamentIdRaw);
    const RoundID = Number(roundIdRaw);
    const MatchID = Number(matchIdRaw);

    const newMatchDate = new Date(date);

    const result = await prisma.match.updateMany({
      where: {
        TournamentID,
        RoundID,
        MatchID,
      },
      data: {
        MatchDate: newMatchDate,
      },
    });

    if (result.count === 0) {
      throw new AppError('Match not found', 404);
    }

    return { message: 'Match date updated successfully' };
  }
}

module.exports = new ScheduleService();
