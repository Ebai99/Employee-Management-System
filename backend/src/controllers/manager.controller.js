const ManagerService = require("../services/manager.service");

class ManagerController {
  static async team(req, res, next) {
    try {
      const team = await ManagerService.getTeam(req.user.id);
      res.json({ success: true, data: team });
    } catch (error) {
      next(error);
    }
  }

  static async reports(req, res, next) {
    try {
      const reports = await ManagerService.getTeamReports(req.user.id);
      res.json({ success: true, data: reports });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ManagerController;
