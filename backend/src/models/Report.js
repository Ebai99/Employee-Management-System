const { query } = require("../utils/db.helper");

class Report {
  static async create(data) {
    const sql = `
      INSERT INTO reports (employee_id, type, report_date, content)
      VALUES (?, ?, ?, ?)
    `;
    const result = await query(sql, [
      data.employee_id,
      data.type,
      data.report_date,
      data.content,
    ]);
    return result.insertId || 0;
  }

  static async getByEmployee(employeeId) {
    const sql = `
      SELECT * FROM reports
      WHERE employee_id = ?
      ORDER BY report_date DESC
    `;
    const rows = await query(sql, [employeeId]);
    return rows || [];
  }

  static async getAll(filters = {}) {
    let sql = `
      SELECT r.*, e.firstname, e.lastname
      FROM reports r
      JOIN employees e ON r.employee_id = e.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.type) {
      sql += " AND r.type = ?";
      params.push(filters.type);
    }

    if (filters.date) {
      sql += " AND r.report_date = ?";
      params.push(filters.date);
    }

    sql += " ORDER BY r.report_date DESC";

    const rows = await query(sql, params);
    return rows || [];
  }
}

module.exports = Report;
