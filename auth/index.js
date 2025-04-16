const expressAsyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

const secret = process.env.JWT_SECRET

const createToken = expressAsyncHandler((id) => {
    return jwt.sign({ id }, secret)
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
    res.cookie("token", token)
})

const authenticate = expressAsyncHandler(async (req, res, next) => {
    const token = req.cookies['token']

    if (!token) {
        return res.status(403).json({ message: 'unautorizd user' })
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
        return res.status(403).json({ message: 'unautorizd user' })
    }
    next()
}

module.exports = { secret, createToken, sendToken, authenticate, authorize, verifyToken }