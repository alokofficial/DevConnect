const express = require('express');
const { userAuth } = require('../middlewares/auth');
const requestRouter = express.Router();
const connectionRequest = require('../model/connectionRequestModel')
const User = require('../model/userModel');
const ConnectionRequest = require('../model/connectionRequestModel');

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

requestRouter.post('/request/review/:status/:requestId', userAuth, async(req,res)=>{
try {
  const loggedInUser = req.user
  const {status, requestId} = req.params
  //validate status
  const allowedStatus = ['accepted', 'rejected']
  if(!allowedStatus.includes(status)){
    throw new Error("Invalid Status")
  }
  const connectionRequest = await ConnectionRequest.findOne({
    _id:requestId,
    toUserId:loggedInUser._id,
    status:'interested'
  })
  if(!connectionRequest){
    throw new Error("Request not found")
  }
  connectionRequest.status = status
  const data = await connectionRequest.save()
  res.status(200).json({message:"Request Updated Successfully", data})

} catch (error) {
  res.status(400).send(error.message)
}
})
module.exports = requestRouter