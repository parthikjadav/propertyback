const express = require("express");
const { authenticate } = require("../auth");
const wishlistController = require("../controllers/wishlist.controller");
const { validate, wishlistSchema } = require("../validation");
const route = express.Router()

route.get("/", wishlistController.getWishlists)
route.post("/", validate(wishlistSchema), wishlistController.addToWishlist)
route.delete("/:id", wishlistController.deleteWishlist)

module.exports = route