import { useState, useEffect, useRef } from "react";
import "./chatbox.css";
import io from "socket.io-client";
import { v4 as uuid4 } from "uuid";

const socket = io("http://localhost:3001");

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("receive_message", (message) => {
      console.log("Received message from server:", message);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          author: "assistant",
          text: message.message,
        },
      ]);
    });

    return () => socket.off("receive_message");
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    return () => socket.off("connect");
  }, []);

   const sessionIdRef = useRef(uuid4());

   useEffect(() => {
    if (socket.connected) {
        console.log("Already connected:", socket.id);
        socket.emit("register", socket.id); 
    }

    socket.on("connect", () => {
        console.log("Connected:", socket.id);
        socket.emit("register", socket.id);
    });

    return () => socket.off("connect");
}, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(sessionIdRef)
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      author: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    socket.emit("send_message", {
      message: input,
      sessionId: socket.id,
    });

    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="chatbox-shell">
      <div className="chatbox-card">
        <div className="chatbox-header">
          <div>
            <h1>Dialogflow Chat</h1>
            <p>Fast, friendly, and beautifully styled message interaction.</p>
          </div>
          <div className="chatbox-status">Online</div>
        </div>

        <div className="chatbox-messages" role="log" aria-live="polite">
          {messages.map(({ id, author, text }) => (
            <div
              key={id}
              className={`chatbox-message ${
                author === "user"
                  ? "chatbox-message-user"
                  : "chatbox-message-assistant"
              }`}
            >
              <div className="chatbox-avatar">
                {author === "user" ? "You" : "Bot"}
              </div>
              <div className="chatbox-bubble">
                <span>{text}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbox-input-area" onSubmit={handleSubmit}>
          <label htmlFor="chat-input" className="visually-hidden">
            Type your message
          </label>
          <input
            id="chat-input"
            className="chatbox-input"
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button type="submit" className="chatbox-send-button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatBox;
