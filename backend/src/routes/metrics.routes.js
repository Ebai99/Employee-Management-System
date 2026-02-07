const express = require("express");
const MetricsController = require("../controllers/metrics.controller");
const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const roles = require("../constants/roles");

const router = express.Router();

router.get("/me", auth, authorize(roles.EMPLOYEE), (req, res, next) =>
  MetricsController.myMetrics(req, res, next),
);
router.get(
  "/admin",
  auth,
  authorize(roles.ADMIN, roles.SUPER_ADMIN),
  (req, res, next) => MetricsController.adminMetrics(req, res, next),
);

module.exports = router;
