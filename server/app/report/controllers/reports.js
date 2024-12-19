const db = require('../../../config/db');
const { generateScheduleWithResult } = require('../../rounds/services/round');
exports.getTopScorePlayers = async (req, res) => {
  try {
    const TournamentID = parseInt(req.params.TournamentID, 10);
    console.log('Tournament ID: ' + TournamentID);
    const pool = await db();
    const result = await pool
      .request()
      .input('TournamentID', TournamentID)
      .execute('getTopScorePlayers');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Hàm tính bảng xếp hạng
const calculateRanking = (schedule, rule, teams) => {
  const teamStats = {};

  let hasPlayedMatch = false; // Biến kiểm tra xem có trận đấu nào diễn ra chưa

  // Khởi tạo thông tin cho tất cả các đội
  teams.forEach((team) => {
    if (!teamStats[team.TeamID]) {
      teamStats[team.TeamID] = initTeamStats(team.TeamName, team.TeamLogo);
    }
  });

  // Kiểm tra xem lịch thi đấu có hợp lệ hay không
  if (!schedule || !Array.isArray(schedule)) {
    throw new Error('Lịch thi đấu không hợp lệ');
  }

  // Duyệt qua lịch thi đấu để cập nhật kết quả
  schedule.forEach((round) => {
    if (round.matches && Array.isArray(round.matches)) {
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

        // Chỉ xét trận khi đã đến thời điểm hiện tại
        const matchDate = new Date(date);
        if (matchDate > new Date()) {
          // Trận chưa diễn ra, chỉ hiển thị đội mà không thay đổi điểm số
          return;
        }

        // Đánh dấu là có trận đấu đã diễn ra
        hasPlayedMatch = true;

        // Cập nhật dữ liệu cho đội 1
        if (!teamStats[team1ID]) {
          teamStats[team1ID] = initTeamStats(team1Name, team1Logo);
        }
        updateTeamStats(
          teamStats[team1ID],
          homeScore,
          awayScore,
          rule,
          team2ID
        );

        // Cập nhật dữ liệu cho đội 2
        if (!teamStats[team2ID]) {
          teamStats[team2ID] = initTeamStats(team2Name, team2Logo);
        }
        updateTeamStats(
          teamStats[team2ID],
          awayScore,
          homeScore,
          rule,
          team1ID
        );
      });
    }
  });

  // Nếu không có trận đấu nào diễn ra, trả về bảng xếp hạng ngẫu nhiên
  if (!hasPlayedMatch) {
    return Object.entries(teamStats)
      .map(([teamID, stats]) => ({ teamID, ...stats }))
      .sort(() => Math.random() - 0.5); // Sắp xếp ngẫu nhiên
  }

  // Xếp hạng các đội theo thứ tự ưu tiên
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

// Hàm khởi tạo dữ liệu đội
const initTeamStats = (name, teamLogo) => ({
  name,
  teamLogo,
  played: 0,
  wins: 0, // trận thắng
  draws: 0, // trận hòa
  losses: 0, // trận thua
  goalsFor: 0, // tổng bàn thắng
  goalsAgainst: 0, // tổng bàn thua
  goalDifference: 0,
  points: 0,
  headToHead: {}, // Lưu kết quả đối kháng
});

// Hàm cập nhật thông số đội
const updateTeamStats = (team, goalsFor, goalsAgainst, rule, opponentID) => {
  team.played += 1;
  team.goalsFor += goalsFor;
  team.goalsAgainst += goalsAgainst;
  team.goalDifference = team.goalsFor - team.goalsAgainst;

  if (goalsFor > goalsAgainst) {
    team.wins += 1;
    team.points += rule.WinScore; // Điểm thắng từ rule
    updateHeadToHead(team, opponentID, 1); // Đội thắng được tính là 1 điểm trong đối kháng
  } else if (goalsFor === goalsAgainst) {
    team.draws += 1;
    team.points += rule.DrawScore; // Điểm hòa từ rule
  } else {
    team.losses += 1;
    updateHeadToHead(team, opponentID, -1); // Đội thua được tính là -1 điểm trong đối kháng
  }
};

// Hàm cập nhật thông tin đối kháng
const updateHeadToHead = (team, opponentID, result) => {
  team.headToHead[opponentID] = result; // Lưu kết quả đối kháng với đối thủ
};

// Hàm so sánh đối kháng khi các chỉ số khác đều bằng nhau
const compareHeadToHead = (a, b) => {
  const aHeadToHead = a.headToHead[b.teamID] || 0;
  const bHeadToHead = b.headToHead[a.teamID] || 0;

  return bHeadToHead - aHeadToHead; // Nếu đối kháng bằng nhau, đội thắng đối kháng được ưu tiên
};

exports.getTournamentRank = async (req, res) => {
  try {
    const TournamentID = parseInt(req.params.TournamentID, 10);
    const pool = await db();

    const rule = await pool
      .request()
      .input('TournamentID', TournamentID)
      .execute('getRule');

    const schedule = await generateScheduleWithResult(pool, TournamentID);

    // Lấy thông tin các đội tham gia giải đấu
    const teamsResult = await pool
      .request()
      .input('TournamentID', TournamentID)
      .query(
        `SELECT TeamID, TeamName, TeamLogo FROM Team WHERE TeamID IN
         (SELECT Team1ID FROM Match WHERE TournamentID = @TournamentID
          UNION
          SELECT Team2ID FROM Match WHERE TournamentID = @TournamentID)`
      );
    const teams = teamsResult.recordset;

    // Tính bảng xếp hạng
    const ranking = calculateRanking(schedule, rule.recordset[0], teams);
    console.log('rankings:', JSON.stringify(ranking, null, 2));

    res.status(200).json({ data: ranking });
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi server');
  }
};
