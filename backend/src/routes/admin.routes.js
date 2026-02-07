const express = require("express");
const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const { createEmployeeValidator } = require("../validators/employee.validator");
const AdminController = require("../controllers/admin.controller");
const audit = require("../middleware/audit.middleware");
const roles = require("../constants/roles");

const router = express.Router();

router.get(
  "/profile",
  auth,
  authorize(roles.ADMIN, roles.SUPER_ADMIN),
  (req, res) => {
    res.json({
      message: "Admin profile accessed",
      user: req.user,
    });
  },
);

router.post(
  "/employees",
  auth,
  authorize(roles.ADMIN, roles.SUPER_ADMIN),
  audit("CREATE_EMPLOYEE", "employee"),
  createEmployeeValidator,
  (req, res, next) => AdminController.createEmployee(req, res, next),
);

router.get(
  "/employees",
  auth,
  authorize(roles.ADMIN, roles.SUPER_ADMIN),
  (req, res, next) => AdminController.getAllEmployees(req, res, next),
);

router.patch(
  "/employees/:employee_code/disable",
  auth,
  authorize(roles.ADMIN, roles.SUPER_ADMIN),
  (req, res, next) => AdminController.disableEmployee(req, res, next),
);

router.patch(
  "/employees/:employee_code/activate",
  auth,
  authorize(roles.ADMIN, roles.SUPER_ADMIN),
  (req, res, next) => AdminController.activateEmployee(req, res, next),
);

router.post(
  "/assign-manager",
  auth,
  authorize(roles.ADMIN, roles.SUPER_ADMIN),
  audit("ASSIGN_MANAGER", "employee"),
  (req, res, next) => AdminController.assignManager(req, res, next),
);

module.exports = router;
