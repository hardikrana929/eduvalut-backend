const express = require("express");
const middleware = require('../middleware/AuthMiddlware');
const router = express.Router();

const {
  stdSignup,
  adminSignup,
  studentLogin,
} = require("../controllers/StdController");

router.post("/signup-student", stdSignup);

router.post("/signup-admin", adminSignup);

router.post("/login-student", studentLogin);

module.exports = router;
