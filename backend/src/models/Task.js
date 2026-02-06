const { query } = require("../utils/db.helper");

class Task {
  static async create(data) {
    const sql = `
      INSERT INTO tasks
      (employee_id, title, description, priority, deadline)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      data.employee_id,
      data.title,
      data.description,
      data.priority,
      data.deadline,
    ]);
    return result.insertId || 0;
  }

  static async getActiveTask(employeeId) {
    const sql = `
      SELECT * FROM tasks
      WHERE employee_id = ?
        AND status = 'active'
    `;
    const rows = await query(sql, [employeeId]);
    return rows[0] || null;
  }

  static async updateStatus(taskId, status) {
    const sql = `UPDATE tasks SET status = ? WHERE id = ?`;
    await query(sql, [status, taskId]);
  }

  static async findById(taskId) {
    const rows = await query(`SELECT * FROM tasks WHERE id = ?`, [taskId]);
    return rows[0] || null;
  }
}

module.exports = Task;
