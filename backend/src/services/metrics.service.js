const { query } = require("../utils/db.helper");

class MetricsService {
  static async calculateDaily(employeeId, date) {
    // Attendance hours
    const attendance = await query(
      `
      SELECT IFNULL(SUM(total_hours), 0) AS hours
      FROM attendance
      WHERE employee_id = ?
        AND DATE(clock_in) = ?
      `,
      [employeeId, date],
    );

    // Tasks completed
    const tasks = await query(
      `
      SELECT COUNT(*) AS completed
      FROM tasks
      WHERE employee_id = ?
        AND status = 'completed'
        AND DATE(updated_at) = ?
      `,
      [employeeId, date],
    );

    // Productivity formula (simple but real)
    const score = Math.min(
      100,
      Math.round(
        (attendance[0]?.hours || 0) * 10 + (tasks[0]?.completed || 0) * 15,
      ),
    );

    await query(
      `
      INSERT INTO performance_metrics
      (employee_id, metric_date, attendance_hours, tasks_completed, productivity_score)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        attendance_hours = VALUES(attendance_hours),
        tasks_completed = VALUES(tasks_completed),
        productivity_score = VALUES(productivity_score)
      `,
      [
        employeeId,
        date,
        attendance[0]?.hours || 0,
        tasks[0]?.completed || 0,
        score,
      ],
    );
  }

  static async getEmployeeMetrics(employeeId) {
    const rows = await query(
      `
      SELECT metric_date, attendance_hours, tasks_completed, productivity_score
      FROM performance_metrics
      WHERE employee_id = ?
      ORDER BY metric_date
      `,
      [employeeId],
    );
    return rows;
  }

  static async getAdminMetrics() {
    const rows = await query(
      `
      SELECT 
        e.firstname,
        e.lastname,
        AVG(pm.productivity_score) AS avg_score
      FROM performance_metrics pm
      JOIN employees e ON pm.employee_id = e.id
      GROUP BY pm.employee_id
      `,
    );
    return rows;
  }
}

module.exports = MetricsService;
