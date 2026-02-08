const express = require("express");
const AttendanceController = require("../controllers/attendance.controller");
const auth = require("../middleware/auth.middleware");
const audit = require("../middleware/audit.middleware");
const roles = require("../constants/roles");
const authorize = require("../middleware/role.middleware");
const router = express.Router();

router.post(
  "/clock-in",
  auth,
  authorize(roles.EMPLOYEE),
  audit("clock_in", "attendance"),
  (req, res, next) => AttendanceController.clockIn(req, res, next),
);

router.post("/clock-out", auth, authorize(roles.EMPLOYEE), (req, res, next) =>
  AttendanceController.clockOut(req, res, next),
);

router.get("/today", auth, authorize(roles.EMPLOYEE), (req, res, next) =>
  AttendanceController.getToday(req, res, next),
);

module.exports = router;
