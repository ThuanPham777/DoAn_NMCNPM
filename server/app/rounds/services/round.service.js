const prisma = require('../../../prisma');
const dayjs = require('dayjs');

// Tính tỉ số và goals cho 1 trận
function computeMatchScores(match, listScoresForMatch, teamsById) {
  const homeTeamId = match.Team1ID;
  const awayTeamId = match.Team2ID;

  let homeScore = 0;
  let awayScore = 0;

  // Đếm số bàn giống stored procedure:
  // - chỉ tính LS.ScoreType != 'Phản lưới'
  // - cho team tương ứng với Player.TeamID
  for (const score of listScoresForMatch) {
    const playerTeamId = score.Player?.TeamID ?? null;

    if (score.ScoreType !== 'OWN_GOAL') {
      if (playerTeamId === homeTeamId) {
        homeScore += 1;
      } else if (playerTeamId === awayTeamId) {
        awayScore += 1;
      }
    }
  }

  // Danh sách goals giống SELECT thứ 2 trong SP
  const goals = listScoresForMatch.map((score) => ({
    minute: score.ScoreTime,
    type: score.ScoreType, // NORMAL / OWN_GOAL / PENALTY (FE tự map ra tiếng Việt)
    player: score.Player?.PlayerName || 'Unknown',
    team: score.Player?.Team?.TeamName || 'Unknown',
  }));

  const homeTeamName = teamsById[homeTeamId]?.TeamName || 'Unknown';
  const awayTeamName = teamsById[awayTeamId]?.TeamName || 'Unknown';

  return {
    homeTeamName,
    awayTeamName,
    homeScore,
    awayScore,
    goals,
  };
}

async function generateScheduleWithResult(TournamentIDRaw) {
  const TournamentID = Number(TournamentIDRaw);
  if (Number.isNaN(TournamentID)) {
    throw new Error('Invalid TournamentID');
  }

  // 1) Lấy danh sách vòng
  const rounds = await prisma.round.findMany({
    where: { TournamentID },
    orderBy: { RoundID: 'asc' },
  });

  // 2) Lấy tất cả trận của giải
  const matches = await prisma.match.findMany({
    where: { TournamentID },
    orderBy: [{ RoundID: 'asc' }, { MatchID: 'asc' }],
  });

  // 3) Lấy team của tất cả trận (Team1 + Team2)
  const teamIds = Array.from(
    new Set(
      matches
        .flatMap((m) => [m.Team1ID, m.Team2ID])
        .filter((id) => id !== null && id !== undefined)
    )
  );

  const teams = await prisma.team.findMany({
    where: { TeamID: { in: teamIds } },
    select: {
      TeamID: true,
      TeamName: true,
      TeamLogo: true,
      Stadium: true,
    },
  });

  const teamsById = teams.reduce((acc, team) => {
    acc[team.TeamID] = team;
    return acc;
  }, {});

  // 4) Lấy tất cả Listscore (bàn thắng) của giải kèm Player + Team
  const listScores = await prisma.listscore.findMany({
    where: { TournamentID },
    orderBy: [{ RoundID: 'asc' }, { MatchID: 'asc' }, { ScoreTime: 'asc' }],
    include: {
      Player: {
        include: {
          Team: true,
        },
      },
    },
  });

  // 5) Group listscore theo (RoundID, MatchID)
  const scoresByMatchKey = listScores.reduce((acc, score) => {
    const key = `${score.RoundID}-${score.MatchID}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(score);
    return acc;
  }, {});

  // 6) Build schedule
  const schedule = rounds.map((round) => {
    const roundMatches = matches.filter((m) => m.RoundID === round.RoundID);

    const matchDtos = roundMatches.map((match) => {
      const key = `${match.RoundID}-${match.MatchID}`;
      const listScoresForMatch = scoresByMatchKey[key] || [];

      const scores = computeMatchScores(match, listScoresForMatch, teamsById);

      const team1 = teamsById[match.Team1ID] || {};
      const team2 = teamsById[match.Team2ID] || {};

      return {
        matchID: match.MatchID,
        roundID: match.RoundID,
        team1ID: match.Team1ID,
        team1Name: team1.TeamName || 'Unknown',
        team1Logo: team1.TeamLogo || 'Unknown',
        team2ID: match.Team2ID,
        team2Name: team2.TeamName || 'Unknown',
        team2Logo: team2.TeamLogo || 'Unknown',
        // trong Prisma Match không có Stadium, nên lấy từ Team cho hợp lý
        stadium: team1.Stadium || team2.Stadium || null,
        date: dayjs(match.MatchDate).format('YYYY-MM-DD HH:mm:ss'),
        homeScore: scores.homeScore,
        awayScore: scores.awayScore,
        goals: scores.goals,
      };
    });

    return {
      id: round.RoundID,
      matches: matchDtos,
    };
  });

  return schedule;
}

module.exports = {
  generateScheduleWithResult,
};
