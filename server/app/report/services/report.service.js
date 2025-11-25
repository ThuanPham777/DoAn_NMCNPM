const prisma = require('../../../prisma');
const AppError = require('../../../utils/appError');
const {
  generateScheduleWithResult,
} = require('../../rounds/services/round.service');

// =================== HÀM PHỤ CHO BXH ===================

// Khởi tạo dữ liệu team
const initTeamStats = (name, teamLogo) => ({
  name,
  teamLogo,
  played: 0,
  wins: 0,
  draws: 0,
  losses: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  goalDifference: 0,
  points: 0,
  headToHead: {}, // đối kháng với từng đội
});

// Cập nhật đối kháng
const updateHeadToHead = (team, opponentID, result) => {
  // result: 1 = thắng, -1 = thua, 0 = hòa
  team.headToHead[opponentID] = result;
};

// Cập nhật thông số đội theo kết quả 1 trận
const updateTeamStats = (team, goalsFor, goalsAgainst, rule, opponentID) => {
  team.played += 1;
  team.goalsFor += goalsFor;
  team.goalsAgainst += goalsAgainst;
  team.goalDifference = team.goalsFor - team.goalsAgainst;

  const winScore = rule.WinScore ?? 0;
  const drawScore = rule.DrawScore ?? 0;

  if (goalsFor > goalsAgainst) {
    team.wins += 1;
    team.points += winScore;
    updateHeadToHead(team, opponentID, 1);
  } else if (goalsFor === goalsAgainst) {
    team.draws += 1;
    team.points += drawScore;
    // nếu muốn tính hòa trong đối kháng:
    updateHeadToHead(team, opponentID, 0);
  } else {
    team.losses += 1;
    updateHeadToHead(team, opponentID, -1);
  }
};

// So sánh đối kháng khi các chỉ số khác đều bằng nhau
const compareHeadToHead = (a, b) => {
  const aHeadToHead = a.headToHead[b.teamID] ?? 0;
  const bHeadToHead = b.headToHead[a.teamID] ?? 0;
  return bHeadToHead - aHeadToHead;
};

// Tính bảng xếp hạng từ schedule + rule + danh sách team
const calculateRanking = (schedule, rule, teams) => {
  const teamStats = {};
  let hasPlayedMatch = false;

  // Khởi tạo tất cả đội
  teams.forEach((team) => {
    if (!teamStats[team.TeamID]) {
      teamStats[team.TeamID] = initTeamStats(team.TeamName, team.TeamLogo);
    }
  });

  if (!schedule || !Array.isArray(schedule)) {
    throw new Error('Lịch thi đấu không hợp lệ');
  }

  schedule.forEach((round) => {
    if (!round.matches || !Array.isArray(round.matches)) return;

    round.matches.forEach((match) => {
      const {
        team1ID,
        team1Name,
        team2ID,
        team2Name,
        homeScore,
        awayScore,
        team1Logo,
        team2Logo,
        date,
      } = match;

      const matchDate = new Date(date);
      // Chỉ tính các trận đã diễn ra
      if (matchDate > new Date()) return;

      hasPlayedMatch = true;

      // Team 1
      if (!teamStats[team1ID]) {
        teamStats[team1ID] = initTeamStats(team1Name, team1Logo);
      }
      updateTeamStats(teamStats[team1ID], homeScore, awayScore, rule, team2ID);

      // Team 2
      if (!teamStats[team2ID]) {
        teamStats[team2ID] = initTeamStats(team2Name, team2Logo);
      }
      updateTeamStats(teamStats[team2ID], awayScore, homeScore, rule, team1ID);
    });
  });

  // Nếu chưa có trận nào diễn ra → random
  if (!hasPlayedMatch) {
    return Object.entries(teamStats)
      .map(([teamID, stats]) => ({ teamID, ...stats }))
      .sort(() => Math.random() - 0.5);
  }

  // Sắp xếp theo: điểm → hiệu số → bàn thắng → đối đầu
  return Object.entries(teamStats)
    .map(([teamID, stats]) => ({ teamID, ...stats }))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor ||
        compareHeadToHead(a, b)
    );
};

// =================== SERVICE CLASS ===================

class TournamentStatsService {
  /**
   * Lấy danh sách cầu thủ ghi bàn nhiều nhất trong 1 giải
   */
  async getTopScorePlayers(tournamentIdRaw) {
    const TournamentID = Number(tournamentIdRaw);
    if (Number.isNaN(TournamentID)) {
      throw new AppError('Invalid TournamentID', 400);
    }

    const listScores = await prisma.listscore.findMany({
      where: { TournamentID },
      include: {
        Player: {
          include: {
            Team: true,
          },
        },
      },
    });

    const playerMap = {};

    for (const score of listScores) {
      const p = score.Player;
      if (!p) continue;

      if (!playerMap[p.PlayerID]) {
        playerMap[p.PlayerID] = {
          PlayerID: p.PlayerID,
          PlayerName: p.PlayerName,
          JerseyNumber: p.JerseyNumber,
          HomeTown: p.HomeTown,
          PlayerType: p.PlayerType,
          ProfileImg: p.ProfileImg,
          TeamName: p.Team?.TeamName || 'Unknown',
          TotalGoals: 0,
        };
      }

      // Mỗi record trong Listscore = 1 bàn, nên +1
      playerMap[p.PlayerID].TotalGoals += 1;
    }

    return Object.values(playerMap).sort((a, b) => b.TotalGoals - a.TotalGoals);
  }

  /**
   * Tính bảng xếp hạng giải đấu
   * - Lấy Rule từ bảng Rule
   * - Lấy schedule có kết quả từ generateScheduleWithResult(TournamentID)
   * - Suy ra list team từ chính schedule
   */
  async getTournamentRanking(tournamentIdRaw) {
    const TournamentID = Number(tournamentIdRaw);
    if (Number.isNaN(TournamentID)) {
      throw new AppError('Invalid TournamentID', 400);
    }

    const rule = await prisma.rule.findUnique({
      where: { TournamentID },
    });

    if (!rule) {
      throw new AppError('Rule not found for this tournament', 404);
    }

    // Lịch thi đấu + tỉ số
    const schedule = await generateScheduleWithResult(TournamentID);

    // Suy danh sách team từ schedule
    const teamMap = {};
    schedule.forEach((round) => {
      round.matches.forEach((match) => {
        const { team1ID, team1Name, team1Logo, team2ID, team2Name, team2Logo } =
          match;

        if (team1ID && !teamMap[team1ID]) {
          teamMap[team1ID] = {
            TeamID: team1ID,
            TeamName: team1Name,
            TeamLogo: team1Logo,
          };
        }

        if (team2ID && !teamMap[team2ID]) {
          teamMap[team2ID] = {
            TeamID: team2ID,
            TeamName: team2Name,
            TeamLogo: team2Logo,
          };
        }
      });
    });

    const teams = Object.values(teamMap);

    const ranking = calculateRanking(schedule, rule, teams);
    return ranking;
  }
}

module.exports = new TournamentStatsService();
