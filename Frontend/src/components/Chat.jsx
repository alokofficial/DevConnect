import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector(store => store.user);
  const userId = user?._id;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const socketRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "end"
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userId) return;
    
    const socket = createSocketConnection();
    socketRef.current = socket;
    
    socket.emit("joinChat", { firstName: user.firstName, userId, targetUserId });
    
    socket.on("receiveMessage", ({ firstName, userId: senderId, targetUserId, newMessage, timestamp }) => {
      setMessages(prevMessages => [...prevMessages, {
        id: Date.now(),
        firstName,
        text: newMessage,
        senderId,
        timestamp: timestamp || new Date().toISOString(),
        isOwn: senderId === userId
      }]);
    });

    socket.on("userOnline", () => setIsOnline(true));
    socket.on("userOffline", () => setIsOnline(false));
    socket.on("typing", () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId, user.firstName]);

  const handleSendClick = () => {
    if (!newMessage.trim()) return;
    
    const messageData = {
      firstName: user.firstName,
      userId,
      targetUserId,
      newMessage: newMessage.trim(),
      timestamp: new Date().toISOString()
    };
    
    // Add message immediately for better UX
    setMessages(prev => [...prev, {
      id: Date.now(),
      firstName: user.firstName,
      text: newMessage.trim(),
      senderId: userId,
      timestamp: new Date().toISOString(),
      isOwn: true
    }]);

    socketRef.current?.emit("sendMessage", messageData);
    setNewMessage("");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
    
    // Emit typing indicator
    if (socketRef.current && newMessage.length > 0) {
      socketRef.current.emit("typing", { userId, targetUserId });
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  return (
    <div className="flex flex-col h-screen max-h-[600px] w-full max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
      
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {getInitials("Chat User")}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white transition-colors duration-300 ${
              isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Chat User</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isOnline ? 'Online' : 'Last seen recently'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-center">Start a conversation!</p>
          </div>
        )}

        {messages.map((message, index) => {
          if (!message.text) return null;
          
          return (
            <div
              key={message.id || index}
              className={`flex items-end gap-2 animate-fade-in-up ${
                message.isOwn ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {!message.isOwn && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {getInitials(message.firstName)}
                </div>
              )}
              
              <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'ml-auto' : 'mr-auto'}`}>
                <div
                  className={`px-4 py-2 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                    message.isOwn
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                
                <div className={`flex items-center gap-1 mt-1 text-xs text-slate-500 dark:text-slate-400 ${
                  message.isOwn ? 'justify-end' : 'justify-start'
                }`}>
                  <span>{formatTime(message.timestamp)}</span>
                  {message.isOwn && (
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              ?
            </div>
            <div className="bg-white dark:bg-slate-700 px-4 py-2 rounded-2xl rounded-bl-md border border-slate-200 dark:border-slate-600">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full resize-none rounded-xl px-4 py-3 pr-12 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 max-h-32"
              rows="1"
              style={{ 
                height: 'auto',
                minHeight: '48px'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
            />
            
            <div className="absolute right-3 bottom-3 flex gap-1">
              <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors">
                <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
            </div>
          </div>
          
          <button
            onClick={handleSendClick}
            disabled={!newMessage.trim()}
            className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-600 dark:disabled:to-slate-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Chat;