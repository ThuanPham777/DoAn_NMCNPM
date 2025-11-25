const MatchService = require('../services/match.service');

exports.addMatchScore = async (req, res) => {
  try {
    const created = await MatchService.addMatchScore(req.params, req.body);

    return res.status(200).json({
      message: 'Match score updated successfully',
      data: created,
    });
  } catch (error) {
    console.error('Error updating match score:', error);
    const status = error.statusCode || 500;
    res
      .status(status)
      .json({ message: error.message || 'Internal server error' });
  }
};

exports.getMatchDetails = async (req, res) => {
  try {
    const data = await MatchService.getMatchDetails(req.params);

    res.status(200).json({
      message: 'Match details fetched successfully',
      data,
    });
  } catch (error) {
    console.error('Error fetching match details:', error);
    const status = error.statusCode || 500;
    res
      .status(status)
      .json({ message: error.message || 'Internal server error' });
  }
};

exports.deleteMatchScore = async (req, res) => {
  try {
    await MatchService.deleteMatchScore(req.params);

    res.status(200).json({
      success: 'Match score deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting match score:', error);
    const status = error.statusCode || 500;
    res
      .status(status)
      .json({ message: error.message || 'Internal server error' });
  }
};

exports.addMatchCard = async (req, res) => {
  try {
    const created = await MatchService.addMatchCard(req.params, req.body);

    res.status(200).json({
      message: 'Match card updated successfully',
      data: created,
    });
  } catch (error) {
    console.error('Error updating match card:', error);
    const status = error.statusCode || 500;
    res
      .status(status)
      .json({ message: error.message || 'Internal server error' });
  }
};
