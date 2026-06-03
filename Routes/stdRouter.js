const express = require("express");
const middleware = require('../middleware/AuthMiddlware');
const router = express.Router();

const {
  stdSignup,
  adminSignup,
  studentLogin,
} = require("../Controllers/StdController");

router.post("/signup-student", stdSignup);

router.post("/signup-admin", adminSignup);

router.post("/loginstudent", studentLogin);

module.exports = router;
