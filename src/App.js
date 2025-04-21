import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import ChatBox from "./components/ChatBox";
import MessageInput from "./components/MessageInput";
import ImageUploader from "./components/ImageUploader";

function App() {
  const [messages, setMessages] = useState([]);

  return (
    <div className="container-fluid bg-dark text-light vh-100 d-flex flex-column justify-content-end align-items-center p-3">
      <ChatBox messages={messages} />
      <MessageInput messages={messages} setMessages={setMessages} />
      <ImageUploader />
    </div>
  );
}

export default App;
