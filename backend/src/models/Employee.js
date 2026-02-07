const { query } = require("../utils/db.helper");

class Employee {
  static async create({
    employeeCode,
    firstname,
    lastname,
    email,
    telephone,
    address,
    department,
    accessCodeHash,
    createdBy,
    role = "EMPLOYEE",
  }) {
    const sql = `
      INSERT INTO employees 
      (employee_code, firstname, lastname, email, telephone, address, department, access_code_hash, role, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      employeeCode,
      firstname,
      lastname,
      email,
      telephone || null,
      address || null,
      department || null,
      accessCodeHash,
      role,
      createdBy,
    ]);
    return result.insertId;
  }

  static async findAll() {
    return await query(
      `SELECT id, employee_code, firstname, lastname, email, telephone, address, department, status, role, created_at FROM employees`,
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

  static async updatePasswordHash(employeeCode, passwordHash) {
    const result = await query(
      `UPDATE employees SET access_code_hash = ? WHERE employee_code = ?`,
      [passwordHash, employeeCode],
    );
    return result.affectedRows || 0;
  }
}

module.exports = Employee;
