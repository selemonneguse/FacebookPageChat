import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatBox from "./ChatBox";
import MessageInput from "./MessageInput";

function Chat() {
  const [messages, setMessages] = useState([]);
  
    const navigate = useNavigate();

  // check if there is a session
  useEffect(() => {
    fetch("https://localhost:8443/chat/facebook/check-session", {
      method: "GET",
      credentials: "include", 
    })
      .then(async res => {
        if (!res.ok) { 
          // No session → go back to login page
          navigate("/");
        }
      })
      .catch(err => {
        console.error("Error checking session:", err);
        navigate("/"); // On error, also go back to login
      });
  }, [navigate]);

  return (
    <div className="container-fluid bg-dark text-light vh-100 d-flex flex-column justify-content-end align-items-center p-3">
      <h1>What would you like to share today?</h1>
      <ChatBox messages={messages} />
      <MessageInput messages={messages} setMessages={setMessages} />
    </div>
  );
}

export default Chat;
