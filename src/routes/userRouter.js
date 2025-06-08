const express = require('express');
const User = require('../model/userModel')

const userRouter = express.Router();

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