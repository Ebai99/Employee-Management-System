const ReportService = require("../services/report.service");

class ReportController {
  // EMPLOYEE
  static async submit(req, res, next) {
    try {
      await ReportService.submit(req.user.id, req.body);
      res.json({ success: true, message: "Report submitted" });
    } catch (err) {
      err.statusCode = 400;
      next(err);
    }
  }

  static async myReports(req, res, next) {
    try {
      const reports = await ReportService.employeeReports(req.user.id);
      res.json({ success: true, data: reports });
    } catch (err) {
      next(err);
    }
  }

  // ADMIN
  static async all(req, res, next) {
    try {
      const reports = await ReportService.adminReports(req.query);
      res.json({ success: true, data: reports });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ReportController;
