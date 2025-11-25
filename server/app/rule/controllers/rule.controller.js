// src/controllers/rule.controller.js
const RuleService = require('../services/rule.service');

exports.getRule = async (req, res, next) => {
  try {
    const { TournamentID } = req.params;
    const rule = await RuleService.getRule(TournamentID);

    console.log(rule);
    res.status(200).json({ data: rule });
  } catch (error) {
    console.error('Error executing getRule:', error);
    next(error); // cho middleware lỗi xử lý chung
  }
};

exports.updateRule = async (req, res, next) => {
  try {
    const { TournamentID } = req.params;

    if (!TournamentID) {
      return res.status(400).json({
        status: 'error',
        message: 'TournamentID is required',
      });
    }

    const result = await RuleService.updateRule(TournamentID, req.body);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating rule:', error);
    next(error);
  }
};
