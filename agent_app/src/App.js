import { useState, useRef, useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([
    { sender: "agent", text: "Hello! Ask me anything about visas." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input) return;

    setMessages(prev => [...prev, { sender: "user", text: input }]);
    const question = input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:9000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { sender: "agent", text: data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: "agent", text: "Oops! Something went wrong." }]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(180deg, #f0f0f5, #d9d9e6)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
      padding: "20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: "30px",
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(255,255,255,0.25)",
        border: "1px solid rgba(255,255,255,0.3)",
        boxShadow: "0 12px 36px rgba(0,0,0,0.12)"
      }}>
        {/* Chat Messages */}
        <div style={{
          flex: 1,
          padding: "15px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              maxWidth: "80%",
              padding: "12px 18px",
              borderRadius: "22px",
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#007aff" : "rgba(255,255,255,0.5)",
              color: msg.sender === "user" ? "#fff" : "#000",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              backdropFilter: msg.sender === "user" ? "none" : "blur(12px)",
              transition: "all 0.2s ease"
            }}>
              {msg.text}
            </div>
          ))}

          {/* Typing animation */}
          {loading && (
            <div style={{
              maxWidth: "60px",
              padding: "12px",
              borderRadius: "20px",
              alignSelf: "flex-start",
              backgroundColor: "rgba(255,255,255,0.5)",
              display: "flex",
              gap: "5px",
              justifyContent: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              backdropFilter: "blur(12px)"
            }}>
              <span className="dot" style={{
                width: "8px", height: "8px", backgroundColor: "#333",
                borderRadius: "50%", animation: "bounce 1s infinite alternate"
              }} />
              <span className="dot" style={{
                width: "8px", height: "8px", backgroundColor: "#333",
                borderRadius: "50%", animation: "bounce 1s infinite 0.2s alternate"
              }} />
              <span className="dot" style={{
                width: "8px", height: "8px", backgroundColor: "#333",
                borderRadius: "50%", animation: "bounce 1s infinite 0.4s alternate"
              }} />
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>

        {/* Input */}
        <div style={{
          display: "flex",
          padding: "12px",
          borderTop: "1px solid rgba(255,255,255,0.3)",
          backdropFilter: "blur(15px)",
          backgroundColor: "rgba(255,255,255,0.25)"
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask your question..."
            style={{
              flex: 1,
              padding: "12px 18px",
              borderRadius: "25px",
              border: "1px solid rgba(0,0,0,0.1)",
              outline: "none",
              fontSize: "14px",
              backgroundColor: "rgba(255,255,255,0.3)",
              marginRight: "10px"
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              padding: "12px 20px",
              borderRadius: "25px",
              border: "none",
              backgroundColor: "#007aff",
              color: "#fff",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              transition: "all 0.2s ease"
            }}
          >
            Send
          </button>
        </div>
      </div>

      {/* Keyframes for typing animation */}
      <style>{`
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

export default App;
