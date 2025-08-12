import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function MessageInput({ messages, setMessages}) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleImageSelectAndUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      console.log("file: ", file);
      setImageFile(file);
      
    };
    input.click();
    
  };

  const sendMessage = async () => {

    if(imageFile){
      const formData = new FormData();
      formData.append("image", imageFile);

      try {
        
        const response = await fetch("https://localhost:8443/chat/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const data = await response.json();
        console.log("Response from server:", data);
        setImageFile(null);
        const newMessage =
          "Image Upload successful with post message: " + data.reply.message;
        const updatedMessages = [
          ...messages,
          { role: "model", parts: newMessage },
        ];
        setMessages(updatedMessages);
      } catch (error) {
        console.error("Upload error:", error);
        navigate('/');
      }
    }

    if (input.trim() === "" || isLoading) return;

    setIsLoading(true);
    const updatedMessages = [...messages, { role: "user", parts: input }];
    setMessages(updatedMessages);
    setInput("");

    const formattedMessages = updatedMessages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.parts }],
    }));

    try {
      const response = await fetch("https://localhost:8443/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ messages: formattedMessages }),
      });

      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "model", parts: data.reply },
      ]);
      
    } catch (error) {
      console.error("Error:", error);
      navigate('/');
    }

    setIsLoading(false);

  };

  return (
    <div className="d-flex w-50 mt-3">
      
      <input
        type="text"
        className="form-control bg-dark text-light border-secondary"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        disabled={isLoading}
      />

      {imageFile ?    
        <button className="btn btn-danger" onClick={() => setImageFile(null)}>
          {"delete image"}
        </button> : 
        <button className="btn btn-info" onClick={handleImageSelectAndUpload}>
          {"Choose image"}
        </button>
      }
      <button className="btn btn-success ms-2" onClick={sendMessage} disabled={isLoading}>
        {isLoading ? "Loading..." : "Send"}
      </button>
    </div>
  );
}

export default MessageInput;
