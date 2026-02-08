const { query } = require("../utils/db.helper");

class TeamMember {
  static async addTeamMember(managerId, employeeId) {
    const sql = `
      INSERT INTO team_members (manager_id, employee_id, assigned_date)
      VALUES (?, ?, NOW())
      ON DUPLICATE KEY UPDATE assigned_date = NOW()
    `;
    const result = await query(sql, [managerId, employeeId]);
    return result.insertId;
  }

  static async removeTeamMember(managerId, employeeId) {
    const sql = `
      DELETE FROM team_members 
      WHERE manager_id = ? AND employee_id = ?
    `;
    const result = await query(sql, [managerId, employeeId]);
    return result.affectedRows || 0;
  }

  static async getTeamMembers(managerId) {
    const sql = `
      SELECT 
        e.id,
        e.employee_code,
        e.firstname,
        e.lastname,
        e.email,
        e.telephone,
        e.address,
        e.department,
        e.status,
        e.role,
        tm.assigned_date
      FROM team_members tm
      JOIN employees e ON tm.employee_id = e.id
      WHERE tm.manager_id = ?
      ORDER BY tm.assigned_date DESC
    `;
    return await query(sql, [managerId]);
  }

  static async getAvailableEmployees(managerId, department) {
    const sql = `
      SELECT 
        e.id,
        e.employee_code,
        e.firstname,
        e.lastname,
        e.email,
        e.department,
        e.status,
        CASE WHEN tm.employee_id IS NOT NULL THEN 1 ELSE 0 END as is_in_team
      FROM employees e
      LEFT JOIN team_members tm ON e.id = tm.employee_id AND tm.manager_id = ?
      WHERE e.department = ? 
        AND e.role = 'EMPLOYEE'
        AND e.status = 'ACTIVE'
      ORDER BY e.firstname ASC
    `;
    return await query(sql, [managerId, department]);
  }

  static async getManagerDepartment(managerId) {
    const sql = `
      SELECT department FROM employees WHERE id = ? AND role = 'MANAGER'
    `;
    const result = await query(sql, [managerId]);
    return result[0];
  }
}

module.exports = TeamMember;
