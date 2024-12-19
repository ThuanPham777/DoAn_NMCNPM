const dayjs = require('dayjs');

exports.generateScheduleWithResult = async (pool, TournamentID) => {
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
      `SELECT TeamID, TeamName, TeamLogo FROM Team WHERE TeamID IN
         (SELECT Team1ID FROM Match WHERE TournamentID = @TournamentID
          UNION
          SELECT Team2ID FROM Match WHERE TournamentID = @TournamentID)`
    );
  const teams = teamsResult.recordset;

  // Tạo một map từ TeamID -> TeamName và Logo
  const teamMap = {};
  teams.forEach((team) => {
    teamMap[team.TeamID] = {
      name: team.TeamName,
      logo: team.TeamLogo,
    };
  });

  // Hàm gọi stored procedure để lấy thông tin tỷ số
  const getMatchScores = async (matchID, roundID, tournamentID) => {
    const result = await pool
      .request()
      .input('MatchID', matchID)
      .input('RoundID', roundID)
      .input('TournamentID', tournamentID)
      .execute('getMatchDetails');

    const [scoreDetails, goalDetails] = result.recordsets;

    return {
      homeTeamName: scoreDetails[0]?.HomeTeamName || 'Unknown',
      awayTeamName: scoreDetails[0]?.AwayTeamName || 'Unknown',
      homeScore: scoreDetails[0]?.HomeScore || 0,
      awayScore: scoreDetails[0]?.AwayScore || 0,
      goals: goalDetails.map((goal) => ({
        minute: goal.Minute,
        type: goal.ScoreType,
        player: goal.PlayerName,
        team: goal.Team,
      })),
    };
  };

  // Kết hợp các vòng đấu với danh sách trận đấu và tỷ số
  const schedule = await Promise.all(
    rounds.map(async (round) => ({
      id: round.RoundID,
      matches: await Promise.all(
        matches
          .filter((match) => match.RoundID === round.RoundID)
          .map(async (match) => {
            const scores = await getMatchScores(
              match.MatchID,
              match.RoundID,
              TournamentID
            );

            return {
              matchID: match.MatchID,
              roundID: match.RoundID,
              team1ID: match.Team1ID,
              team1Name: teamMap[match.Team1ID]?.name || 'Unknown',
              team1Logo: teamMap[match.Team1ID]?.logo || 'Unknown',
              team2ID: match.Team2ID,
              team2Name: teamMap[match.Team2ID]?.name || 'Unknown',
              team2Logo: teamMap[match.Team2ID]?.logo || 'Unknown',
              stadium: match.Stadium,
              date: dayjs(match.MatchDate).format('YYYY-MM-DD HH:mm:ss'),
              homeScore: scores.homeScore,
              awayScore: scores.awayScore,
              goals: scores.goals,
            };
          })
      ),
    }))
  );

  return schedule;
};
