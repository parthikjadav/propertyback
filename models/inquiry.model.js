const { default: mongoose } = require("mongoose")

const inquirySchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
}, { timestamps: true })

const Inquiry = mongoose.model("Inquiry", inquirySchema)

module.exports = Inquiry