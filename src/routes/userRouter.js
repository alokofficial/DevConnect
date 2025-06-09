const express = require('express');
const User = require('../model/userModel');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../model/connectionRequestModel');

const USER_SAFE= "firstName lastName photoUrl gender age about skills"

const userRouter = express.Router();

userRouter.get('/user/requests/received', userAuth,async(req,res)=>{
  try {
    const loggedInUser = req.user
    const connectionRequests = await ConnectionRequest.find({
      toUserId:loggedInUser._id,
      status:'interested'
    }).populate('fromUserId',USER_SAFE)
    res.send(connectionRequests)
  } catch (error) {
    res.status(400).json({message:error.message,data})
  }
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
  try {
    const loggedInUser = req.user
    const connectionRequest = await ConnectionRequest.find({
      $or:[
        {toUserId:loggedInUser._id,status:'accepted'},
        {fromUserId:loggedInUser._id,status:'accepted'}
      ]
    }).populate('fromUserId',USER_SAFE).populate('toUserId',USER_SAFE)

    const requiredData = connectionRequest.map((row)=>{
      if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
        return row.toUserId
      }else{
        return row.fromUserId
      }
    })
    res.json({data:requiredData})
  } catch (error) {
    res.status(400).json({message:error.message})
  }
})

userRouter.get('/feed',userAuth, async(req,res)=>{
  try {
    const loggedInUser = req.user
    //pagination logic
    const page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10;
    limit = Math.min(20,limit);
    const skip = (page-1)*limit;

    const connectionRequest = await ConnectionRequest.find({
      $or:[
        {fromUserId:loggedInUser._id},
        {toUserId:loggedInUser._id}
      ]
    }).select('fromUserId toUserId')

    const hideUsersFromFeed = new Set();

    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    const users = await User.find({
      $and:[
        {_id:{$nin: Array.from(hideUsersFromFeed)}},
        {_id:{$ne:loggedInUser._id}}
      ]
    }).select(USER_SAFE).limit(limit).skip(skip)
    res.send(users)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = userRouter