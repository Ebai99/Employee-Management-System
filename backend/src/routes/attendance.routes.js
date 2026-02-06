const express = require("express");
const AttendanceController = require("../controllers/attendance.controller");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/clock-in", auth, (req, res, next) =>
  AttendanceController.clockIn(req, res, next),
);

router.post("/clock-out", auth, (req, res, next) =>
  AttendanceController.clockOut(req, res, next),
);

module.exports = router;
