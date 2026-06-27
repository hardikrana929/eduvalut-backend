const db = require("../config/db");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        //Check emial
        if (!email) {
            return res.status(400).json({
                message: "Email is require",
            })
        }
        //Check user email
        const [user] = await db.query("select * from users where email=?", [email]);
        if (user.length === 0) {
            return res.status(404).json({
                message: "User not found",
            })
        }
        //Generate OTP
        const crypto = require('crypto');
        const otp = crypto.randomInt(100000, 999999);

        //Expire after 5 minutes
        const expireTime = new Date(Date.now() + 5 * 60 * 1000);

        //Delete OLD OTP
        await db.query("delete from password_reset where email= ?", [email]);

        //Insert new row with new OTP
        await db.query("insert into password_reset (email,otp,expires_at) values(?,?,?)", [email, otp, expireTime]);
        await sendEmail(email, otp);
        res.status(200).json({
            message: "OTP send your register email.",
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
        })
    }
}

//OTP Verify
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "All Fields are required." });
        }
        const [validOtp] = await db.query("select * from password_reset where email =? AND otp =?", [email, otp]);
        if (validOtp.length === 0) {
            return res.status(400).json({
                message: "OTP Invalid",
            })
        }
        

        const otpData = validOtp[0];

        //Check expire 
        if (new Date() > new Date(otpData.expires_at)) {
            return res.status(400).json({
                message: "OTP Expire",
            })
        }
        
        await db.query("update password_reset set verified=true where email=?", [email]);

        return res.status(200).json({
            message: "OTP Verify Successfully.",
        })
    } catch (error) {
        console.log(error);
    }
}

//Reset Password
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const [rows] = await db.query(
            "SELECT * FROM password_reset WHERE email=? AND verified=true", [email]
        );
        if (rows.length === 0) {
            return res.status(403).json({ message: "OTP not verified" });
        }
        if (!email || !newPassword) {
            return res.status(400).json({ message: "All Fields are required." });
        }
        //New Password hash
        const hashPass = await bcrypt.hash(newPassword, 10);

        //Password Updated from user table
        await db.query("update users set password = ? where email = ?", [hashPass, email]);

        //After update OTP Delete
        await db.query("delete from password_reset where email=?", [email]);
        res.status(200).json({
            message: "Password reset successfully.",
        });

    } catch (error) {
        console.log(error);
    }
}
module.exports = { forgotPassword, verifyOtp, resetPassword };