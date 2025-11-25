const prisma = require('../../../prisma');
const AppError = require('../../../utils/appError');

// Map kiểu ghi bàn từ FE (tiếng Việt) sang enum Prisma
const SCORE_TYPE_MAP = {
  'Bình thường': 'NORMAL',
  'Phản lưới': 'OWN_GOAL',
  'Phạt đền': 'PENALTY',
};

// Map kiểu thẻ từ FE sang enum Prisma
const CARD_TYPE_MAP = {
  'Thẻ vàng': 'YELLOW_CARD',
  'Thẻ đỏ': 'RED_CARD',
};

class MatchService {
  // ===== Helpers chung =====
  _parseIntOrThrow(value, fieldName) {
    const num = Number(value);
    if (Number.isNaN(num)) {
      throw new AppError(`Invalid ${fieldName}`, 400);
    }
    return num;
  }

  _mapScoreType(raw) {
    // Nếu FE gửi sẵn enum (NORMAL/OWN_GOAL/PENALTY) thì dùng luôn
    if (Object.values(SCORE_TYPE_MAP).includes(raw)) return raw;

    const mapped = SCORE_TYPE_MAP[raw];
    if (!mapped) {
      throw new AppError(
        `Invalid ScoreType. Allowed: ${Object.keys(SCORE_TYPE_MAP).join(', ')}`,
        400
      );
    }
    return mapped;
  }

  _mapCardType(raw) {
    if (Object.values(CARD_TYPE_MAP).includes(raw)) return raw;

    const mapped = CARD_TYPE_MAP[raw];
    if (!mapped) {
      throw new AppError(
        `Invalid CardType. Allowed: ${Object.keys(CARD_TYPE_MAP).join(', ')}`,
        400
      );
    }
    return mapped;
  }

  // ================== 1. Thêm bàn thắng ==================
  async addMatchScore(params, body) {
    const MatchID = this._parseIntOrThrow(params.MatchID, 'MatchID');
    const RoundID = this._parseIntOrThrow(params.RoundID, 'RoundID');
    const TournamentID = this._parseIntOrThrow(
      params.TournamentID,
      'TournamentID'
    );
    const PlayerID = this._parseIntOrThrow(params.PlayerID, 'PlayerID');

    const { ScoreTime, ScoreType } = body;

    if (ScoreTime == null || ScoreType == null) {
      throw new AppError('ScoreTime and ScoreType are required', 400);
    }

    const scoreTimeNum = this._parseIntOrThrow(ScoreTime, 'ScoreTime');
    if (scoreTimeNum <= 0) {
      throw new AppError('ScoreTime must be > 0', 400);
    }

    const scoreTypeEnum = this._mapScoreType(ScoreType);

    // chèn vào Listscore
    const created = await prisma.listscore.create({
      data: {
        MatchID,
        RoundID,
        TournamentID,
        PlayerID,
        ScoreTime: scoreTimeNum,
        ScoreType: scoreTypeEnum,
      },
    });

    return created;
  }

