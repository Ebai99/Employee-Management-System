const express = require("express");
const BreakController = require("../controllers/break.controller");
const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const roles = require("../constants/roles");
const router = express.Router();

router.post("/start", auth, authorize(roles.EMPLOYEE), (req, res, next) =>
  BreakController.start(req, res, next),
);

router.post("/end", auth, authorize(roles.EMPLOYEE), (req, res, next) =>
  BreakController.end(req, res, next),
);

router.get("/employee/history", auth, authorize(roles.EMPLOYEE), (req, res, next) =>
  BreakController.getHistory(req, res, next),
);

module.exports = router;
