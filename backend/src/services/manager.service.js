const { query } = require("../utils/db.helper");

class ManagerService {
  static async getTeam(managerId) {
    return await query(
      `
      SELECT id, employee_code, firstname, lastname, email, status
      FROM employees
      WHERE manager_id = ?
      `,
      [managerId],
    );
  }

  static async getTeamReports(managerId) {
    return await query(
      `
      SELECT r.*, e.firstname, e.lastname
      FROM reports r
      JOIN employees e ON r.employee_id = e.id
      WHERE e.manager_id = ?
      `,
      [managerId],
    );
  }
}

module.exports = ManagerService;
