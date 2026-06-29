const express = require("express");
const middleware = require('../middleware/AuthMiddlware');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authMiddleware = require("../middleware/AuthMiddlware");
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per window
  message: { message: "Too many login attempts. Please try again after 15 minutes." }
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 signup requests per hour
  message: { message: "Too many accounts created from this IP. Please try again after 1 hour." }
});
const {
  stdSignup,
  adminSignup,
  studentLogin,
  logoutUser,
  getMe,
} = require("../Controllers/StdController");

router.post("/signup-student", signupLimiter,
  //--- Validation Rules-- -
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/[A-Z]/).matches(/[0-9]/),
  body('fullname').trim().isLength({ min: 2, max: 50 }),
  // --- Check for errors ---
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // If data is clean, pass control to stdSignup
  }, stdSignup);

const adminGuard = (req, res, next) => {
  const secret = req.headers['x-admin-invite'];
  if (!secret || secret !== process.env.ADMIN_INVITE_SECRET) {
    return res.status(403).json({ message: "Access Forbidden." });
  }
  next();
};
router.post("/signup-admin", signupLimiter, adminGuard, adminSignup);

router.get("/me", getMe);
router.post("/login-student", loginLimiter, studentLogin);

router.post('/logout', logoutUser);

module.exports = router;
