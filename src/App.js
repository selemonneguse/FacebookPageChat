import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useRef, useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([]); // Chat messages state
  const [input, setInput] = useState(""); // User input state
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false); // Prevents multiple requests

  // Function to get OpenAI response
  const getOpenAIResponse = async (messagesToSend) => {
    try {
      console.log("messages = ", messagesToSend);

      const response = await fetch("http://localhost:3000/chat", { // Adjust the port if needed
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messagesToSend }),
      });
      const data = await response.json();

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, { role: "model", parts: data.reply }];
        return updatedMessages;
      });
  
      setIsLoading(false); // Re-enable input after response
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  // Function to send user message
  const sendMessage = () => {
    if (input.trim() === "" || isLoading) return; // Prevent empty or multiple rapid messages

    setIsLoading(true); // Disable input while processing

    // Update messages state correctly
    const updatedMessages = [...messages, { role: "user", parts: input }];
    setMessages(updatedMessages);

    setInput(""); // Clear input

    // Convert to the format Gemini expects
    const formattedMessages = updatedMessages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.parts }]
    }));

    getOpenAIResponse(formattedMessages);
  };

  //Auto-scroll chat to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="container-fluid bg-dark text-light vh-100 d-flex flex-column justify-content-end align-items-center p-3">
      {/* Chat Box */}
      <div className="w-50 p-3 rounded overflow-auto bg-secondary d-flex flex-column" style={{ height: "70vh" }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-2 rounded text-light ${msg.role === "user" ? "bg-success align-self-end" : "bg-dark align-self-start"}`}
            style={{ maxWidth: "75%" }}
          >
            {msg.parts}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Area */}
      <div className="d-flex w-50 mt-3">
        <input
          type="text"
          className="form-control bg-dark text-light border-secondary"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading} // Disable input while loading
        />
        <button className="btn btn-success ms-2" onClick={sendMessage} disabled={isLoading}>
          {isLoading ? "Loading..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;
