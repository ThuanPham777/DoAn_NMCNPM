const db = require('../../../config/db');
const AppError = require('../../../utils/appError');

exports.addTournament = async (req, res, next) => {
  try {
    // Lấy thông tin từ req.body và file
    const { TournamentName, StartDate, EndDate } = req.body;
    const TournamentLogo = req.file ? req.file.filename : null;

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
      filePath: `/uploads/tournaments/${TournamentLogo}`,
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
  const { TournamentID } = req.params;
  const { TournamentName, StartDate, EndDate } = req.body;
  const TournamentLogo = req.file ? req.file.filename : null;

  // Validate input
  if (!TournamentID || !TournamentName || !StartDate || !EndDate) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Initialize database connection
    const pool = await db();

    // Execute stored procedure
    const result = await pool
      .request()
      .input('TournamentID', TournamentID)
      .input('TournamentName', TournamentName)
      .input('StartDate', StartDate)
      .input('EndDate', EndDate)
      .input('TournamentLogo', TournamentLogo)
      .execute('updateTournament');

    // Check for successful update
    if (result.rowsAffected[0] === 0) {
      return res
        .status(404)
        .json({ message: 'Tournament not found or no changes made.' });
    }

    res.json({
      message: 'Tournament updated successfully',
      filePath: TournamentLogo
        ? `/uploads/tournaments/${TournamentLogo}`
        : null,
    });
  } catch (error) {
    console.error('Error updating tournament:', error);
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
};
