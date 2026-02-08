const { query } = require("../utils/db.helper");
const TeamMember = require("../models/TeamMember");

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

  static async getTeamMembers(managerId) {
    return await TeamMember.getTeamMembers(managerId);
  }

  static async getAvailableEmployees(managerId) {
    // Get manager's department first
    const managerInfo = await TeamMember.getManagerDepartment(managerId);
    
    if (!managerInfo) {
      throw new Error("Manager not found");
    }

    return await TeamMember.getAvailableEmployees(managerId, managerInfo.department);
  }

  static async addTeamMember(managerId, employeeId) {
    // Verify employee exists and is in the same department
    const employee = await query(
      `SELECT id, department FROM employees WHERE id = ? AND department IN 
       (SELECT department FROM employees WHERE id = ?)`,
      [employeeId, managerId],
    );

    if (!employee || employee.length === 0) {
      throw new Error("Employee not found in the same department");
    }

    return await TeamMember.addTeamMember(managerId, employeeId);
  }

  static async removeTeamMember(managerId, employeeId) {
    return await TeamMember.removeTeamMember(managerId, employeeId);
  }
}

module.exports = ManagerService;

