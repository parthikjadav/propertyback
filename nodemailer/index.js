const nodemailer = require("nodemailer");
const Otp = require("../models/otp.model");
const tamplate = require("./email.tamplate");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
})

const sendOtpMail =async (user) => {
    await Otp.deleteMany({ userId: user._id })

    const otp = 100000 + Math.floor(Math.random() * 900000)
    const newOtp = await Otp.create({
        email: user.email,
        userId: user._id,
        otp
    })
    if (!newOtp) {
        throw new Error({ message: 'error generating otp' })
    }

    const options = {
        from: process.env.APP_EMAIL,
        to: user.email,
        subject: "Otp for verification",
        html: tamplate(newOtp.otp),
    }
    transporter.sendMail(options, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
        } else {
            console.log("Email sent: ", info.response);
        }
    });
};

module.exports = sendOtpMail
