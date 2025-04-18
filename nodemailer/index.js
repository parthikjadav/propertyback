const nodemailer = require("nodemailer");
const Otp = require("../models/otp.model");
const template = require("./otp.email.template");
const resetPasswordTemplate = require("./reset.email.template");

const APP_EMAIL = process.env.APP_EMAIL

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: APP_EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
})

const sendOtpMail = async (user) => {
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
        from: APP_EMAIL,
        to: user.email,
        subject: "Otp for verification",
        html: template(newOtp.otp),
    }
    transporter.sendMail(options, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
        } else {
            console.log("Email sent: ", info.response);
        }
    });
};

const sendEmailResetPassword = (email, link) => {
    console.log(link,'link from email');
    
    const options = {
        from: APP_EMAIL,
        to: email,
        subject: "reset your password",
        html: resetPasswordTemplate(link),
    }
    transporter.sendMail(options, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
            return false
        }
        console.log("Email sent to: ",email, info.response);
        return true
    })
    return true
}

module.exports = { sendOtpMail, sendEmailResetPassword }
