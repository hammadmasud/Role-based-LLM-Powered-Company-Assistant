import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import ReactMarkdown from "react-markdown";

const ROLI_CHOICES = ["Admin", "Engineering", "Finance", "HR", "Marketing"];

export default function App() {
  const [role, setRole] = useState("Engineering");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Welcome to FinTechX. Please select your role above and ask me anything about the FinTech Technologies"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to UI
    const newMessages = [...messages, { sender: "user", text: inputMessage }];
    setMessages(newMessages);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: inputMessage,
          role: role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          { sender: "error", text: data.error || "An error occurred fetching response." }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.response }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "error", text: "Cannot connect to Backend Server. Please make sure Flask is running on port 5000." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isStarted) {
    return (
      <div className="landing-container">
        <div className="landing-content">
          <img src="/logo.png" alt="FinTechX Logo" className="landing-logo" />
          <h1 className="landing-title">FinTechX</h1>
          <p className="landing-subtitle">
            Your Organizational Intelligence & Technical Assistant
          </p>
          <button className="get-started-btn" onClick={() => setIsStarted(true)}>
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-title">
          <img src="/logo.png" alt="AI Agent Logo" className="logo" />
          <h1>FinTechX</h1>
        </div>
        <div className="role-selector">
          <label>Simulation Role: </label>
          <div className="custom-dropdown">
            <div
              className="dropdown-selected"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            >
              {role}
              <span className="dropdown-arrow">▼</span>
            </div>
            {isRoleDropdownOpen && (
              <div className="dropdown-options">
                {ROLI_CHOICES.map((r) => (
                  <div
                    key={r}
                    className={`dropdown-option ${r === role ? "active" : ""}`}
                    onClick={() => {
                      setRole(r);
                      setIsRoleDropdownOpen(false);
                    }}
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="chat-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.sender}`}>
            <div className="message-bubble">
              {msg.sender === "bot" ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message-wrapper bot">
            <div className="message-bubble typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder={`Ask a question as ${role}...`}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage} disabled={isTyping || !inputMessage.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
