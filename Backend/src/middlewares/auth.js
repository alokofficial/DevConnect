const jwt  = require('jsonwebtoken')
const User = require('../model/userModel')


const userAuth = async(req,res,next)=>{
  try {
    const {token} = req.cookies
    if(!token){
      return res.status(401).send("Please login first!!")
    }
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
    if(!decodedToken){
      throw new Error("Cookie not valid! Please login again!!")
    }
    const user = await User.findById(decodedToken._id).select("-password")
    if(!user){
      throw new Error("User not Found !!")
    }
    req.user=user
    next();
  } catch (error) {
    res.status(400).send(error.message)
  }
}

module.exports = {
  userAuth,
}