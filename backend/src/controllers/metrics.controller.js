const MetricsService = require("../services/metrics.service");

class MetricsController {
  static async myMetrics(req, res, next) {
    try {
      const data = await MetricsService.getEmployeeMetrics(req.user.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async adminMetrics(req, res, next) {
    try {
      const data = await MetricsService.getAdminMetrics();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MetricsController;
