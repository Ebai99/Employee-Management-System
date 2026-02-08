const express = require("express");
const TaskController = require("../controllers/task.controller");
const auth = require("../middleware/auth.middleware");
const roles = require("../constants/roles");
const authorize = require("../middleware/role.middleware");
const audit = require("../middleware/audit.middleware");
const router = express.Router();

// Admin
router.post(
  "/",
  auth,
  authorize(roles.ADMIN, roles.SUPER_ADMIN),
  (req, res, next) => TaskController.assign(req, res, next),
);

// Manager - Create task for team member
router.post(
  "/manager/create",
  auth,
  authorize(roles.MANAGER),
  audit("CREATE_TASK", "task"),
  (req, res, next) => TaskController.createTask(req, res, next),
);

// Manager - Get all team tasks
router.get("/manager/team", auth, authorize(roles.MANAGER), (req, res, next) =>
  TaskController.getTeamTasks(req, res, next),
);

// Manager - Update task
router.put(
  "/manager/:taskId",
  auth,
  authorize(roles.MANAGER),
  audit("UPDATE_TASK", "task"),
  (req, res, next) => TaskController.updateTask(req, res, next),
);

// Manager - Delete task
router.delete(
  "/manager/:taskId",
  auth,
  authorize(roles.MANAGER),
  audit("DELETE_TASK", "task"),
  (req, res, next) => TaskController.deleteTask(req, res, next),
);

// Employee - Get assigned tasks
router.get(
  "/employee/assigned",
  auth,
  authorize(roles.EMPLOYEE),
  (req, res, next) => TaskController.getEmployeeTasks(req, res, next),
);

// Employee - Start task
router.post(
  "/:taskId/start",
  auth,
  authorize(roles.EMPLOYEE),
  (req, res, next) => TaskController.start(req, res, next),
);

// Employee - Complete task
router.post(
  "/:taskId/complete",
  auth,
  authorize(roles.EMPLOYEE),
  (req, res, next) => TaskController.complete(req, res, next),
);

module.exports = router;
