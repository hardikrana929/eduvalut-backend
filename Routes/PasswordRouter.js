const express = require("express");
const rateLimit = require('express-rate-limit');
const router = express.Router();

const { forgotPassword, verifyOtp, resetPassword } = require("../Controllers/resetPasswordController");

const forgotLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, max: 5,
    message: { message: "Too many OTP requests. Try again in 15 minutes." }
});
const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, max: 5,
    message: { message: "Too many OTP attempts. Try again in 10 minutes." }
});

router.post("/forgotPass", forgotLimiter, forgotPassword);

router.post("/verifyOtp", otpLimiter, verifyOtp);

router.post("/updatePass", otpLimiter, resetPassword);


module.exports = router;