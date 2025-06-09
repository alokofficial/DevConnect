const express = require('express');
const User = require('../model/userModel');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../model/connectionRequestModel');
const USER_SAFE= "firstName lastName photoUrl gender age about skills"

const userRouter = express.Router();

/*
* GET /user/requests -- get all the pending requests of the user
* GET /user/connections
* GET /user/feed - get all users
*/

userRouter.get('/user/requests/received', userAuth,async(req,res)=>{
  try {
    const loggedInUser = req.user
    const connectionRequests = await ConnectionRequest.find({
      toUserId:loggedInUser._id,
      status:'interested'
    }).populate('fromUserId',["firstName","lastName","photoUrl","gender","age","about","skills"])
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

userRouter.post('/user',async(req,res)=>{
    try {
      const user = await User.findOne({email:req.body.email}).select("-password")
      if(!user){
        throw new Error()
      }
      else{
        res.send(user)
      }
    } catch (error) {
      res.status(404).send("User not found")
    }
})

userRouter.delete('/user',async(req,res)=>{
  try{
    // const user = await User.findOneAndDelete({_id:req.body.id})
    const user = await User.findByIdAndDelete(req.body.id)
    if(!user){
      throw new Error()
    }else{
      res.send("User Deleted Successfully")
    }
  }catch(error){
      res.status(404).send("User not found")
  }
})

userRouter.patch('/user/:userId', async(req,res)=>{
  const {userId} = req.params
  const data = req.body
  const AllowedUpdates = ['firstName','lastName','password','age','gender','photoUrl','about','skills']

  const isUpdateAllowed = Object.keys(data).every((update)=> AllowedUpdates.includes(update))

  if(!isUpdateAllowed){
    return res.status(400).send("Update is not allowed")
  }
  try {
    const user = await User.findByIdAndUpdate(userId,data,{runValidators:true})
    if(!user){
      throw new Error()
    }else{
      res.send("User Updated Successfully")
    }
  } catch (error) {
    res.status(404).send(error.message)
  }
})


module.exports = userRouter