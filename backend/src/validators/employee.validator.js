const { body } = require("express-validator");

exports.createEmployeeValidator = [
  body("firstname").trim().notEmpty().withMessage("Firstname is required"),

  body("lastname").trim().notEmpty().withMessage("Lastname is required"),

  body("email").isEmail().withMessage("Valid email is required"),
];
