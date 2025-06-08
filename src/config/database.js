const mongoose = require('mongoose');
const {URI} = require("../utils/constants")

const connectDB = async ()=>{
    await mongoose.connect(URI+"DevConnect")
}

module.exports = connectDB