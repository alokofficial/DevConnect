const express = require("express");
const connectDB = require("./config/database");
const User = require("./model/userModel");

const app = express();
app.use(express.json());

//ceate a new user
app.post("/signup", async (req, res) => {
  const newUser = new User(req.body);
  try {
    const user = await newUser.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//get a users
app.post('/user',async(req,res)=>{
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

// delete a user
app.delete('/user',async(req,res)=>{
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

// update a user

app.patch('/user/:userId', async(req,res)=>{
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

// Feed API - GET /feed-- get all users from database
app.get("/feed", async (req, res) => {
  const user = await User.find();
  res.send(user);
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong!!", err);
  }
});

// connect to database and starting server
connectDB()
  .then(() => {
    console.log("connected to database");
    app.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("error", err);
  });
