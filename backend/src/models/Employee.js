const { query } = require("../utils/db.helper");

class Employee {
  static async create({
    employeeCode,
    firstname,
    lastname,
    email,
    accessCodeHash,
    createdBy,
  }) {
    const sql = `
      INSERT INTO employees 
      (employee_code, firstname, lastname, email, access_code_hash, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      employeeCode,
      firstname,
      lastname,
      email,
      accessCodeHash,
      createdBy,
    ]);
    return result.insertId;
  }

  static async findAll() {
    return await query(
      `SELECT id, employee_code, firstname, lastname, email, status, created_at FROM employees`,
    );
  }

  static async updateStatus(employeeCode, status) {
    const result = await query(
      `UPDATE employees SET status = ? WHERE employee_code = ?`,
      [status, employeeCode],
    );
    return result.affectedRows || 0;
  }

  static async findByCode(employeeCode) {
    const rows = await query(
      `SELECT * FROM employees WHERE employee_code = ? LIMIT 1`,
      [employeeCode],
    );
    return rows[0];
  }
}

module.exports = Employee;
