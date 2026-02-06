const BreakService = require("../services/break.service");

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
}

module.exports = BreakController;
