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

// router.post("/login-student", studentLogin);
router.post("/login-student", (req, res, next) => {
  console.log("LOGIN ROUTE HIT");
  console.log(req.body);
  next();
}, studentLogin);

router.get("/test", (req, res) => {
  res.json({ success: true });
});
module.exports = router;
