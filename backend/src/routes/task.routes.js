const express = require("express");
const TaskController = require("../controllers/task.controller");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

// Admin
const role = require("../middleware/role.middleware");
router.post("/", auth, role("ADMIN", "SUPER_ADMIN"), (req, res, next) =>
  TaskController.assign(req, res, next),
);

// Employee
router.post("/:taskId/start", auth, role("employee"), (req, res, next) =>
  TaskController.start(req, res, next),
);
router.post("/:taskId/complete", auth, role("employee"), (req, res, next) =>
  TaskController.complete(req, res, next),
);

module.exports = router;
