const bcrypt = require("bcrypt");
const Employee = require("../models/Employee");
const AdminService = require("../services/admin.service");

class AdminController {
  static async createEmployee(req, res, next) {
    try {
      const { firstname, lastname, email, telephone, address, department } =
        req.body;

      // generate employee code
      const employeeCode = `EMP-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // generate access code (shown once)
      const accessCode = Math.random().toString(36).slice(-8);

      const hashedCode = await bcrypt.hash(accessCode, 10);

      const employeeId = await Employee.create({
        employeeCode: employeeCode,
        firstname,
        lastname,
        email,
        telephone,
        address,
        department,
        accessCodeHash: hashedCode,
        createdBy: req.user ? req.user.id : null,
      });

      res.status(201).json({
        success: true,
        message: "Employee created successfully",
        data: {
          id: employeeId,
          employee_code: employeeCode,
          firstname,
          lastname,
          email,
          access_code: accessCode,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async createManager(req, res, next) {
    try {
      const { firstname, lastname, email, telephone, address, department } =
        req.body;

      // generate manager code
      const managerCode = `MGR-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // generate access code (shown once)
      const accessCode = Math.random().toString(36).slice(-8);

      const hashedCode = await bcrypt.hash(accessCode, 10);

      const employeeId = await Employee.create({
        employeeCode: managerCode,
        firstname,
        lastname,
        email,
        telephone,
        address,
        department,
        accessCodeHash: hashedCode,
        createdBy: req.user ? req.user.id : null,
        role: "MANAGER",
      });

      res.status(201).json({
        success: true,
        message: "Manager created successfully",
        data: {
          id: employeeId,
          manager_code: managerCode,
          firstname,
          lastname,
          email,
          access_code: accessCode,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAllEmployees(req, res, next) {
    try {
      const employees = await Employee.findAll();

      res.json({
        success: true,
        data: employees.map((e) => ({
          ...e,
          fullname: `${e.firstname} ${e.lastname}`,
        })),
      });
    } catch (err) {
      next(err);
    }
  }

  static async getEmployeeByCode(req, res, next) {
    try {
      const { employee_code } = req.params;

      const employee = await Employee.findByCode(employee_code);

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      res.json({
        success: true,
        data: {
          ...employee,
          fullname: `${employee.firstname} ${employee.lastname}`,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async disableEmployee(req, res, next) {
    try {
      const { employee_code } = req.params;

      const updated = await Employee.updateStatus(employee_code, "inactive");

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      res.json({
        success: true,
        message: "Employee disabled successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  static async activateEmployee(req, res, next) {
    try {
      const { employee_code } = req.params;

      const updated = await Employee.updateStatus(employee_code, "active");

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      res.json({
        success: true,
        message: "Employee reactivated successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  static async assignManager(req, res, next) {
    try {
      const { employeeId, managerId } = req.body;

      const result = await AdminService.assignManager(employeeId, managerId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateEmployee(req, res, next) {
    try {
      const { employee_code } = req.params;
      const { firstname, lastname, email, telephone, address, department } =
        req.body;

      const updated = await Employee.update(employee_code, {
        firstname,
        lastname,
        email,
        telephone,
        address,
        department,
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      res.json({
        success: true,
        message: "Employee updated successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AdminController;
