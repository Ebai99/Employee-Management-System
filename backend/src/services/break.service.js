const Break = require("../models/Break");
const Attendance = require("../models/Attendance");

class BreakService {
  static async startBreak(employeeId) {
    const attendance = await Attendance.getToday(employeeId);

    if (!attendance || attendance.clock_out) {
      throw new Error("You must be clocked in to start a break");
    }

    const activeBreak = await Break.getActiveBreak(employeeId);
    if (activeBreak) {
      throw new Error("Break already in progress");
    }

    return Break.start(employeeId, attendance.id);
  }

  static async endBreak(employeeId) {
    const affected = await Break.end(employeeId);
    if (!affected) {
      throw new Error("No active break found");
    }
  }
}

module.exports = BreakService;
