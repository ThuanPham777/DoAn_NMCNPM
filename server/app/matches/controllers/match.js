const db = require('../../../config/db');

exports.addMatchScore = async (req, res) => {
  try {
    // Destructure parameters from req.params
    const { MatchID, RoundID, TournamentID, PlayerID } = req.params;
    const { ScoreTime, ScoreType } = req.body;
    //console.log('ScoreTime', ScoreTime);
    //console.log('ScoreType', ScoreType);

    // Validate required inputs
    if (!MatchID || !RoundID || !TournamentID || !PlayerID) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    if (!ScoreTime || !ScoreType) {
      return res.status(400).json({ message: 'Missing required body fields' });
    }

    // Connect to the database
    const pool = await db();
    const result = await pool
      .request()
      .input('MatchID', MatchID)
      .input('RoundID', RoundID)
      .input('TournamentID', TournamentID)
      .input('PlayerID', PlayerID)
      .input('ScoreTime', ScoreTime)
      .input('ScoreType', ScoreType)
      .execute('addMatchScore');

    // Check the result of the stored procedure
    res.status(200).json({
      message: 'Match score updated successfully',
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error updating match score:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller API lấy chi tiết trận đấu
exports.getMatchDetails = async (req, res) => {
  try {
    const { MatchID, RoundID, TournamentID } = req.params;
    const pool = await db();
    const result = await pool
      .request()
      .input('MatchID', MatchID)
      .input('RoundID', RoundID)
      .input('TournamentID', TournamentID)
      .execute('getMatchDetails');

    const [matchInfo, playerDetails, cardPlayerDetails] = result.recordsets;

    console.log(cardPlayerDetails);
    res.status(200).json({
      message: 'Match details fetched successfully',
      data: {
        matchInfo: matchInfo[0], // Thông tin về trận đấu và tỷ số
        playerDetails, // Danh sách chi tiết cầu thủ ghi bàn
        cardPlayerDetails, // Danh sách chi tiết cầu thủ nhận thẻ
      },
    });
  } catch (error) {
    console.error('Error fetching match details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteMatchScore = async (req, res) => {
  try {
    const { MatchID, RoundID, TournamentID, PlayerID, minute } = req.params;
    if (!MatchID || !RoundID || !TournamentID || !PlayerID || !minute) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    const pool = await db();
    const result = await pool.request().query(`
      DELETE FROM ListScore
      WHERE MatchID = ${MatchID}
      AND RoundID = ${RoundID}
      AND TournamentID = ${TournamentID}
      AND PlayerID = ${PlayerID}
      AND ScoreTime = ${minute}
      `);
    res.status(200).json({
      success: 'Match score deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting match score:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.addMatchCard = async (req, res) => {
  try {
    // Destructure parameters from req.params
    const { MatchID, RoundID, TournamentID, PlayerID } = req.params;
    const { CardTime, CardType } = req.body;

    //console.log(CardTime, CardType);

    // Validate required inputs
    if (!MatchID || !RoundID || !TournamentID || !PlayerID) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    if (!CardTime || !CardType) {
      return res.status(400).json({ message: 'Missing required body fields' });
    }

    // Connect to the database
    const pool = await db();
    const result = await pool
      .request()
      .input('MatchID', MatchID)
      .input('RoundID', RoundID)
      .input('TournamentID', TournamentID)
      .input('PlayerID', PlayerID)
      .input('CardTime', CardTime)
      .input('CardType', CardType)
      .execute('addMatchCard');

    // Check the result of the stored procedure
    res.status(200).json({
      message: 'Match card updated successfully',
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error updating match card:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
