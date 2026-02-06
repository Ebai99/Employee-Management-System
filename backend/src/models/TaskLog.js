const { query } = require("../utils/db.helper");

class TaskLog {
  static async start(taskId) {
    const sql = `
      INSERT INTO task_logs (task_id, start_time)
      VALUES (?, NOW())
    `;
    const result = await query(sql, [taskId]);
    return result.insertId || 0;
  }

  static async end(taskId, description) {
    const sql = `
      UPDATE task_logs
      SET 
        end_time = NOW(),
        duration_minutes = TIMESTAMPDIFF(MINUTE, start_time, NOW()),
        description = ?
      WHERE task_id = ?
        AND end_time IS NULL
    `;
    const result = await query(sql, [description, taskId]);
    return result.affectedRows || 0;
  }
}

module.exports = TaskLog;
