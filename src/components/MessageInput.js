import { useState } from "react";

function MessageInput({ messages, setMessages }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
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
      <button className="btn btn-success ms-2" onClick={sendMessage} disabled={isLoading}>
        {isLoading ? "Loading..." : "Send"}
      </button>
    </div>
  );
}

export default MessageInput;
