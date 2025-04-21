import { useRef, useEffect } from "react";

function ChatBox({ messages }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
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
  );
}

export default ChatBox;
