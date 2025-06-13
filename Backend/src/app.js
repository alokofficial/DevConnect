const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const { createServer } = require("node:http");
const { createSocketServer } = require("./utils/socket.io");
const cors = require("cors");
require("dotenv").config();
// require('./utils/cronJob') // once will fix on credential object is not valid.

const app = express();
const server = createServer(app);
createSocketServer(server)



app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong!!", err);
  }
});

// connect to database and starting server
connectDB()
  .then(() => {
    console.log("connected to database");
    server.listen(process.env.PORT, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("error", err);
  });
