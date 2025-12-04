import { useState,useEffect } from "react";
import { sendMessage } from "../config/socket";


export function useChat(projectId,user,OnAimessage){
   
      const [message, setMessage] = useState("");
        const [messages, setMessages] = useState([]); // New state variable for messages
      

        const send = () => {
      if (!message.trim()) return;

      const outgoing = {
        message,
        sender:{
        _id:user._id,
        email:user.email,
      }};

      setMessages((pre)=>[...pre,outgoing])
    sendMessage("project-message", {message});
    // setMessages((prevMessages) => [...prevMessages, { sender: user, message }]); // Update messages state
    setMessage("");
  };






    
   
   
   
   
   
   
   
   
    return {
      send,
    messages,
    setMessages,
    message,
    setMessage,
    // send will be added here
  };

}