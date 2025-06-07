const express = require("express");
const connectDB = require("./config/database");
const User = require("./model/userModel");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const newUser = new User(req.body);
  try {
    await newUser.save();
    res.send("User Added Successfully!!");
  } catch (error) {
    console.log(error);
  }
});
app.get("/user", async (req, res) => {
  const user = await User.find();
  res.send(user);
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong!!");
  }
});

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
