const { default: mongoose } = require("mongoose");

const connectDB = () => { 
    mongoose.connect(process.env.MONGODB_URI).then(() => console.log("connected to mongodb")).catch(e => console.log(e.message)) 
}

module.exports = connectDB