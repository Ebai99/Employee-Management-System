const express = require("express");
const ReportController = require("../controllers/report.controller");
const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const roles = require("../constants/roles");

const router = express.Router();

// Employee
router.post("/", auth, authorize(roles.EMPLOYEE), (req, res, next) =>
  ReportController.submit(req, res, next),
);
router.get("/me", auth, authorize(roles.EMPLOYEE), (req, res, next) =>
  ReportController.myReports(req, res, next),
);

// Admin
router.get(
  "/",
  auth,
  authorize(roles.ADMIN, roles.SUPER_ADMIN),
  (req, res, next) => ReportController.all(req, res, next),
);

module.exports = router;
