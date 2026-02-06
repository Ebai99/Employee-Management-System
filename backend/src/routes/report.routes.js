const express = require("express");
const ReportController = require("../controllers/report.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const router = express.Router();

// Employee
router.post("/", auth, role("employee"), (req, res, next) =>
  ReportController.submit(req, res, next),
);
router.get("/me", auth, role("employee"), (req, res, next) =>
  ReportController.myReports(req, res, next),
);

// Admin
router.get("/", auth, role("ADMIN", "SUPER_ADMIN"), (req, res, next) =>
  ReportController.all(req, res, next),
);

module.exports = router;
