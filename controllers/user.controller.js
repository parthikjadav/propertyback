const expressAsyncHandler = require("express-async-handler")
const User = require("../models/user.model")
const { sendOtpMail, sendEmailResetPassword } = require("../nodemailer")
const Otp = require("../models/otp.model")
const { default: mongoose } = require("mongoose")
const bcrypt = require("bcrypt")
const { isInvalidObjectIds } = require("../utils")
const { createToken } = require("../auth")

const userController = {
    getUser: expressAsyncHandler((req, res) => {
        res.status(200).json({ user: req.user })
    }),
    getAllUsers: expressAsyncHandler(async (req, res) => {
        try {
            let {
                search = "",
                emailVerified,
                sortBy = "asc",
                sortByCreatedAt = "asc",
                page = 1,
                limit = 10
            } = req.query;

            // Convert values
            page = parseInt(page);
            limit = parseInt(limit);
            const sortOrder = sortBy.toLowerCase() === 'desc' ? -1 : 1;
            const createdAtOrder = sortByCreatedAt.toLowerCase() === 'desc' ? -1 : 1;

            const regex = new RegExp(search, 'i');

            const filter = {
                $or: [
                    { username: { $regex: regex } },
                    { email: { $regex: regex } },
                    { role: { $regex: regex } }
                ]
            };

            // Optional filter for emailVerified
            if (emailVerified !== undefined) {
                filter.emailVerified = emailVerified === 'true';
            }

            const skip = (page - 1) * limit;

            const [users, totalCount] = await Promise.all([
                User.find(filter)
                    .sort({ username: sortOrder, createdAt: createdAtOrder })
                    .skip(skip)
                    .limit(limit)
                    .select("-password"),
                User.countDocuments(filter)
            ]);

            if (users.length === 0) {
                return res.status(404).json({ message: "No users found" });
            }

            const totalPages = Math.ceil(totalCount / limit);

            res.status(200).json({
                message: "Users fetched successfully",
                page,
                limit,
                totalCount,
                totalPages,
                users
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
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
            return res.status(400).json({ message: 'email is already verified' })
        }

        if (!otp) {
            return res.status(400).json({ message: 'otp is required' })
        }

        const userOtp = await Otp.findOne({ userId })

        if (!userOtp) {
            sendOtpMail(req.user)
            return res.status(400).json({ message: 'otp is not valid new otp is sent to your email' })
        }

        let minuets = new Date().getMinutes() - new Date(userOtp.createdAt).getMinutes()

        if (minuets > 5) {
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
            return res.status(200).json({ message: 'Email Verified Successfully' })
        }
    }),
    getUserById: expressAsyncHandler(async (req, res) => {
        try {
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
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params
            if (isInvalidObjectIds([id])) {
                return res.status(400).json({ message: "Invalid user ID" })
            }

            const user = await User.findByIdAndDelete(id)
            if (!user) {
                return res.status(400).json({ message: "failed to delete user" })
            }

            return res.status(200).json({ message: "deleted user successfully" })

        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    sendResetPasswordEmail: expressAsyncHandler(async (req, res) => {
        try {
            const { _id, email } = req.user
            const token = await createToken(_id)
            const link = `${process.env.CLIENT_BASE_URL}/reset-password/?token=${token}`
            console.log(link, process.env.CLIENT_BASE_URL);

            const success = sendEmailResetPassword(email, link)
            console.log(success);

            if (!success) throw new Error("failed to send email")

            res.status(200).json({ message: "reset password mail sent to : " + email })

        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }),
    resetPassword: expressAsyncHandler(async (req, res) => {
        try {
            const { token: { id }, password } = req.data

            const newHashedPassword = await bcrypt.hash(password, 10)
            if (!newHashedPassword) throw new Error("failed to create hash")

            const user = await User.findByIdAndUpdate(id, { password: newHashedPassword }, { new: true })
            res.status(200).json({message:"user password updated successfully",user })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    })
}

module.exports = userController