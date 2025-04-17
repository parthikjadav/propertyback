const expressAsyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const Inquiry = require("../models/inquiry.model");
const Property = require("../models/property.model");
const Wishlist = require("../models/wishlist.model");

const analyticsController = {
    userAnalytics: expressAsyncHandler(async (req, res) => {
        const lastDate = new Date(Date.now() - 24 * 60 * 60 * 1000)

        const users = await User.find({ "createdAt": { "$gte": lastDate } }).sort({ createdAt: -1 })

        if (!users || users.length <= 0) throw new Error("no users found in last 24 hours")

        res.status(200).json({ message: "users fetched successfully", users })
    }),
    inquiryAnalytics: expressAsyncHandler(async (req, res) => {
        const lastDate = new Date(Date.now() - 24 * 60 * 60 * 1000)

        const inquiries = await Inquiry.find({ "createdAt": { "$gte": lastDate } }).sort({ createdAt: -1 })

        if (!inquiries || inquiries.length <= 0) throw new Error("no inquiries found in last 24 hours")

        res.status(200).json({ message: "inquiries fetched successfully", inquiries })
    }),
    propertiesAnalytics: expressAsyncHandler(async (req, res) => {
        const lastDate = new Date(Date.now() - 24 * 60 * 60 * 1000)

        const properties = await Property.find({ "createdAt": { "$gte": lastDate } }).sort({ createdAt: -1 })

        if (!properties || properties.length <= 0) throw new Error("no properties found in last 24 hours")

        res.status(200).json({ message: "properties fetched successfully", properties })
    }),
    wishlistAnalytics: expressAsyncHandler(async (req, res) => {
        const lastDate = new Date(Date.now() - 24 * 60 * 60 * 1000)

        const wishList = await Wishlist.find({ "createdAt": { "$gte": lastDate } }).sort({ createdAt: -1 })

        if (!wishList || wishList.length <= 0) throw new Error("no wishList found in last 24 hours")

        res.status(200).json({ message: "wishList fetched successfully", wishList })
    })
}

module.exports = analyticsController