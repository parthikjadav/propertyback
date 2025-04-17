const { default: mongoose } = require("mongoose")
const Wishlist = require("../models/wishlist.model")
const { isInvalidObjectIds } = require("../utils")

const wishlistController = {
    getWishlists: async (req, res) => {
        try {
            const { _id } = req.user;
            let { page = 1, limit = 10, search = '', sortBy = 'asc' } = req.query;
    
            page = parseInt(page);
            limit = parseInt(limit);
            const skip = (page - 1) * limit;
            const sortOrder = sortBy.toLowerCase() === "desc" ? -1 : 1;
    
    
            const regex = new RegExp(search, 'i');
    
            const filter = {
                userId: _id
            };
    
            // We need to filter based on populated `propertyId` fields, so we first get all relevant wishlist IDs
            const wishlistsWithProps = await Wishlist.find(filter)
                .populate({
                    path: "propertyId",
                    match: {
                        $or: [
                            { title: { $regex: regex } },
                            { description: { $regex: regex } },
                            { address: { $regex: regex } }
                        ]
                    }
                });
    
            // Filter out wishlists with no matched property (populate returns null if match fails)
            const filteredWishlists = wishlistsWithProps.filter(item => item.propertyId);
    
            // Manual pagination after filtering
            const paginatedWishlists = filteredWishlists.slice(skip, skip + limit);
            const totalCount = filteredWishlists.length;
            const totalPages = Math.ceil(totalCount / limit);
    
            if (!paginatedWishlists.length) {
                return res.status(404).json({ message: "No wishlisted properties found" });
            }
    
            return res.status(200).json({
                message: "Successfully fetched wishlist",
                page,
                limit,
                totalCount,
                totalPages,
                wishlist: paginatedWishlists
            });
        } catch (error) {
            return res.status(400).json({ message: "Error fetching wishlist: " + error.message });
        }
    },
    addToWishlist: async (req, res) => {
        try {
            const { userId, propertyId } = req.body

            if (isInvalidObjectIds([userId, propertyId])) {
                return res.status(400).json({ message: "invalid object id's" })
            }

            const isAlreadyAdded = await Wishlist.find({ userId, propertyId })

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