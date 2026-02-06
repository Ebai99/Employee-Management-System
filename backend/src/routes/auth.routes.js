const express = require("express");
const { body } = require("express-validator");
const AuthController = require("../controllers/auth.controller");
const { loginLimiter } = require("../middleware/rateLimit.middleware");
const validate = require("../middleware/validate.middleware");

const router = express.Router();

router.post(
  "/admin/login",
  loginLimiter,
  [body("email").isEmail(), body("password").notEmpty()],
  validate,
  (req, res, next) => AuthController.adminLogin(req, res, next),
);

router.post("/employee/login", (req, res, next) =>
  AuthController.employeeLogin(req, res, next),
);

module.exports = router;
