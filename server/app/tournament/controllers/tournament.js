const db = require('../../../config/db');
const AppError = require('../../../utils/appError');
const {
  storeImageInCloudinary,
  deleteImageInCloudinary,
} = require('../../../utils/cloudinaryHelpers');

exports.addTournament = async (req, res, next) => {
  try {
    // Lấy thông tin từ req.body và file
    const { TournamentName, StartDate, EndDate } = req.body;

    let TournamentLogo = null;
    if (req.file) {
      const folder = 'football/tournaments';
      TournamentLogo = await storeImageInCloudinary(req.file, folder);
      //console.log('tournamentLogo', TournamentLogo);
    }

    if (!TournamentName || !StartDate || !EndDate) {
      throw new AppError('Missing required fields', 400);
    }

    const currentDate = new Date();

    // Kiểm tra ngày bắt đầu và kết thúc
    if (new Date(StartDate) < currentDate || new Date(EndDate) < currentDate) {
      throw new AppError('Invalid date range', 400);
    }

    let pool = await db();

    // Gọi stored procedure addTournament
    const result = await pool
      .request()
      .input('TournamentName', TournamentName)
      .input('StartDate', StartDate)
      .input('EndDate', EndDate)
      .input('TournamentLogo', TournamentLogo)
      .execute('addTournament');

    // Trả về thông tin mới đã thêm
    res.json({
      message: 'Tournament added successfully',
      data: result.recordset[0],
    });

    console.log('New tournament added:', result.recordset[0]);
  } catch (error) {
    if (!(error instanceof AppError)) {
      console.error('Unexpected error:', error);
      error = new AppError('Server error', 500); // Xử lý lỗi không mong đợi
    }
    next(error); // Chuyển lỗi cho middleware xử lý lỗi
  }
};

exports.getAllTournaments = async (req, res) => {
  try {
    let pool = await db();
    const result = await pool.request().execute('getAllTournaments');
    res.json({
      status: 'success',
      data: result.recordset,
    });
  } catch (err) {
    console.error('Error connecting to database:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};

exports.getTournamentById = async (req, res) => {
  const { TournamentID } = req.params;
  if (!TournamentID) {
    return res.status(400).json({ message: 'Missing TournamentID' });
  }

  let pool;
  try {
    pool = await db();
    const result = await pool
      .request()
      .input('TournamentID', TournamentID)
      .execute('getTournamentById');

    if (!result.recordset.length) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    res.json({
      status: 'success',
      data: result.recordset[0],
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};

exports.updateTournament = async (req, res) => {
  const TournamentID = parseInt(req.params.TournamentID, 10);
  const { TournamentName, StartDate, EndDate } = req.body;

  // Validate input
  if (!TournamentID || !TournamentName || !StartDate || !EndDate) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  let pool;
  try {
    // Initialize database connection
    pool = await db();

    // First, get the current tournament data to check for the existing logo
    const currentTournamentResult = await pool
      .request()
      .input('TournamentID', TournamentID)
      .query(
        'SELECT TournamentLogo FROM Tournament WHERE TournamentID = @TournamentID'
      ); // Adjust to your actual query

    if (currentTournamentResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    const currentTournamentLogo =
      currentTournamentResult.recordset[0].TournamentLogo;

    // If a new logo file is uploaded, use that logo; otherwise, retain the existing logo
    let TournamentLogo = null;
    if (req.file) {
      const folder = 'football/tournaments';
      TournamentLogo = await storeImageInCloudinary(req.file, folder);
      console.log('TournamentLogo', TournamentLogo);
      await deleteImageInCloudinary(currentTournamentLogo);
    } else {
      TournamentLogo = currentTournamentLogo;
    }

    // Execute stored procedure to update the tournament
    const result = await pool
      .request()
      .input('TournamentID', TournamentID)
      .input('TournamentName', TournamentName)
      .input('StartDate', StartDate)
      .input('EndDate', EndDate)
      .input('TournamentLogo', TournamentLogo)
      .execute('updateTournament'); // The stored procedure name

    // Check if the stored procedure returned an error or no rows were affected
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        message: 'Tournament not found or no changes made.',
      });
    }

    // Respond with the updated information
    res.json({
      message: 'Tournament updated successfully',
      filePath: TournamentLogo
        ? `/uploads/tournaments/${TournamentLogo}`
        : null, // Return the path to the logo if it's available
    });
  } catch (error) {
    console.error('Error updating tournament:', error);
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
};
