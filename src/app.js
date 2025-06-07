const express = require('express');
const connectDB = require('./config/database');
const User = require('./model/userModel');

const app = express();

app.post('/user',async(req,res)=>{
  const newUser = {
    firstName: "Alok",
    lastName: "Kumar",
    email: "aloknh31@gmail.com",
    password: "1234",
    age: 25,
    gender: "male"
  }

  const user = await User.create(newUser);
  user.save();
  res.send(user);

})

app.use("/",(err,req,res,next)=>{
  if(err){
    res.status(500).send("Something went wrong!!")
  }
})
connectDB()
.then(()=>{
  console.log("connected to database")
  app.listen(3000,()=>{
    console.log("server is running on port 3000")
  })
})
.catch((err)=>{
  console.log("error",err)
})