const express = require("express");
const ExportController = require("../controllers/export.controller");
const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const roles = require("../constants/roles");

const router = express.Router();

router.get(
  "/reports/csv",
  auth,
  authorize(roles.ADMIN, roles.SUPER_ADMIN),
  (req, res, next) => ExportController.reportsCSV(req, res, next),
);
router.get(
  "/metrics/pdf",
  auth,
  authorize(roles.ADMIN, roles.SUPER_ADMIN),
  (req, res, next) => ExportController.metricsPDF(req, res, next),
);

module.exports = router;
