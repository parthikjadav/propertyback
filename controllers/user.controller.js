const expressAsyncHandler = require("express-async-handler")
const User = require("../models/user.model")
const sendOtpMail = require("../nodemailer")
const Otp = require("../models/otp.model")
const { default: mongoose } = require("mongoose")
const { isInvalidObjectIds } = require("../utils")

const userController = {
    getUser: expressAsyncHandler((req, res) => {
        res.status(200).json({ user: req.user })
    }),
    getAllUsers: expressAsyncHandler(async (req, res) => {
        try {
            console.log("called");

            const users = await User.find().select("-password")

            if (!users) {
                res.status(400).json({ message: "no users found" })
            }
            console.log(users, "user");

            res.status(200).json({ message: "user get successfully", users })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }),
    sendEmailOtp: expressAsyncHandler(async (req, res) => {
        const user = req.user
        sendOtpMail(user)
        res.status(200).json({ message: 'otp sent successfully' })
    }),
    verifyEmail: expressAsyncHandler(async (req, res) => {
        const { otp } = req.body
        const { _id: userId } = req.user

        if (req.user.emailVerified) {
            return res.status(400).json({ message: 'email is already varifyed' })
        }

        if (!otp) {
            return res.status(400).json({ message: 'otp is required' })
        }

        const userOtp = await Otp.findOne({ userId })

        if (!userOtp) {
            sendOtpMail(req.user)
            return res.status(400).json({ message: 'otp is not valide new otp is sent to your email' })
        }

        let minuts = new Date().getMinutes() - new Date(userOtp.createdAt).getMinutes()

        if (minuts > 5) {
            sendOtpMail(req.user)
            return res.status(400).json({ message: 'otp is expired new otp is sent to your email' })
        }

        if (userOtp.otp !== otp) {
            return res.status(400).json({ message: 'otp is invalid' })
        }

        const verifyEmail = await User.findByIdAndUpdate(userId, {
            emailVerified: true
        }, { new: true })

        await Otp.findByIdAndDelete(userOtp._id)

        if (verifyEmail.emailVerified) {
            return res.status(200).json({ message: 'Email Varified Successfully' })
        }
    }),
    getUserById: expressAsyncHandler(async (req, res) => {
        try {
            console.log("called");

            const { id } = req.params
            if (isInvalidObjectIds([id])) {
                return res.status(400).json({ message: "Invalid user ID" })
            }
            const user = await User.findById(id).select("-password")

            if (!user) {
                res.status(400).json({ message: "user not found" })
            }
            res.status(200).json({ message: "user fetched successfully", user })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }),
    updateUser: async (req, res) => {
        try {
            const { id } = req.params
            const { username, email } = req.body
            if (isInvalidObjectIds([id])) {
                return res.status(400).json({ message: "Invalid user ID" })
            }
            const user = await User.findByIdAndUpdate(id, {
                username,
                email
            }, { new: true })

            if (!user) {
                return res.status(400).json({ message: "failed update user" })
            }
            user.password = ''
            res.status(200).json({ message: "user updated successfully", user })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    deleteUser: async (req,res)=>{
        try {
            const { id } = req.params
            if (isInvalidObjectIds([id])) {
                return res.status(400).json({ message: "Invalid user ID" })
            }
            
            const user = await User.findByIdAndDelete(id)
            if(!user){
                return res.status(400).json({ message: "failed to delete user" })
            }
            
            return res.status(200).json({ message: "deleted user successfully" })

        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}

module.exports = userController