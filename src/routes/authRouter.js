const express = require('express');
const authRouter = express.Router();

const { validateSignUpData, validateSignInData } = require('../utils/validation');
const User = require('../model/userModel');


authRouter.post("/signup", async (req, res) => {
  try {
    //validate the entered data
    validateSignUpData(req)
    const {firstName, lastName, email, password} = req.body
  
    //create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
    });
    // save the user
    const user = await newUser.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post('/login', async(req,res)=>{
  try {
    validateSignInData(req)
    const {email,password} = req.body
    const user =  await User.findOne({email})
    if(!user){
      throw new Error("Invalid Credentials!")
    }
    const isPasswordMatch = await user.validatePassword(password)
    if(!isPasswordMatch){
      throw new Error("Invalid Credentials!")
    }
    const token = await user.getJWT();

    res.cookie("token",token,{ expires: new Date(Date.now() + 8 * 3600000)})
    res.send(user)
  } catch (error) {
    res.status(400).send("ERROR: "+error.message)
  }
})

authRouter.get('/logout', async(req,res)=>{
  //clean-up activity all
  res.clearCookie('token');
  res.send("Logout Successfully")
})

module.exports = authRouter;

