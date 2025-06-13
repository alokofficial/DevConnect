import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { use } from "react";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector(store => store.user);
  const userId= user?._id;
  const [messages, setMessages] = useState([{text: ""}]);
  const [newMessage, setNewMessage] = useState("");
  useEffect(()=>{
    if(!userId) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", {firstName:user.firstName,userId, targetUserId});
    socket.on("receiveMessage", ({firstName,userId, targetUserId,newMessage}) => {
      console.log(`${firstName}- sent message - ${newMessage}`);
      setMessages(prevMessages => [...prevMessages, {firstName,text: newMessage}]);
    })
    return () => {
      socket.disconnect();
    }
  },[userId, targetUserId])

  const handleSendClick = () =>{
    const socket = createSocketConnection();
    socket.emit("sendMessage",{firstName:user.firstName,userId, targetUserId,newMessage});
    setNewMessage("");
  }
  return (
    <div className="flex flex-col gap-4 w-10/12 mx-auto bg-emerald-900/30 rounded-2xl p-4 m-2 overflow-scroll h-96 relative">
      {messages.map((message, index) => (
        <div key={index} className="chat chat-start">
          <div className="chat-image avatar">
            {/* <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src={user.photoUrl}
              />
            </div> */}
          </div>
          <div className="chat-header">
            {message.text && message.firstName}
           {message.text && <time className="text-xs opacity-50">{new Date().toLocaleTimeString()}</time>}
          </div>
          {message.text && <div className="chat-bubble">{message?.text}</div>}
          {message.text && <div className="chat-footer opacity-50">Delivered</div>}
        </div>
      ))}
      <div className="flex gap-4 w-full mx-auto sticky bottom-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        <button className="btn btn-primary" onClick={handleSendClick}>
          send
        </button>
      </div>
    </div>
  );
};

export default Chat;
