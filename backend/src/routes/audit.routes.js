const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const roles = require("../constants/roles");
const AuditController = require("../controllers/audit.controller");

router.get(
  "/logs",
  auth,
  authorize(roles.ADMIN, roles.SUPER_ADMIN),
  (req, res, next) => AuditController.list(req, res, next),
);

module.exports = router;
