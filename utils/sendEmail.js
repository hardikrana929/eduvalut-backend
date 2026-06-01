const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (email, otp) => {
    try {
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MYEMAIL,
                pass: process.env.APP_PASS,
            },
        });
        const maileOption = {
            from: process.env.MYEMAIL,
            to: email,
            subject: "EduVault Password Reset OTP",

            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">

                    <img 
                        src="https://res.cloudinary.com/ddn203hk8/image/upload/v1780300987/Gemini_Generated_Image_eb6jjieb6jjieb6j_iirm3r.png" 
                        alt="EduVault Logo"
                        style="width: 500px; margin-bottom: 20px;"
                    />
                    <h2 style="color: #2563eb;">
                        EduVault Password Reset
                    </h2>
                    <p style="font-size: 16px; color: #555;">
                        Your OTP for password reset is:
                    </p>
                    <h1 style="letter-spacing: 5px; color: #111;">
                        ${otp}
                    </h1>
                    <p style="color: #777; margin-top: 20px;">
                        This OTP will expire in 5 minutes.
                    </p>
                    <p style="color: red; font-size: 14px;">
                        Do not share this OTP with anyone.
                    </p>
                </div>
            `,
        };
        await transport.sendMail(maileOption);

    } catch (error) {
        console.log(error);
    }
}

module.exports = sendEmail;