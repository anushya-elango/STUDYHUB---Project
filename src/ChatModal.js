import React, { useState, useEffect, useRef } from 'react';

function ChatModal({ mentor, userProfile, onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, text: `Hi ${userProfile.name}! I'm ${mentor.name}. Excited to help you learn ${userProfile.learnGoals?.join(', ')}! 🎉`, sender: 'mentor', time: 'Just now' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    if (e.key === 'Enter' && newMessage.trim()) {
      const userMsg = { 
        id: Date.now(), 
        text: newMessage, 
        sender: 'user', 
        time: 'Just now' 
      };
      setMessages([...messages, userMsg]);
      setNewMessage('');

      // Auto-reply from mentor after 2 seconds
      setTimeout(() => {
        const mentorReply = { 
          id: Date.now() + 1, 
          text: `Great question ${userProfile.name}! Let me explain ${newMessage.toLowerCase().includes('python') ? 'Python' : 'that topic'}. When do you want to schedule our first session? 📅`, 
          sender: 'mentor', 
          time: 'Just now' 
        };
        setMessages(prev => [...prev, mentorReply]);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        
        {/* Chat Header */}
        <div className="p-6 border-b border-gray-200 rounded-t-3xl bg-gradient-to-r from-emerald-500 to-green-600 text-white">
          <div className="flex items-center gap-4">
            <img src={mentor.avatar} alt={mentor.name} className="w-12 h-12 rounded-2xl" />
            <div>
              <h2 className="text-2xl font-bold">{mentor.name}</h2>
              <p className="text-sm opacity-90">Online • Expert in {mentor.skills.join(', ')}</p>
            </div>
            <button onClick={onClose} className="ml-auto text-white hover:text-gray-200">
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow ${
                msg.sender === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}>
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={sendMessage}
              placeholder="Type your message... (Press Enter to send)"
              className="flex-1 p-4 border-2 border-gray-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500 resize-none"
            />
            <button 
              onClick={() => sendMessage({ key: 'Enter' })}
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-3xl font-bold hover:from-emerald-600 hover:to-green-700 shadow-xl disabled:opacity-50"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            💬 Start chatting with your mentor!
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatModal;
