// src/services/rule.service.js
const prisma = require('../../../prisma');
const AppError = require('../../../utils/appError');

class RuleService {
  async getRule(TournamentIDRaw) {
    const TournamentID = Number(TournamentIDRaw);
    if (Number.isNaN(TournamentID)) {
      throw new AppError('Invalid TournamentID', 400);
    }

    const rule = await prisma.rule.findUnique({
      where: { TournamentID },
    });

    if (!rule) {
      throw new AppError('Rule not found for this tournament', 404);
    }

    return rule;
  }

  async updateRule(TournamentIDRaw, body) {
    const TournamentID = Number(TournamentIDRaw);
    if (Number.isNaN(TournamentID)) {
      throw new AppError('Invalid TournamentID', 400);
    }

    const {
      MaxTeam,
      MinTeam,
      MaxPlayer,
      MinPlayer,
      MaxForeignPlayer,
      MinAgePlayer,
      MaxAgePlayer,
      WinScore,
      LoseScore,
      DrawScore,
      MaxTimeScore,
      NumberOfTypeScore,
      RankPriorityOrder, // map sang Priority
    } = body;

    const errors = [];

    // Helper parse int field
    const parseIntField = (value, name, { required = false, min = 0 } = {}) => {
      if (value === undefined || value === null || value === '') {
        if (required) {
          errors.push(`${name} is required`);
        }
        return null;
      }

      const num = Number(value);
      if (!Number.isInteger(num)) {
        errors.push(`${name} must be an integer`);
        return null;
      }
      if (num < min) {
        errors.push(`${name} must be >= ${min}`);
        return null;
      }
      return num;
    };

    // Parse & validate từng field
    const parsed = {
      MaxTeam: parseIntField(MaxTeam, 'MaxTeam', { required: true, min: 1 }),
      MinTeam: parseIntField(MinTeam, 'MinTeam', { required: true, min: 1 }),
      MaxPlayer: parseIntField(MaxPlayer, 'MaxPlayer', {
        required: true,
        min: 1,
      }),
      MinPlayer: parseIntField(MinPlayer, 'MinPlayer', {
        required: true,
        min: 1,
      }),
      MaxForeignPlayer: parseIntField(MaxForeignPlayer, 'MaxForeignPlayer', {
        required: false,
        min: 0,
      }),
      MinAgePlayer: parseIntField(MinAgePlayer, 'MinAgePlayer', {
        required: false,
        min: 0,
      }),
      MaxAgePlayer: parseIntField(MaxAgePlayer, 'MaxAgePlayer', {
        required: false,
        min: 0,
      }),
      WinScore: parseIntField(WinScore, 'WinScore', {
        required: false,
        min: 0,
      }),
      LoseScore: parseIntField(LoseScore, 'LoseScore', {
        required: false,
        min: 0,
      }),
      DrawScore: parseIntField(DrawScore, 'DrawScore', {
        required: false,
        min: 0,
      }),
      MaxTimeScore: parseIntField(MaxTimeScore, 'MaxTimeScore', {
        required: false,
        min: 0,
      }),
      NumberOfTypeScore: parseIntField(NumberOfTypeScore, 'NumberOfTypeScore', {
        required: false,
        min: 0,
      }),
    };

    // Logic business cơ bản
    if (
      parsed.MinTeam !== null &&
      parsed.MaxTeam !== null &&
      parsed.MinTeam > parsed.MaxTeam
    ) {
      errors.push('MinTeam must be less than or equal to MaxTeam');
    }

    if (
      parsed.MinPlayer !== null &&
      parsed.MaxPlayer !== null &&
      parsed.MinPlayer > parsed.MaxPlayer
    ) {
      errors.push('MinPlayer must be less than or equal to MaxPlayer');
    }

    if (
      parsed.MaxForeignPlayer !== null &&
      parsed.MaxPlayer !== null &&
      parsed.MaxForeignPlayer > parsed.MaxPlayer
    ) {
      errors.push('MaxForeignPlayer must be less than or equal to MaxPlayer');
    }

    if (
      parsed.MinAgePlayer !== null &&
      parsed.MaxAgePlayer !== null &&
      parsed.MinAgePlayer > parsed.MaxAgePlayer
    ) {
      errors.push('MinAgePlayer must be less than or equal to MaxAgePlayer');
    }

    // Priority / RankPriorityOrder optional, chỉ cần nếu truyền thì là string
    let priority = null;
    if (RankPriorityOrder !== undefined && RankPriorityOrder !== null) {
      if (typeof RankPriorityOrder !== 'string') {
        errors.push('RankPriorityOrder must be a string');
      } else if (RankPriorityOrder.trim().length === 0) {
        errors.push('RankPriorityOrder cannot be empty');
      } else {
        priority = RankPriorityOrder.trim();
      }
    }

    // Nếu có lỗi -> quăng 400
    if (errors.length > 0) {
      throw new AppError(errors.join('; '), 400);
    }

    // Dùng upsert: nếu chưa có Rule thì tạo, có rồi thì update
    await prisma.rule.upsert({
      where: { TournamentID },
      update: {
        MaxTeam: parsed.MaxTeam,
        MinTeam: parsed.MinTeam,
        MaxPlayer: parsed.MaxPlayer,
        MinPlayer: parsed.MinPlayer,
        MaxForeignPlayer: parsed.MaxForeignPlayer,
        MinAgePlayer: parsed.MinAgePlayer,
        MaxAgePlayer: parsed.MaxAgePlayer,
        WinScore: parsed.WinScore,
        LoseScore: parsed.LoseScore,
        DrawScore: parsed.DrawScore,
        MaxTimeScore: parsed.MaxTimeScore,
        NumberOfTypeScore: parsed.NumberOfTypeScore,
        Priority: priority,
      },
      create: {
        TournamentID,
        MaxTeam: parsed.MaxTeam,
        MinTeam: parsed.MinTeam,
        MaxPlayer: parsed.MaxPlayer,
        MinPlayer: parsed.MinPlayer,
        MaxForeignPlayer: parsed.MaxForeignPlayer,
        MinAgePlayer: parsed.MinAgePlayer,
        MaxAgePlayer: parsed.MaxAgePlayer,
        WinScore: parsed.WinScore,
        LoseScore: parsed.LoseScore,
        DrawScore: parsed.DrawScore,
        MaxTimeScore: parsed.MaxTimeScore,
        NumberOfTypeScore: parsed.NumberOfTypeScore,
        Priority: priority,
      },
    });

    return {
      status: 'success',
      message: 'Rule updated successfully',
    };
  }
}

module.exports = new RuleService();