  // ================== 2. Chi tiết trận đấu (tỷ số + bàn thắng + thẻ) ==================
  async getMatchDetails(params) {
    const MatchID = this._parseIntOrThrow(params.MatchID, 'MatchID');
    const RoundID = this._parseIntOrThrow(params.RoundID, 'RoundID');
    const TournamentID = this._parseIntOrThrow(
      params.TournamentID,
      'TournamentID'
    );

    // ---- 2.1 Query tỷ số & tên đội (logic y hệt SP) ----
    const scoreRows = await prisma.$queryRaw`
      SELECT DISTINCT
        HT.TeamName AS HomeTeamName,
        AT.TeamName AS AwayTeamName,
        (
          -- Bàn thắng đội nhà (không tính phản lưới)
          SELECT COUNT(LS.ScoreTime)
          FROM Listscore LS
          WHERE LS.MatchID = ${MatchID}
            AND LS.RoundID = ${RoundID}
            AND LS.TournamentID = ${TournamentID}
            AND (LS.ScoreType != 'Phản lưới' OR LS.ScoreType IS NULL)
            AND LS.PlayerID IN (
              SELECT PlayerID
              FROM Player
              WHERE TeamID = HT.TeamID
            )
        )
        +
        (
          -- Bàn phản lưới của đội khách (tính cho đội nhà)
          SELECT COUNT(LS.ScoreTime)
          FROM Listscore LS
          WHERE LS.MatchID = ${MatchID}
            AND LS.RoundID = ${RoundID}
            AND LS.TournamentID = ${TournamentID}
            AND LS.ScoreType = 'Phản lưới'
            AND LS.PlayerID IN (
              SELECT PlayerID
              FROM Player
              WHERE TeamID = AT.TeamID
            )
        ) AS HomeScore,
        (
          -- Bàn thắng đội khách (không tính phản lưới)
          SELECT COUNT(LS.ScoreTime)
          FROM Listscore LS
          WHERE LS.MatchID = ${MatchID}
            AND LS.RoundID = ${RoundID}
            AND LS.TournamentID = ${TournamentID}
            AND (LS.ScoreType != 'Phản lưới' OR LS.ScoreType IS NULL)
            AND LS.PlayerID IN (
              SELECT PlayerID
              FROM Player
              WHERE TeamID = AT.TeamID
            )
        )
        +
        (
          -- Bàn phản lưới của đội nhà (tính cho đội khách)
          SELECT COUNT(LS.ScoreTime)
          FROM Listscore LS
          WHERE LS.MatchID = ${MatchID}
            AND LS.RoundID = ${RoundID}
            AND LS.TournamentID = ${TournamentID}
            AND LS.ScoreType = 'Phản lưới'
            AND LS.PlayerID IN (
              SELECT PlayerID
              FROM Player
              WHERE TeamID = HT.TeamID
            )
        ) AS AwayScore
      FROM \`Match\` M
      JOIN Team HT ON M.Team1ID = HT.TeamID
      JOIN Team AT ON M.Team2ID = AT.TeamID
      WHERE M.MatchID = ${MatchID}
        AND M.RoundID = ${RoundID}
        AND M.TournamentID = ${TournamentID};
    `;

    const score = scoreRows[0] || null;

    // ---- 2.2 Danh sách cầu thủ ghi bàn (kể cả phản lưới) ----
    const goalRows = await prisma.$queryRaw`
      SELECT
        LS.ScoreTime AS Minute,
        LS.ScoreType,
        P.PlayerID,
        P.PlayerName,
        T.TeamName AS Team
      FROM Listscore LS
      JOIN Player P ON LS.PlayerID = P.PlayerID
      JOIN Team T ON P.TeamID = T.TeamID
      WHERE LS.MatchID = ${MatchID}
        AND LS.RoundID = ${RoundID}
        AND LS.TournamentID = ${TournamentID}
      ORDER BY LS.ScoreTime;
    `;

    const playerDetails = goalRows.map((row) => ({
      minute: row.Minute,
      type: row.ScoreType,
      playerID: row.PlayerID,
      playerName: row.PlayerName,
      team: row.Team,
    }));

    // ---- 2.3 Danh sách thẻ phạt ----
    const cardRows = await prisma.$queryRaw`
      SELECT
        C.CardTime AS Minute,
        C.CardType,
        P.PlayerID,
        P.PlayerName,
        T.TeamName AS Team
      FROM Card C
      JOIN Player P ON C.PlayerID = P.PlayerID
      JOIN Team T ON P.TeamID = T.TeamID
      WHERE C.MatchID = ${MatchID}
        AND C.RoundID = ${RoundID}
        AND C.TournamentID = ${TournamentID}
      ORDER BY C.CardTime;
    `;

    const cardDetails = cardRows.map((row) => ({
      minute: row.Minute,
      type: row.CardType,
      playerID: row.PlayerID,
      playerName: row.PlayerName,
      team: row.Team,
    }));

    return {
      matchInfo: {
        homeTeamName: score?.HomeTeamName || 'Unknown',
        awayTeamName: score?.AwayTeamName || 'Unknown',
        homeScore: score?.HomeScore ?? 0,
        awayScore: score?.AwayScore ?? 0,
      },
      playerDetails,
      cardPlayerDetails: cardDetails,
    };
  }

  // ================== 3. Xóa bàn thắng ==================
  async deleteMatchScore(params) {
    const MatchID = this._parseIntOrThrow(params.MatchID, 'MatchID');
    const RoundID = this._parseIntOrThrow(params.RoundID, 'RoundID');
    const TournamentID = this._parseIntOrThrow(
      params.TournamentID,
      'TournamentID'
    );
    const PlayerID = this._parseIntOrThrow(params.PlayerID, 'PlayerID');
    const minute = this._parseIntOrThrow(params.minute, 'minute');

    try {
      await prisma.listscore.delete({
        where: {
          MatchID_RoundID_TournamentID_PlayerID_ScoreTime: {
            MatchID,
            RoundID,
            TournamentID,
            PlayerID,
            ScoreTime: minute,
          },
        },
      });
    } catch (err) {
      // P2025 = record not found
      if (err.code === 'P2025') {
        throw new AppError('Match score not found', 404);
      }
      throw err;
    }
  }

  // ================== 4. Thêm thẻ phạt ==================
  async addMatchCard(params, body) {
    const MatchID = this._parseIntOrThrow(params.MatchID, 'MatchID');
    const RoundID = this._parseIntOrThrow(params.RoundID, 'RoundID');
    const TournamentID = this._parseIntOrThrow(
      params.TournamentID,
      'TournamentID'
    );
    const PlayerID = this._parseIntOrThrow(params.PlayerID, 'PlayerID');

    const { CardTime, CardType } = body;
    if (CardTime == null || CardType == null) {
      throw new AppError('CardTime and CardType are required', 400);
    }

    const cardTimeNum = this._parseIntOrThrow(CardTime, 'CardTime');
    if (cardTimeNum <= 0) {
      throw new AppError('CardTime must be > 0', 400);
    }

    const cardTypeEnum = this._mapCardType(CardType);

    const created = await prisma.card.create({
      data: {
        MatchID,
        RoundID,
        TournamentID,
        PlayerID,
        CardTime: cardTimeNum,
        CardType: cardTypeEnum,
      },
    });

    return created;
  }
}

module.exports = new MatchService();
