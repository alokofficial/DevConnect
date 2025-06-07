const express = require("express");
const connectDB = require("./config/database");
const User = require("./model/userModel");

const app = express();
app.use(express.json());

//ceate a new user
app.post("/signup", async (req, res) => {
  const newUser = new User(req.body);
  try {
    await newUser.save();
    res.send("User Added Successfully!!");
  } catch (error) {
    console.log(error);
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

app.patch('/user', async(req,res)=>{
  const data = req.body
  try {
    const user = await User.findByIdAndUpdate(req.body.id,data)
    if(!user){
      throw new Error()
    }else{
      res.send("User Updated Successfully")
    }
  } catch (error) {
    res.status(404).send("User not found")
  }
})

// Feed API - GET /feed-- get all users from database
app.get("/feed", async (req, res) => {
  const user = await User.find();
  res.send(user);
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong!!");
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
