import socket from 'socket.io-client';

// let socketInstance  = null;

import { io } from "socket.io-client";

let socketInstance = null;

// Initialize socket connection
export const initializeSocket = (projectId) => {
  const token = localStorage.getItem("token");
  // Use your VITE_API_URL (backend base URL) from .env
  socketInstance = io(import.meta.env.VITE_API_URL, {
    auth: { token },
    query: { projectId },
    transports: ['websocket']
  });

  socketInstance.on("connect", () => {
    console.log("Socket connected:", socketInstance.id);
  });
  socketInstance.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  // You can add general error handler:
  socketInstance.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  return socketInstance;
};

// Receive messages from server
export const receiveMessage = (eventName, callback) => {
  if (!socketInstance) {
    console.warn("Socket not initialized");
    return;
  }
  socketInstance.on(eventName, callback);
};

// Send messages to server
export const sendMessage = (eventName, message) => {
  if (!socketInstance) {
    console.warn("Socket not initialized");
    return;
  }
  socketInstance.emit(eventName, message);
};

// Optionally, expose the socket instance for advanced use
export const getSocket = () => socketInstance;

// export const initializeSocket = ( projectId)=>{

//     socketInstance = socket(import.meta.env.VITE_API_URL,{
//         auth:{
//             token :localStorage.getItem('token')
//         },query:{
//             projectId
//         }


//     });
//     return socketInstance

// }
// export const receiveMessage = (eventName,cb)=>{

// }
// export const sendMessage = (eventName,cb)=>{

// }