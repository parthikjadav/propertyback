const express = require("express");
const { authenticate } = require("../auth");
const wishlistController = require("../controllers/wishlist.controller");
const { valiate, wishlistSchema } = require("../validation");
const route = express.Router()

route.get("/",authenticate,wishlistController.getWhishlists)
route.post("/",authenticate,valiate(wishlistSchema),wishlistController.addToWishlist)
route.delete("/:id",authenticate,wishlistController.deleteWishlist)

module.exports = route