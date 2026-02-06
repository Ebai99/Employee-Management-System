const Employee = require("../models/Employee");
const ActivityLog = require("../models/ActivityLog");
const generateAccessCode = require("../utils/accessCode.generator");
const { hashPassword } = require("../utils/password.util");

class EmployeeService {
  static async createEmployee(data, admin) {
    const accessCode = generateAccessCode();
    const accessCodeHash = await hashPassword(accessCode);

    const employeeCode = `EMP-${Date.now()}`;

    const employeeId = await Employee.create({
      employeeCode,
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      accessCodeHash,
      createdBy: admin.id,
    });

    await ActivityLog.log({
      actorType: "ADMIN",
      actorId: admin.id,
      action: `Created employee ${employeeCode}`,
      ip: data.ip,
    });

    return {
      employeeId,
      employeeCode,
      accessCode, // shown ONCE
    };
  }

  static async listEmployees() {
    return await Employee.findAll();
  }

  static async changeStatus(id, status, admin, ip) {
    await Employee.updateStatus(id, status);

    await ActivityLog.log({
      actorType: "ADMIN",
      actorId: admin.id,
      action: `Changed employee ${id} status to ${status}`,
      ip,
    });
  }
}

module.exports = EmployeeService;
