const db = require('../../../config/db'); // Đảm bảo bạn đã cấu hình file db.js để kết nối SQL Server
const sql = require('mssql');
exports.createMatches = async (req, res) => {
  console.log('req.body: ', req.body);
  const { RoundID, TournamentID, Matches } = req.body;

  if (!RoundID || !TournamentID || !Matches || !Array.isArray(Matches)) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  try {
    // Kết nối với MSSQL
    const pool = await db();

    // Chuyển dữ liệu Matches thành JSON
    const matchesJSON = JSON.stringify(Matches);

    // Gọi stored procedure createMatch
    await pool
      .request()
      .input('RoundID', sql.Int, RoundID)
      .input('TournamentID', sql.Int, TournamentID)
      .input('Matches', sql.NVarChar, matchesJSON)
      .execute('createMatch');

    pool.close();
    res.status(200).json({ message: 'Matches created successfully' });
  } catch (error) {
    console.error('Error creating matches:', error);
    res.status(500).json({ message: 'Error creating matches' });
  }
};
