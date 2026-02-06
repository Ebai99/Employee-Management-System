const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const AuditController = require("../controllers/audit.controller");

router.get("/logs", auth, role("ADMIN", "SUPER_ADMIN"), (req, res, next) =>
  AuditController.list(req, res, next),
);

module.exports = router;
