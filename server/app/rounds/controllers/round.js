const db = require('../../../config/db'); // Đảm bảo bạn đã cấu hình file db.js để kết nối SQL Server
const sql = require('mssql');
exports.createRounds = async (req, res) => {
  const { TournamentID, Rounds } = req.body;

  if (!TournamentID || !Rounds || !Array.isArray(Rounds)) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  try {
    // Kết nối với MSSQL
    const pool = await db();

    // Chuyển dữ liệu Rounds thành JSON
    const roundsJSON = JSON.stringify(Rounds);

    // Gọi stored procedure createRound
    await pool
      .request()
      .input('TournamentID', sql.Int, TournamentID)
      .input('Rounds', sql.NVarChar, roundsJSON)
      .execute('createRound');

    pool.close();
    res.status(200).json({ message: 'Rounds created successfully' });
  } catch (error) {
    console.error('Error creating rounds:', error);
    res.status(500).json({ message: 'Error creating rounds' });
  }
};
