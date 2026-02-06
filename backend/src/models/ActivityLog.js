const { query } = require("../utils/db.helper");

class ActivityLog {
  static async log({ actorType, actorId, action, ip }) {
    const sql = `
      INSERT INTO activity_logs (actor_type, actor_id, action, ip_address)
      VALUES (?, ?, ?, ?)
    `;
    await query(sql, [actorType, actorId, action, ip]);
  }
}

module.exports = ActivityLog;
