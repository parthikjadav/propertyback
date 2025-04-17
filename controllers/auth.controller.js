const expressAsyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { sendToken } = require("../auth");
const { sendEmail } = require("./user.controller");
const sendOtpMail = require("../nodemailer");

const authController = {
    signUp: expressAsyncHandler(async (req, res) => {
        const { username, password, email, role } = req.body

        const isUserAlreadyExists = await User.findOne({ email })

        if (isUserAlreadyExists) throw new Error("user already exist with this email")

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role
        })
    
        if (!user) throw new Error("error creating user")
    
        await sendToken(user._id, res)
        sendOtpMail(user)
        user.password = ''
        res.status(201).json({ message: "user signed up successfully", user })
    }),
    signOut: expressAsyncHandler((req, res) => {
        res.clearCookie('token').status(200).json({ message: "successfully logged out" })
    }),
    signIn: expressAsyncHandler(async (req, res) => {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) throw new Error("user not found")

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) throw new Error("password is incorrect")
        
        await sendToken(user._id, res)
        user.password = ''
        res.status(200).json({ message: "user signed in successfully", user })
    }),
}

module.exports = authController