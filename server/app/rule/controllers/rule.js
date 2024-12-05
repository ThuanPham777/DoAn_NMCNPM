const db = require('../../../config/db');

exports.getRule = async (req, res) => {
  try {
    const { TournamentID } = parseInt(req.params.TournamentID, 10);
    const pool = await db(); // Kết nối đến SQL Server
    const result = await pool
      .request()
      .input('TournamentID', TournamentID)
      .execute('getRule'); // Gọi stored procedure

    // Gửi dữ liệu trả về từ database
    res.status(200).json({ data: result.recordset });
  } catch (error) {
    console.error('Error executing getRule:', error);
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu từ cơ sở dữ liệu.' });
  }
};

exports.updateRule = async (req, res) => {
  try {
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
      RankPriorityOrder,
    } = req.body;

    // console.log('max team', MaxTeam);
    // console.log('min team', MinTeam);
    // console.log('max player', MaxPlayer);
    // console.log('min player', MinPlayer);
    // console.log('max foreign player', MaxForeignPlayer);
    // console.log('min age player', MinAgePlayer);
    // console.log('max age player', MaxAgePlayer);
    // console.log('win score', WinScore);
    // console.log('lose score', LoseScore);
    // console.log('draw score', DrawScore);
    // console.log('max time score', MaxTimeScore);
    // console.log('number of type score', NumberOfTypeScore);
    // console.log('rank priority order', RankPriorityOrder);

    const TournamentID = parseInt(req.params.TournamentID, 10);

    if (!TournamentID) {
      return res.status(400).json({
        status: 'error',
        message: 'TournamentID is required',
      });
    }

    // Kết nối đến cơ sở dữ liệu
    const pool = await db();

    // Gọi stored procedure
    await pool
      .request()
      .input('TournamentID', TournamentID)
      .input('MaxTeam', MaxTeam)
      .input('MinTeam', MinTeam)
      .input('MaxPlayer', MaxPlayer)
      .input('MinPlayer', MinPlayer)
      .input('MaxForeignPlayer', MaxForeignPlayer)
      .input('MinAgePlayer', MinAgePlayer)
      .input('MaxAgePlayer', MaxAgePlayer)
      .input('WinScore', WinScore)
      .input('LoseScore', LoseScore)
      .input('DrawScore', DrawScore)
      .input('MaxTimeScore', MaxTimeScore)
      .input('NumberOfTypeScore', NumberOfTypeScore)
      .input('RankPriorityOrder', RankPriorityOrder)
      .execute('updateRule');

    res.status(200).json({
      status: 'success',
      message: 'Rule updated successfully',
    });
  } catch (error) {
    console.error('Error updating rule:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};
