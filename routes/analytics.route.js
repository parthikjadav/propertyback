const express = require("express")
const analyticsController = require("../controllers/analytics.controller")
const route = express.Router()

route.get("/user",analyticsController.userAnalytics)
route.get("/inquiry",analyticsController.inquiryAnalytics)
route.get("/property",analyticsController.propertiesAnalytics)
route.get("/wishlist",analyticsController.wishlistAnalytics)

module.exports = route