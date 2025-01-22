const db = require('../../../config/db'); // Đảm bảo bạn đã cấu hình file db.js để kết nối SQL Server
const {
  storeImageInCloudinary,
  deleteImageInCloudinary,
} = require('../../../utils/cloudinaryHelpers');

exports.addPlayer = async (req, res) => {
  try {
    const { DateOfBirth, PlayerName, JerseyNumber, HomeTown, PlayerType } =
      req.body;
    const TeamID = parseInt(req.params.TeamID, 10);
    let ProfileImg = null;

    if (req.file) {
      const folder = 'football/players';
      ProfileImg = await storeImageInCloudinary(req.file, folder);
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

    const validPlayerTypes = ['Trong nước', 'Ngoài nước'];
    if (!validPlayerTypes.includes(PlayerType)) {
      return res.status(400).json({
        message: `Invalid PlayerType. Allowed values are: ${validPlayerTypes.join(
          ', '
        )}`,
      });
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
      result: result.recordset,
    });
  } catch (error) {
    console.error('Error adding player:', error);

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

    console.log('result: ' + JSON.stringify(result.recordset, null, 2));
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
    let ProfileImg = null;

    const currentPlayer = await pool
      .request()
      .input('PlayerID', PlayerID)
      .execute('getPlayerById'); // Hàm `getPlayerByID` phải trả về thông tin cầu thủ hiện tại
    if (!currentPlayer.recordset[0]) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const currentProfileImage = currentPlayer.recordset[0].ProfileImg;

    if (req.file) {
      const folder = 'football/players';
      ProfileImg = await storeImageInCloudinary(req.file, folder);
      // delete current profile image
      await deleteImageInCloudinary(currentProfileImage);
    } else {
      ProfileImg = currentProfileImage;
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
