const { query } = require("../utils/db.helper");

class Attendance {
  static async clockIn(employeeId) {
    const sql = `
      INSERT INTO attendance (employee_id, clock_in)
      VALUES (?, NOW())
    `;
    const result = await query(sql, [employeeId]);
    return result.insertId || 0;
  }

  static async clockOut(employeeId) {
    const sql = `
      UPDATE attendance
      SET 
        clock_out = NOW(),
        total_hours = TIMESTAMPDIFF(MINUTE, clock_in, NOW()) / 60
      WHERE employee_id = ?
        AND clock_out IS NULL
    `;
    const result = await query(sql, [employeeId]);
    return result.affectedRows || 0;
  }

  static async getToday(employeeId) {
    const sql = `
      SELECT *
      FROM attendance
      WHERE employee_id = ?
        AND DATE(clock_in) = CURDATE()
    `;
    const rows = await query(sql, [employeeId]);
    return rows[0] || null;
  }
}

module.exports = Attendance;
