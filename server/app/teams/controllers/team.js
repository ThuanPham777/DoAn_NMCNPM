const db = require('../../../config/db');
const AppError = require('../../../utils/appError');
const sql = require('mssql');
const {
  storeImageInCloudinary,
  deleteImageInCloudinary,
} = require('../../../utils/cloudinaryHelpers');
exports.addTeam = async (req, res, next) => {
  try {
    const { TeamName, Stadium, Coach } = req.body;
    const UserID = parseInt(req.user.UserID, 10);
    let TeamLogo = null;
    if (req.file) {
      const folder = 'football/teams';
      TeamLogo = await storeImageInCloudinary(req.file, folder);
    }

    if (!TeamName || !Stadium || !Coach || isNaN(UserID)) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    let pool = await db();

    const result = await pool
      .request()
      .input('TeamName', TeamName)
      .input('Stadium', Stadium)
      .input('Coach', Coach)
      .input('TeamLogo', TeamLogo)
      .input('UserID', UserID)
      .execute('addTeam');

    res.status(201).json({
      message: 'Team added successfully',
      data: result.recordset[0],
      filePath: `/uploads/tournaments/${TeamLogo}`, // Adjust path dynamically
    });

    console.log('New team added:', result.recordset[0]);
  } catch (error) {
    console.error('Error adding team:', error);
    next(new AppError('Failed to add team', 500));
  }
};

exports.getAllTeamsAttendTournament = async (req, res) => {
  try {
    const TournamentID = parseInt(req.params.TournamentID, 10);

    console.log('Tournament ID:', TournamentID);
    if (!TournamentID) {
      return res.status(400).json({ message: 'Missing TournamentID' });
    }
    let pool = await db();
    const result = await pool
      .request()
      .input('TournamentID', TournamentID)
      .execute('getAllTeamsAttendTournament');
    res.json({
      status: 'success',
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllMyTeams = async (req, res) => {
  try {
    const { UserID } = req.user;

    if (!UserID) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    let pool = await db();
    const result = await pool
      .request()
      .input('UserID', UserID)
      .execute('getAllMyTeams');
    res.json({
      status: 'success',
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addTeamsInTournament = async (req, res) => {
  const { TeamIDs, TournamentID } = req.body;

  const UserID = parseInt(req.user.UserID, 10);

  if (!Array.isArray(TeamIDs) || TeamIDs.length === 0) {
    return res.status(400).json({ message: 'Danh sách TeamIDs không hợp lệ.' });
  }

  try {
    const pool = await db(); // Kết nối SQL Server

    // Kiểm tra các TeamIDs đã tồn tại trong giải đấu
    const existingTeamsResult = await pool
      .request()
      .input('TournamentID', sql.Int, TournamentID).query(`
        SELECT TeamID
        FROM TeamAttendTournament
        WHERE TournamentID = @TournamentID AND TeamID IN (${TeamIDs.join(',')})
      `);

    const existingTeams = existingTeamsResult.recordset.map(
      (team) => team.TeamID
    );

    if (existingTeams.length > 0) {
      return res.status(400).json({
        message: `Các đội sau đã tham gia giải đấu: ${existingTeams.join(
          ', '
        )}.`,
      });
    }

    // Tạo bảng tạm để thêm các TeamIDs
    const teamIDTable = new sql.Table();
    teamIDTable.columns.add('TeamID', sql.Int);

    // Thêm dữ liệu vào bảng tạm
    TeamIDs.forEach((teamID) => teamIDTable.rows.add(teamID));

    // Gọi Stored Procedure để thêm các đội vào giải đấu
    const result = await pool
      .request()
      .input('TeamIDs', teamIDTable)
      .input('TournamentID', sql.Int, TournamentID)
      .input('UserID', sql.Int, UserID)
      .execute('registerTeamsInTournament');

    res.status(200).json({
      success: 'đăng ký thành công',
    });
  } catch (error) {
    console.error(error);
    if (error.number === 50000) {
      return res.status(400).json({
        message: error.message, // Send the specific violation message from the trigger
      });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.updateTeam = async (req, res) => {
  const TeamID = parseInt(req.params.TeamID, 10);
  const { TeamName, Stadium, Coach } = req.body;
  const UserID = parseInt(req.user.UserID);

  // Check if required fields are provided
  if (!TeamID || !TeamName || !Stadium || !Coach) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  let pool;
  try {
    pool = await db(); // Connect to the database

    // First, get the current team data to check for the existing logo
    const currentTeamResult = await pool
      .request()
      .input('TeamID', TeamID)
      .query('SELECT TeamLogo FROM Team WHERE TeamID = @TeamID'); // Adjust to your actual query

    if (currentTeamResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const currentTeamLogo = currentTeamResult.recordset[0].TeamLogo;

    let TeamLogo = null;
    if (req.file) {
      const folder = 'football/teams';
      TeamLogo = await storeImageInCloudinary(req.file, folder);
      // delete currentTeamLogo
      await deleteImageInCloudinary(currentTeamLogo);
    } else {
      TeamLogo = currentTeamLogo; // Use the existing logo if no new file is provided
    }

    // Call the stored procedure to update the team details
    const result = await pool
      .request()
      .input('TeamID', TeamID)
      .input('TeamName', TeamName)
      .input('Stadium', Stadium)
      .input('Coach', Coach)
      .input('TeamLogo', TeamLogo)
      .input('UserID', UserID) // UserID of the person making the change
      .execute('updateTeam'); // Name of the stored procedure

    // Check if the stored procedure returned an error message
    if (result.recordset.length > 0 && result.recordset[0].ErrorMessage) {
      return res.status(400).json({
        message: result.recordset[0].ErrorMessage,
      });
    }

    // Successfully updated the team
    res.json({ message: 'Team updated successfully' });
  } catch (error) {
    console.error('Error updating team:', error);
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.getTeamsAttendTournaments = async (req, res) => {
  try {
    const pool = await db();
    const result = await pool.request().query(`
        SELECT Team.TeamID, Team.TeamName, TournamentID, Team.UserID
        FROM TeamAttendTournament
        JOIN Team ON TeamAttendTournament.TeamID = Team.TeamID
      `);

    // Gửi kết quả về client
    res.status(200).json({
      success: true,
      data: result.recordset, // Trả về danh sách các đội
    });
  } catch (error) {
    console.error('Error connecting to database:', error);

    // Gửi phản hồi lỗi về client
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
