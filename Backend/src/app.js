const express = require("express");
const connectDB = require("./config/database");
const User = require("./model/userModel");
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const profileRouter = require('./routes/profileRouter')
const requestRouter = require('./routes/requestRouter')
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(
  cors({
    origin:'http://localhost:5173',
    credentials: true,
  })
);

app.use('/',authRouter)
app.use('/',userRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)


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
