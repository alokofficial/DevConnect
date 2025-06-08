const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const { validateProfileData } = require('../utils/validation');

profileRouter.get('/profile/view',userAuth, async(req,res)=>{
  try {
    const user = req.user
    res.send(user)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

profileRouter.patch('/profile/edit',userAuth, async(req,res)=>{
  try {
    const isValid = validateProfileData(req);
    if(!isValid){
      throw new Error("Edit is not allowed")
    }
    const user = req.user
    Object.keys(req.body).every((key)=>user[key]=req.body[key])
    await user.save()
    res.json({message:`${user.firstName}: Profile Updated Successfully`,
              data:user})
  } catch (error) {
    res.status(400).send(error.message)
  }

})



module.exports = profileRouter