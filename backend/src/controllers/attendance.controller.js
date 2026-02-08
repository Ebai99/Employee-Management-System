const AttendanceService = require("../services/attendance.service");
const Attendance = require("../models/Attendance");

class AttendanceController {
  static async clockIn(req, res, next) {
    try {
      await AttendanceService.clockIn(req.user.id);
      res.json({ success: true, message: "Clock-in successful" });
    } catch (err) {
      err.statusCode = 400;
      next(err);
    }
  }

  static async clockOut(req, res, next) {
    try {
      await AttendanceService.clockOut(req.user.id);
      res.json({ success: true, message: "Clock-out successful" });
    } catch (err) {
      err.statusCode = 400;
      next(err);
    }
  }

  static async getToday(req, res, next) {
    try {
      const today = await Attendance.getToday(req.user.id);
      res.json({ success: true, data: today });
    } catch (err) {
      err.statusCode = 400;
      next(err);
    }
  }
}

module.exports = AttendanceController;
