import React, { useState, useRef, useEffect } from "react";

function RagChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi 👋 I’m your Study AI Assistant. Ask me doubts, syllabus questions, or career guidance!",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.reply || "Sorry, I couldn't understand that." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
  role: "ai",
  text: data.reply?.trim() || "🤖 I didn’t get a response. Try again.",
},
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot fixed bottom-5 right-5 w-96 bg-gray-100 rounded-2xl shadow-xl flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-t-2xl flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">🤖 Study AI Assistant</h2>
          <p className="text-xs opacity-90">Powered by GenAI + RAG</p>
        </div>
        <button
          onClick={onClose}
          className="text-2xl hover:scale-110 transition"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 p-3 max-w-[80%] rounded-2xl text-sm ${
              msg.role === "user"
                ? "bg-blue-500 text-white ml-auto rounded-br-sm"
                : "bg-white text-gray-800 mr-auto rounded-bl-sm border"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="text-xs text-gray-500">AI is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask your study question..."
            className="flex-1 p-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={sendMessage}
            className="bg-purple-600 text-white px-4 rounded-full hover:bg-purple-700 transition"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default RagChatbot;
