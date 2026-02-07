const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const EmployeeController = require("../controllers/employee.controller");
const roles = require("../constants/roles");

const router = express.Router();

router.post(
  "/employees",
  auth,
  authorize(roles.ADMIN, roles.SUPER_ADMIN),
  [
    body("firstname").notEmpty(),
    body("lastname").notEmpty(),
    body("email").isEmail(),
  ],
  validate,
  (req, res, next) => EmployeeController.create(req, res, next),
);

router.get(
  "/employees",
  auth,
  authorize(roles.ADMIN, roles.SUPER_ADMIN),
  (req, res, next) => EmployeeController.list(req, res, next),
);

router.patch(
  "/employees/:id/status",
  auth,
  authorize(roles.ADMIN, roles.SUPER_ADMIN),
  [body("status").isIn(["ACTIVE", "DISABLED"])],
  validate,
  (req, res, next) => EmployeeController.changeStatus(req, res, next),
);

module.exports = router;
