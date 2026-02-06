const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const ManagerController = require("../controllers/manager.controller");
const audit = require("../middleware/audit.middleware");

router.get(
  "/team",
  auth,
  role("MANAGER"),
  audit("VIEW_TEAM", "employee"),
  (req, res, next) => ManagerController.team(req, res, next),
);

router.get("/reports", auth, role("MANAGER"), (req, res, next) =>
  ManagerController.reports(req, res, next),
);

module.exports = router;
