const { default: mongoose } = require("mongoose")

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true,
    },
},{timestamps:true})

const Wishlist = mongoose.model("Wishlist", wishlistSchema)

module.exports = Wishlist