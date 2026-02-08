const BreakService = require("../services/break.service");
const Break = require("../models/Break");

class BreakController {
  static async start(req, res, next) {
    try {
      await BreakService.startBreak(req.user.id);
      res.json({ success: true, message: "Break started" });
    } catch (err) {
      err.statusCode = 400;
      next(err);
    }
  }

  static async end(req, res, next) {
    try {
      await BreakService.endBreak(req.user.id);
      res.json({ success: true, message: "Break ended" });
    } catch (err) {
      err.statusCode = 400;
      next(err);
    }
  }

  static async getHistory(req, res, next) {
    try {
      const employeeId = req.user.id;
      const breaks = await Break.getHistory(employeeId);
      res.json({ success: true, data: breaks });
    } catch (err) {
      err.statusCode = 400;
      next(err);
    }
  }
}

module.exports = BreakController;
