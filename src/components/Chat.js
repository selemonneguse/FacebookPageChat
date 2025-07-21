import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import ChatBox from "./ChatBox";
import MessageInput from "./MessageInput";
import ImageUploader from "./ImageUploader";

function Chat() {
  const [messages, setMessages] = useState([]);

  return (
    <div className="container-fluid bg-dark text-light vh-100 d-flex flex-column justify-content-end align-items-center p-3">
      <ChatBox messages={messages} />
      <MessageInput messages={messages} setMessages={setMessages} />
      <ImageUploader messages={messages} setMessages={setMessages} />
    </div>
  );
}

export default Chat;
