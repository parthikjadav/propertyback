const { default: mongoose } = require("mongoose")
const mongoosePaginate = require('mongoose-paginate-v2');

const propertySchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        lat: {
            type: Number,
        },
        long: {
            type: Number,
        }
    },
    address: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: String,
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

propertySchema.plugin(mongoosePaginate)

const Property = mongoose.model("Property", propertySchema)

module.exports = Property