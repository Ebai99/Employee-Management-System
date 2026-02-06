const { query } = require("../utils/db.helper");

class AuditController {
  static async list(req, res, next) {
    try {
      const logs = await query(
        `
      SELECT *
      FROM activity_logs
      ORDER BY created_at DESC
      LIMIT 100
      `,
      );

      res.json({
        success: true,
        data: logs,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuditController;
