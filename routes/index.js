const express = require("express");
const authRoute = require("./auth.route")
const wishlistRoute = require("./wishlist.route")
const userRoute = require("./user.route")
const inquireyRoute = require("./inquirey.route")
const propertyRoute = require("./property.route")

const routes = express.Router()

routes.use("/auth",authRoute)
routes.use("/inquirey",inquireyRoute)
routes.use("/wishlist",wishlistRoute)
routes.use("/user",userRoute)
routes.use("/property",propertyRoute)

module.exports = routes