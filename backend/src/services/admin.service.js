const { query } = require("../utils/db.helper");

class AdminService {
  static async assignManager(employeeId, managerId) {
    await query(
      `
      UPDATE employees
      SET manager_id = ?
      WHERE id = ?
      `,
      [managerId, employeeId],
    );

    return { message: "Manager assigned successfully" };
  }
}

module.exports = AdminService;
