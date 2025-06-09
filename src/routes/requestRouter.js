const express = require('express');
const { userAuth } = require('../middlewares/auth');
const requestRouter = express.Router();
const connectionRequest = require('../model/connectionRequestModel')
const User = require('../model/userModel')

requestRouter.post('/request/send/:status/:toUserId', userAuth ,async(req,res)=>{
  try {
    const toUserId = req.params.toUserId
    const status = req.params.status
    const fromUserId = req.user._id
    const toUser = await User.findById(toUserId)
    if(!toUser){
      throw new Error("Requested User not found!!")
    }
    const allowedStatus = ['ignored', 'interested']
    if(!allowedStatus.includes(status)){
      throw new Error("Invalid Status")
    }
    const existingConnectionRequest = await connectionRequest.findOne({
      $or: [
        {fromUserId,toUserId},
        {fromUserId:toUserId,toUserId:fromUserId}
      ]
    })
    if(existingConnectionRequest){
      throw new Error("Already requested")
    }
    const newRequest = new connectionRequest({
      fromUserId,
      toUserId,
      status
    })
    const request = await newRequest.save()
    res.send(request)
  } catch (error) {
    res.status(400).send(error.message)
  }
  
})

module.exports = requestRouter