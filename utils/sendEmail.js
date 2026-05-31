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
            subject: "EduValut Password Reset OTP",
            html: `
                <div>
                    <h2> EduValut Password Reste </h2>
                    <p> Your OTP is: </p>
                    <h1> ${otp} </h1>
                    <p>This OTP will expire in 5 minutes.</p>
                </div>
            `,
        };
        await transport.sendMail(maileOption);

    } catch (error) {
        console.log(error);
    }
}

module.exports = sendEmail;