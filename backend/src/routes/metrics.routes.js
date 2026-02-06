const express = require("express");
const MetricsController = require("../controllers/metrics.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const router = express.Router();

router.get("/me", auth, role("employee"), (req, res, next) =>
  MetricsController.myMetrics(req, res, next),
);
router.get("/admin", auth, role("ADMIN", "SUPER_ADMIN"), (req, res, next) =>
  MetricsController.adminMetrics(req, res, next),
);

module.exports = router;
