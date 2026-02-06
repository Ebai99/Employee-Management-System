const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const EmployeeController = require("../controllers/employee.controller");

const router = express.Router();

router.post(
  "/employees",
  auth,
  role("ADMIN", "SUPER_ADMIN"),
  [
    body("firstname").notEmpty(),
    body("lastname").notEmpty(),
    body("email").isEmail(),
  ],
  validate,
  (req, res, next) => EmployeeController.create(req, res, next),
);

router.get("/employees", auth, role("ADMIN", "SUPER_ADMIN"), (req, res, next) =>
  EmployeeController.list(req, res, next),
);

router.patch(
  "/employees/:id/status",
  auth,
  role("ADMIN", "SUPER_ADMIN"),
  [body("status").isIn(["ACTIVE", "DISABLED"])],
  validate,
  (req, res, next) => EmployeeController.changeStatus(req, res, next),
);

module.exports = router;
