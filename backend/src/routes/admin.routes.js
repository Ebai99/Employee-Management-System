const express = require("express");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const { createEmployeeValidator } = require("../validators/employee.validator");
const AdminController = require("../controllers/admin.controller");

const router = express.Router();

router.get("/profile", auth, role("ADMIN", "SUPER_ADMIN"), (req, res) => {
  res.json({
    message: "Admin profile accessed",
    user: req.user,
  });
});

router.post(
  "/employees",
  auth,
  role("ADMIN", "SUPER_ADMIN"),
  createEmployeeValidator,
  (req, res, next) => AdminController.createEmployee(req, res, next),
);

router.get("/employees", auth, role("ADMIN", "SUPER_ADMIN"), (req, res, next) =>
  AdminController.getAllEmployees(req, res, next),
);

router.patch(
  "/employees/:employee_code/disable",
  auth,
  role("ADMIN", "SUPER_ADMIN"),
  (req, res, next) => AdminController.disableEmployee(req, res, next),
);

router.patch(
  "/employees/:employee_code/activate",
  auth,
  role("ADMIN", "SUPER_ADMIN"),
  (req, res, next) => AdminController.activateEmployee(req, res, next),
);

router.post(
  "/assign-manager",
  auth,
  role("ADMIN", "SUPER_ADMIN"),
  (req, res, next) => AdminController.assignManager(req, res, next),
);

module.exports = router;
