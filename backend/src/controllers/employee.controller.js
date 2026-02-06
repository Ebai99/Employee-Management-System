const EmployeeService = require("../services/employee.service");

class EmployeeController {
  static async create(req, res, next) {
    try {
      const result = await EmployeeService.createEmployee(
        { ...req.body, ip: req.ip },
        req.user,
      );

      res.status(201).json({
        success: true,
        message: "Employee created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req, res, next) {
    try {
      const employees = await EmployeeService.listEmployees();
      res.json({ success: true, data: employees });
    } catch (error) {
      next(error);
    }
  }

  static async changeStatus(req, res, next) {
    try {
      const { status } = req.body;
      await EmployeeService.changeStatus(
        req.params.id,
        status,
        req.user,
        req.ip,
      );

      res.json({ success: true, message: "Status updated" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EmployeeController;
