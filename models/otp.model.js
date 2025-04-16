const { default: mongoose } = require("mongoose");

const otpSchema = new mongoose.Schema({
    otp: {
        type: Number,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

const Otp = mongoose.model("Otp",otpSchema)

module.exports = Otp