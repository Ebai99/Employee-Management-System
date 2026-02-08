const { query } = require("../utils/db.helper");

class Task {
  static async create(data) {
    const sql = `
      INSERT INTO tasks
      (manager_id, employee_id, title, description, priority, deadline)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      data.manager_id || null,
      data.employee_id,
      data.title,
      data.description,
      data.priority || "medium",
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

  // Manager task operations
  static async getTasksByManager(managerId) {
    const sql = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.priority,
        t.deadline,
        t.status,
        t.created_at,
        e.firstname,
        e.lastname,
        e.email,
        e.employee_code
      FROM tasks t
      JOIN employees e ON t.employee_id = e.id
      WHERE t.manager_id = ?
      ORDER BY t.deadline ASC, t.created_at DESC
    `;
    return await query(sql, [managerId]);
  }

  static async getTasksByEmployee(employeeId) {
    const sql = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.priority,
        t.deadline,
        t.status,
        t.created_at,
        e.firstname,
        e.lastname,
        e.email
      FROM tasks t
      JOIN employees e ON t.manager_id = e.id
      WHERE t.employee_id = ?
      ORDER BY t.deadline ASC
    `;
    return await query(sql, [employeeId]);
  }

  static async getTeamTasks(managerId) {
    const sql = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.priority,
        t.deadline,
        t.status,
        t.created_at,
        e.id,
        e.firstname,
        e.lastname,
        e.employee_code
      FROM tasks t
      JOIN employees e ON t.employee_id = e.id
      WHERE t.manager_id = ?
      ORDER BY t.deadline ASC, t.created_at DESC
    `;
    return await query(sql, [managerId]);
  }

  static async updateTask(taskId, data) {
    const updateFields = [];
    const values = [];

    if (data.title !== undefined) {
      updateFields.push("title = ?");
      values.push(data.title);
    }
    if (data.description !== undefined) {
      updateFields.push("description = ?");
      values.push(data.description);
    }
    if (data.priority !== undefined) {
      updateFields.push("priority = ?");
      values.push(data.priority);
    }
    if (data.deadline !== undefined) {
      updateFields.push("deadline = ?");
      values.push(data.deadline);
    }
    if (data.status !== undefined) {
      updateFields.push("status = ?");
      values.push(data.status);
    }

    values.push(taskId);

    const sql = `UPDATE tasks SET ${updateFields.join(", ")} WHERE id = ?`;
    await query(sql, values);
  }

  static async deleteTask(taskId) {
    const sql = `DELETE FROM tasks WHERE id = ?`;
    await query(sql, [taskId]);
  }
}

module.exports = Task;
