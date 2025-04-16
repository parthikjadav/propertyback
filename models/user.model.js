const { default: mongoose } = require("mongoose")
const { ROLES } = require("../constants")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    emailVerified:{
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ROLES,
        default: 'user'
    }
},{timestamps:true})

const User = mongoose.model("User",userSchema)

module.exports = User