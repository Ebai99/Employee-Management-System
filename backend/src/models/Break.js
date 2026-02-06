const { query } = require("../utils/db.helper");

class Break {
  static async getActiveBreak(employeeId) {
    const sql = `
      SELECT * FROM breaks
      WHERE employee_id = ?
        AND break_end IS NULL
    `;
    const rows = await query(sql, [employeeId]);
    return rows[0] || null;
  }

  static async start(employeeId, attendanceId) {
    const sql = `
      INSERT INTO breaks (employee_id, attendance_id, break_start)
      VALUES (?, ?, NOW())
    `;
    const result = await query(sql, [employeeId, attendanceId]);
    return result.insertId || 0;
  }

  static async end(employeeId) {
    const sql = `
      UPDATE breaks
      SET 
        break_end = NOW(),
        duration_minutes = TIMESTAMPDIFF(MINUTE, break_start, NOW())
      WHERE employee_id = ?
        AND break_end IS NULL
    `;
    const result = await query(sql, [employeeId]);
    return result.affectedRows || 0;
  }
}

module.exports = Break;
