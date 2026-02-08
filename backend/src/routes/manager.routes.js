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

router.get(
  "/team-members",
  auth,
  authorize(roles.MANAGER, roles.SUPER_ADMIN, roles.ADMIN),
  (req, res, next) => ManagerController.getTeamMembers(req, res, next),
);

router.get(
  "/available-employees",
  auth,
  authorize(roles.MANAGER, roles.SUPER_ADMIN, roles.ADMIN),
  (req, res, next) => ManagerController.getAvailableEmployees(req, res, next),
);

router.post(
  "/team-members",
  auth,
  authorize(roles.MANAGER, roles.SUPER_ADMIN, roles.ADMIN),
  audit("ADD_TEAM_MEMBER", "employee"),
  (req, res, next) => ManagerController.addTeamMember(req, res, next),
);

router.delete(
  "/team-members/:employeeId",
  auth,
  authorize(roles.MANAGER, roles.SUPER_ADMIN, roles.ADMIN),
  audit("REMOVE_TEAM_MEMBER", "employee"),
  (req, res, next) => ManagerController.removeTeamMember(req, res, next),
);

module.exports = router;
