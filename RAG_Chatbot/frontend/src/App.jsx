import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import ReactMarkdown from "react-markdown";

const ROLI_CHOICES = ["Admin", "Engineering", "Finance", "HR", "Marketing", "General"];

export default function App() {
  const [authUser, setAuthUser] = useState(null); // { username: "", role: "" }
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const messagesEndRef = useRef(null);

  // Auth States
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authForm, setAuthForm] = useState({ username: "", password: "", role: "Engineering" });
  const [authError, setAuthError] = useState("");
  const [isAuthRoleDropdownOpen, setIsAuthRoleDropdownOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const savedUser = localStorage.getItem("fintechUser");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setAuthUser(parsed);
      setMessages([
        {
          sender: "bot",
          text: `Welcome back, ${parsed.username}. You are logged in as **${parsed.role}**. Ask me anything about the FinTech Technologies.`
        }
      ]);
    }
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    const endpoint = isLoginMode ? "/api/login" : "/api/signup";
    
    try {
      const res = await fetch(`http://127.0.0.1:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authForm)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setAuthError(data.error || "An error occurred");
      } else {
        const user = { username: data.username, role: data.role };
        setAuthUser(user);
        localStorage.setItem("fintechUser", JSON.stringify(user));
        setMessages([
          {
            sender: "bot",
            text: `Welcome to FinTechX, ${user.username}. You are authenticated as **${user.role}**. Ask me anything!`
          }
        ]);
      }
    } catch (err) {
      setAuthError("Could not connect to backend server.");
    }
  };

  const handleLogout = () => {
    setAuthUser(null);
    localStorage.removeItem("fintechUser");
    setMessages([]);
    setAuthForm({ username: "", password: "", role: "Engineering" });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !authUser) return;

    const newMessages = [...messages, { sender: "user", text: inputMessage }];
    setMessages(newMessages);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage,
          role: authUser.role
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
        { sender: "error", text: "Cannot connect to Backend Server." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isStarted && !authUser) {
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

  if (!authUser) {
    return (
      <div className="landing-container">
        <div className="landing-content">
          <img src="/logo.png" alt="FinTechX Logo" className="landing-logo" />
          <h1 className="landing-title">FinTechX</h1>
          <p className="landing-subtitle">Authenticate to access Organizational Intelligence</p>
          
          <form className="auth-form" onSubmit={handleAuthSubmit}>
            <h2>{isLoginMode ? "Login" : "Create Account"}</h2>
            {authError && <div className="auth-error">{authError}</div>}
            
            <input 
              type="text" 
              placeholder="Username" 
              value={authForm.username}
              onChange={e => setAuthForm({...authForm, username: e.target.value})}
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={authForm.password}
              onChange={e => setAuthForm({...authForm, password: e.target.value})}
              required
            />
            
            {!isLoginMode && (
              <div className="custom-dropdown" style={{ width: '100%', textAlign: 'left', position: 'relative' }}>
                <div
                  className="dropdown-selected"
                  style={{ padding: '12px', boxSizing: 'border-box' }}
                  onClick={() => setIsAuthRoleDropdownOpen(!isAuthRoleDropdownOpen)}
                >
                  {authForm.role}
                  <span className="dropdown-arrow">▼</span>
                </div>
                {isAuthRoleDropdownOpen && (
                  <div className="dropdown-options" style={{ top: '100%', left: 0, right: 0, marginTop: '5px' }}>
                    {ROLI_CHOICES.map((r) => (
                      <div
                        key={r}
                        className={`dropdown-option ${r === authForm.role ? "active" : ""}`}
                        onClick={() => {
                          setAuthForm({...authForm, role: r});
                          setIsAuthRoleDropdownOpen(false);
                        }}
                      >
                        {r}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <button type="submit" className="auth-submit-btn">
              {isLoginMode ? "Sign In" : "Sign Up"}
            </button>
            
            <p className="auth-toggle" onClick={() => {setIsLoginMode(!isLoginMode); setAuthError("");}}>
              {isLoginMode ? "Need an account? Sign up" : "Already have an account? Log in"}
            </p>
          </form>
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
          <div className="user-info">
            <span className="logged-user">{authUser.username}</span>
            <span className="logged-role">Role: {authUser.role}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
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
          placeholder={`Ask a question as ${authUser.role}...`}
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
