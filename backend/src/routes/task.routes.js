const express = require("express");
const TaskController = require("../controllers/task.controller");
const auth = require("../middleware/auth.middleware");
const roles = require("../constants/roles");
const authorize = require("../middleware/role.middleware");
const router = express.Router();

// Admin
router.post(
  "/",
  auth,
  authorize(roles.ADMIN, roles.SUPER_ADMIN),
  (req, res, next) => TaskController.assign(req, res, next),
);

// Employee
router.post(
  "/:taskId/start",
  auth,
  authorize(roles.EMPLOYEE),
  (req, res, next) => TaskController.start(req, res, next),
);
router.post(
  "/:taskId/complete",
  auth,
  authorize(roles.EMPLOYEE),
  (req, res, next) => TaskController.complete(req, res, next),
);

module.exports = router;
