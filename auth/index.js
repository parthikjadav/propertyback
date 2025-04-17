const expressAsyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

const secret = process.env.JWT_SECRET

const createToken = expressAsyncHandler((id) => {
    return jwt.sign({ id }, secret, { expiresIn: "7d" })
})

const verifyToken = expressAsyncHandler((token) => {
    if (token) {
        const user = jwt.verify(token, secret)
        if (user) {
            return user
        }
        return false
    }
    return false
})

const sendToken = expressAsyncHandler(async (id, res) => {
    const token = await createToken(id)
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
})

const authenticate = expressAsyncHandler(async (req, res, next) => {
    const token = req.cookies['token']

    if (!token) {
        return res.status(403).json({ message: 'unauthorized user' })
    }
    const { id } = await verifyToken(token)
    const user = await User.findById(id).select("-password")

    if (!user) {
        return res.status(403).json({ message: 'invalid user token' })
    }
    req.user = user
    next()
})

const authorize = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'unauthorized user' })
    }
    next()
}

module.exports = { secret, createToken, sendToken, authenticate, authorize, verifyToken }