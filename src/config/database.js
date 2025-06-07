const mongoose = require('mongoose');
// const {URI} = require('./utils/constants');

const connectDB = async ()=>{
    await mongoose.connect("mongodb://localhost:27017/"+"DevConnect")
}

module.exports = connectDB