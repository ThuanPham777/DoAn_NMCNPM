const db = require('../../../config/db');
const AppError = require('../../../utils/appError');
const sql = require('mssql');
exports.addTeam = async (req, res, next) => {
  try {
    const { TeamName, Stadium, Coach } = req.body;
    const TeamLogo = req.file?.filename; // Get the uploaded file name from multer
    const UserID = parseInt(req.user.UserID, 10);

    if (!TeamName || !Stadium || !Coach || !TeamLogo || isNaN(UserID)) {
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
    let pool = await db();
    const result = await pool.request().execute('getAllTeamsAttendTournament');
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
    const teamIDTable = new sql.Table(); // Tạo bảng tạm
    teamIDTable.columns.add('TeamID', sql.Int); // Định nghĩa cột

    // Thêm dữ liệu vào bảng tạm
    TeamIDs.forEach((teamID) => teamIDTable.rows.add(teamID));

    // Gọi Stored Procedure
    const result = await pool
      .request()
      .input('TeamIDs', teamIDTable)
      .input('TournamentID', TournamentID)
      .input('UserID', UserID)
      .execute('registerTeamsInTournament');

    res.status(200).json({ message: result.recordset[0].Message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
