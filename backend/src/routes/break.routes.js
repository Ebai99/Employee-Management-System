const express = require("express");
const BreakController = require("../controllers/break.controller");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/start", auth, (req, res, next) =>
  BreakController.start(req, res, next),
);

router.post("/end", auth, (req, res, next) =>
  BreakController.end(req, res, next),
);

module.exports = router;
