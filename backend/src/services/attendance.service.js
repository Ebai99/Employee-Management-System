const Attendance = require("../models/Attendance");

class AttendanceService {
  static async clockIn(employeeId) {
    const today = await Attendance.getToday(employeeId);
    if (today && !today.clock_out) {
      throw new Error("Already clocked in");
    }
    return Attendance.clockIn(employeeId);
  }

  static async clockOut(employeeId) {
    const affected = await Attendance.clockOut(employeeId);
    if (!affected) {
      throw new Error("No active session found");
    }
  }
}

module.exports = AttendanceService;
