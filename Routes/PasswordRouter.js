const express = require("express");
const router = express.Router();

const { forgotPassword, verifyOtp, resetPassword } = require("../Controllers/resetPasswordController");

router.post("/forgotPass", forgotPassword);

router.post("/verifyOtp", verifyOtp);

router.post("/updatePass", resetPassword);


module.exports = router;