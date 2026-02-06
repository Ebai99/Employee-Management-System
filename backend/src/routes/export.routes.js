const express = require("express");
const ExportController = require("../controllers/export.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const router = express.Router();

router.get(
  "/reports/csv",
  auth,
  role("ADMIN", "SUPER_ADMIN"),
  (req, res, next) => ExportController.reportsCSV(req, res, next),
);
router.get(
  "/metrics/pdf",
  auth,
  role("ADMIN", "SUPER_ADMIN"),
  (req, res, next) => ExportController.metricsPDF(req, res, next),
);

module.exports = router;
