function MessageInput({ input, setInput, sendMessage, isLoading }) {
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