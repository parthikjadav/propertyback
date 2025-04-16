const { default: mongoose } = require("mongoose")
const Wishlist = require("../models/wishlist.model")
const { isInvalidObjectIds } = require("../utils")

const wishlistController = {
    getWhishlists: async (req, res) => {
        try {
            const { _id } = req.user

            const wishlist = await Wishlist.find({ userId: _id })

            if (!wishlist || wishlist.length <= 0) {
                return res.status(400).json({ message: "wishlist not found" })
            }

            return res.status(200).json({ message: "successfully fetched wishlist", wishlist })
        } catch (error) {
            return res.status(400).json({ message: "wishlist not found" + error.message })
        }
    },
    addToWishlist: async (req, res) => {
        try {
            const { userId, propertyId } = req.body

            if (isInvalidObjectIds([userId,propertyId])) {
                return res.status(400).json({ message: "invalid object id's" })
            }

            const isAlreadyAdded = await Wishlist.find({ userId, propertyId })
            console.log(isAlreadyAdded);

            if (isAlreadyAdded.length != 0) {
                return res.status(400).json({ message: "property already added to your wishlist" })
            }

            const wishlist = await Wishlist.create({
                userId,
                propertyId
            })

            if (!wishlist) {
                return res.status(400).json({ message: "failed to create wishlist" })
            }

            return res.status(201).json({ message: "successfully created wishlist", wishlist })
        } catch (error) {
            return res.status(400).json({ message: "failed to add wishlist" + error.message })
        }
    },
    deleteWishlist: async (req, res) => {
        try {
            const { id } = req.params
            const user = req.user._id

            if (isInvalidObjectIds([id])) {
                return res.status(400).json({ message: "invalid object id" })
            }

            const isNotAdmin = req.user.role !== 'admin'

            if (isNotAdmin) {
                const wishList = await Wishlist.findById(id)

                if (wishList.userId !== user._id) {
                    return res.status(400).json({ message: "you does not have created this wishlist" })
                }
            }

            const deletedWishlist = await Wishlist.findByIdAndDelete(id)

            if (!deletedWishlist) {
                return res.status(400).json({ message: "failed to delete wishlist" })
            }

            return res.status(200).json({ message: "deleted wishlist successfully" })
        } catch (error) {
            return res.status(400).json({ message: "failed to delete wishlist" + error.message })
        }
    }
}

module.exports = wishlistController