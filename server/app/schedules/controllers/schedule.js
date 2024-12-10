const db = require('../../../config/db');
const dayjs = require('dayjs');

// Hàm tạo lịch thi đấu
function generateSchedule(teams) {
  const teamIds = [...teams];
  if (teamIds.length % 2 !== 0) teamIds.push(null); // Bye round nếu số đội lẻ

  const numRounds = teamIds.length - 1; // Số vòng
  const rounds = [];

  for (let round = 0; round < numRounds; round++) {
    const matches = [];
    const roundDate = dayjs().add(round, 'days').format('YYYY-MM-DD');

    for (let i = 0; i < teamIds.length / 2; i++) {
      const team1 = teamIds[i];
      const team2 = teamIds[teamIds.length - 1 - i];

      if (team1 && team2) {
        matches.push({
          team1ID: team1.TeamID,
          team2ID: team2.TeamID,
          stadium: team1.Stadium, // Sân đá lượt đi
          date: `${roundDate} ${14 + i}:00`,
        });
      }
    }

    rounds.push({ id: round + 1, date: roundDate, matches });
    teamIds.splice(1, 0, teamIds.pop()); // Xoay vòng các đội
  }

  // Tạo lượt về
  const returnRounds = rounds.map((round, index) => ({
    id: numRounds + index + 1,
    date: dayjs(round.date).add(numRounds, 'days').format('YYYY-MM-DD'),
    matches: round.matches.map((match) => {
      const team1 = teams.find((team) => team.TeamID === match.team1ID);
      const team2 = teams.find((team) => team.TeamID === match.team2ID);

      return {
        team1ID: match.team2ID,
        team2ID: match.team1ID,
        stadium: team2?.Stadium || team1?.Stadium || 'Default Stadium', // Lấy sân từ đội hoặc mặc định
        date: `${dayjs(round.date)
          .add(numRounds, 'days')
          .format('YYYY-MM-DD')} ${match.date.split(' ')[1]}`,
      };
    }),
  }));

  return [...rounds, ...returnRounds];
}

exports.createSchedule = async (req, res) => {
  try {
    const TournamentID = parseInt(req.params.TournamentID, 10);
    const pool = await db();

    // Lấy danh sách các đội tham dự giải (bao gồm thông tin sân đá)
    const teamsResult = await pool
      .request()
      .input('TournamentID', TournamentID)
      .execute('getAllTeamsAttendTournament');
    const teams = teamsResult.recordset.map((team) => ({
      TeamID: team.TeamID,
      Stadium: team.Stadium,
    }));

    // Kiểm tra và xóa lịch thi đấu hiện tại nếu có
    await pool
      .request()
      .input('TournamentID', TournamentID)
      .query('DELETE FROM Match WHERE TournamentID = @TournamentID'); // Xóa trận đấu
    await pool
      .request()
      .input('TournamentID', TournamentID)
      .query('DELETE FROM Round WHERE TournamentID = @TournamentID'); // Xóa vòng đấu

    // Tạo lịch thi đấu mới
    const schedule = generateSchedule(teams);

    // Lưu các vòng đấu vào bảng `Round`
    for (const round of schedule) {
      await pool
        .request()
        .input('RoundID', round.id)
        .input('TournamentID', TournamentID)
        .query(
          `INSERT INTO Round (RoundID, TournamentID) VALUES (@RoundID, @TournamentID)`
        );
    }

    // Lưu các trận đấu vào bảng `Match`
    for (const round of schedule) {
      for (const match of round.matches) {
        await pool
          .request()
          .input('MatchID', round.matches.indexOf(match) + 1) // ID của trận đấu
          .input('RoundID', round.id)
          .input('TournamentID', TournamentID)
          .input('Team1ID', match.team1ID)
          .input('Team2ID', match.team2ID)
          .input('Stadium', match.stadium) // Sân đá
          .input('MatchDate', dayjs(match.date).format('YYYY-MM-DD HH:mm:ss'))
          .query(
            `INSERT INTO Match (MatchID, RoundID, TournamentID, Team1ID, Team2ID, Stadium, MatchDate)
             VALUES (@MatchID, @RoundID, @TournamentID, @Team1ID, @Team2ID, @Stadium, @MatchDate)`
          );
      }
    }

    res
      .status(201)
      .json({ message: 'Lịch thi đấu đã được tạo lại thành công!' });
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Hàm lấy lịch thi đấu của một giải đấu
exports.getSchedule = async (req, res) => {
  try {
    const TournamentID = parseInt(req.params.TournamentID, 10);
    const pool = await db();

    // Lấy danh sách các vòng đấu
    const roundsResult = await pool
      .request()
      .input('TournamentID', TournamentID)
      .query('SELECT * FROM Round WHERE TournamentID = @TournamentID');
    const rounds = roundsResult.recordset;

    // Lấy danh sách các trận đấu
    const matchesResult = await pool
      .request()
      .input('TournamentID', TournamentID)
      .query(
        `SELECT * FROM Match WHERE TournamentID = @TournamentID ORDER BY RoundID, MatchID`
      );
    const matches = matchesResult.recordset;

    // Lấy thông tin các đội tham gia giải đấu
    const teamsResult = await pool
      .request()
      .input('TournamentID', TournamentID)
      .query(
        `SELECT TeamID, TeamName FROM Team WHERE TeamID IN
         (SELECT Team1ID FROM Match WHERE TournamentID = @TournamentID
          UNION
          SELECT Team2ID FROM Match WHERE TournamentID = @TournamentID)`
      );
    const teams = teamsResult.recordset;

    // Tạo một map từ TeamID -> TeamName
    const teamMap = {};
    teams.forEach((team) => {
      teamMap[team.TeamID] = team.TeamName;
    });

    // Kết hợp các vòng đấu với danh sách trận đấu
    const schedule = rounds.map((round) => ({
      id: round.RoundID,
      matches: matches
        .filter((match) => match.RoundID === round.RoundID)
        .map((match) => ({
          matchID: match.MatchID,
          team1ID: match.Team1ID,
          team1Name: teamMap[match.Team1ID] || 'Unknown',
          team2ID: match.Team2ID,
          team2Name: teamMap[match.Team2ID] || 'Unknown',
          stadium: match.Stadium, // Thông tin sân đá
          date: dayjs(match.MatchDate).format('YYYY-MM-DD HH:mm:ss'),
        })),
    }));

    res.status(200).json({ data: schedule });
  } catch (error) {
    console.error('Error getting schedule:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};