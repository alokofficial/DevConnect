const { Server } =require("socket.io");
const crypto = require('crypto');

const getSecretRoomId = (userId, targetUserId)=>{
  const secret = [userId, targetUserId].sort().join("-");
  return crypto.createHash("sha256").update(secret).digest("hex");
}
const createSocketServer = (server)=>{
  const io = new Server(
    server,
    {
      cors:{
        origin:"http://localhost:5173",
        credentials:true,
      }
    }
  )
  io.on("connection", (socket) => {
    // Handle events
    socket.on("joinChat", ({firstName,userId, targetUserId}) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(`${firstName} joined room - ${roomId}`);
      socket.join(roomId);
    })

    socket.on("sendMessage", ({firstName,userId, targetUserId,newMessage}) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(`${firstName}- sent message - ${newMessage}`);  
      socket.to(roomId).emit("receiveMessage", {firstName,userId, targetUserId,newMessage});
    })
    socket.on("disconnect", () => {
      
    })
  });

}
module.exports = {createSocketServer}