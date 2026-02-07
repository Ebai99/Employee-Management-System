const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const ManagerController = require("../controllers/manager.controller");
const audit = require("../middleware/audit.middleware");
const roles = require("../constants/roles");

router.get(
  "/team",
  auth,
  authorize(roles.MANAGER, roles.SUPER_ADMIN, roles.ADMIN),
  audit("VIEW_TEAM", "employee"),
  (req, res, next) => ManagerController.team(req, res, next),
);

router.get(
  "/reports",
  auth,
  authorize(roles.MANAGER, roles.SUPER_ADMIN, roles.ADMIN),
  (req, res, next) => ManagerController.reports(req, res, next),
);

module.exports = router;
