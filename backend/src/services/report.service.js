const Report = require("../models/Report");

class ReportService {
  static async submit(employeeId, data) {
    return Report.create({
      employee_id: employeeId,
      type: data.type,
      report_date: data.report_date,
      content: data.content,
    });
  }

  static async employeeReports(employeeId) {
    return Report.getByEmployee(employeeId);
  }

  static async adminReports(filters) {
    return Report.getAll(filters);
  }
}

module.exports = ReportService;
