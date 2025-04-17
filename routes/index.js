const express = require("express");
const authRoute = require("./auth.route")
const wishlistRoute = require("./wishlist.route")
const userRoute = require("./user.route")
const inquiryRoute = require("./inquiry.route")
const analyticsRoute = require("./analytics.route")
const propertyRoute = require("./property.route");
const { authenticate, authorize } = require("../auth");
const { ROLES } = require("../constants");

const routes = express.Router()

routes.use("/auth", authRoute)
routes.use("/analytics",authenticate,authorize([ROLES.ADMIN]), analyticsRoute)
routes.use("/inquiry",authenticate, inquiryRoute)
routes.use("/wishlist",authenticate, wishlistRoute)
routes.use("/user",authenticate, userRoute)
routes.use("/property",authenticate, authorize([ROLES.ADMIN, ROLES.OWNER]), propertyRoute)

module.exports = routes