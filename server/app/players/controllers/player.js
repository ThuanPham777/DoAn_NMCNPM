const db = require('../../../config/db'); // Đảm bảo bạn đã cấu hình file db.js để kết nối SQL Server

exports.addPlayer = async (req, res) => {
  try {
    const { DateOfBirth, PlayerName, JerseyNumber, HomeTown, PlayerType } =
      req.body;
    const ProfileImg = req.file?.filename;
    const TeamID = parseInt(req.params.TeamID, 10);

    const validPlayerTypes = ['Trong nước', 'Ngoài nước'];
    if (!validPlayerTypes.includes(PlayerType)) {
      return res.status(400).json({
        message: `Invalid PlayerType. Allowed values are: ${validPlayerTypes.join(
          ', '
        )}`,
      });
    }

    // Kiểm tra nếu thiếu thông tin quan trọng
    if (
      !TeamID ||
      !DateOfBirth ||
      !PlayerName ||
      !JerseyNumber ||
      !HomeTown ||
      !PlayerType
    ) {
      return res
        .status(400)
        .json({ message: 'All required fields must be provided' });
    }

    // Kiểm tra định dạng của DateOfBirth (Phải là ngày hợp lệ)
    const parsedDateOfBirth = new Date(DateOfBirth);
    if (isNaN(parsedDateOfBirth.getTime())) {
      return res.status(400).json({ message: 'Invalid DateOfBirth format' });
    }

    // Kiểm tra JerseyNumber (Phải là số nguyên dương)
    if (isNaN(JerseyNumber) || JerseyNumber <= 0) {
      return res.status(400).json({
        message: 'Invalid JerseyNumber. It must be a positive number',
      });
    }

    // Kiểm tra độ dài của PlayerName (Ví dụ: không quá 100 ký tự)
    if (PlayerName.length > 100) {
      return res
        .status(400)
        .json({ message: 'PlayerName cannot be longer than 100 characters' });
    }

    const pool = await db();
    const result = await pool
      .request()
      .input('TeamID', TeamID)
      .input('DateOfBirth', DateOfBirth)
      .input('PlayerName', PlayerName)
      .input('JerseyNumber', JerseyNumber)
      .input('HomeTown', HomeTown || null)
      .input('ProfileImg', ProfileImg || null)
      .input('PlayerType', PlayerType.trim())
      .execute('addPlayer');

    return res.status(201).json({
      message: 'Player added successfully',
      result: result.recordset,
    });
  } catch (error) {
    console.error('Error adding player:', error);

    // Nếu lỗi từ SQL Server (ví dụ lỗi từ trigger)
    console.log('error number:', error.number);
    if (error.number === 50000) {
      // Lỗi từ RAISERROR trong SQL Server
      return res.status(400).json({
        message: error.message, // Lấy thông báo lỗi từ trigger
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.getAllPlayersOfTeam = async (req, res) => {
  try {
    const TeamID = parseInt(req.params.TeamID, 10);
    console.log(TeamID);
    if (!TeamID) {
      return res.status(400).json({ message: 'Missing TeamID' });
    }
    // Kết nối đến cơ sở dữ liệu
    const pool = await db();

    const result = await pool
      .request()
      .input('TeamID', TeamID)
      .execute('getAllPlayersOfTeam');

    res.json({
      message: 'Success',
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error adding player:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.getAllPlayersAttendingTournament = async (req, res) => {
  try {
    const TournamentID = parseInt(req.params.TournamentID);
    // Kết nối đến cơ sở dữ liệu
    const pool = await db();

    // Gọi stored procedure
    const result = await pool
      .request()
      .input('TournamentID', TournamentID)
      .execute('getAllPlayersAttendingTournament');

    res.json({
      message: 'success',
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error adding player:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.getPlayerById = async (req, res) => {
  try {
    const { PlayerID } = req.params;
    if (!PlayerID) {
      return res.status(400).json({ message: 'Missing PlayerID' });
    }

    const pool = await db();
    const result = await pool
      .request()
      .input('PlayerID', PlayerID)
      .execute('getPlayerById');

    res.json({
      message: 'Success',
      data: result.recordset[0],
    });
  } catch (error) {
    console.error('Error adding player:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.updatePlayer = async (req, res) => {
  try {
    const PlayerID = parseInt(req.params.PlayerID, 10);
    const TeamID = parseInt(req.params.TeamID, 10);
    const { DateOfBirth, PlayerName, JerseyNumber, HomeTown, PlayerType } =
      req.body;
    let ProfileImg = req.file?.filename; // Lấy ảnh từ file upload

    if (
      !PlayerID ||
      !TeamID ||
      !DateOfBirth ||
      !PlayerName ||
      !JerseyNumber ||
      !HomeTown ||
      !PlayerType
    ) {
      return res
        .status(400)
        .json({ message: 'All required fields must be provided' });
    }

    const validPlayerTypes = ['Trong nước', 'Ngoài nước'];
    if (!validPlayerTypes.includes(PlayerType)) {
      return res.status(400).json({
        message: `Invalid PlayerType. Allowed values are: ${validPlayerTypes.join(
          ', '
        )}`,
      });
    }

    const parsedDateOfBirth = new Date(DateOfBirth);
    if (isNaN(parsedDateOfBirth.getTime())) {
      return res.status(400).json({ message: 'Invalid DateOfBirth format' });
    }

    if (isNaN(JerseyNumber) || JerseyNumber <= 0) {
      return res.status(400).json({
        message: 'Invalid JerseyNumber. It must be a positive number',
      });
    }

    const pool = await db();

    // Nếu không có tệp ảnh mới, lấy giá trị `ProfileImg` hiện tại từ cơ sở dữ liệu
    if (!ProfileImg) {
      const currentPlayer = await pool
        .request()
        .input('PlayerID', PlayerID)
        .execute('getPlayerById'); // Hàm `getPlayerByID` phải trả về thông tin cầu thủ hiện tại
      ProfileImg = currentPlayer.recordset[0]?.ProfileImg || null;
    }

    const result = await pool
      .request()
      .input('PlayerID', PlayerID)
      .input('TeamID', TeamID)
      .input('DateOfBirth', DateOfBirth)
      .input('PlayerName', PlayerName)
      .input('JerseyNumber', JerseyNumber)
      .input('HomeTown', HomeTown || null)
      .input('ProfileImg', ProfileImg || null)
      .input('PlayerType', PlayerType.trim())
      .execute('updatePlayer');

    return res.status(200).json({
      message: 'Player updated successfully',
      result: result.recordset,
    });
  } catch (error) {
    console.error('Error updating player:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
