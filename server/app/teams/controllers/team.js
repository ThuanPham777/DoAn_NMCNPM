const db = require('../../../config/db');
const AppError = require('../../../utils/appError');
exports.addTeam = async (req, res, next) => {
  try {
    const { TeamName, Stadium, Coach } = req.body;
    const TeamLogo = req.file?.filename; // Get the uploaded file name from multer
    const UserID = parseInt(req.user.UserID, 10);
    console.log('User ID: ' + UserID);

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
