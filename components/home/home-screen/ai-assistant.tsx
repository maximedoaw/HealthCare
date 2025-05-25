"use client"

import { Sparkles, Send } from "lucide-react";
import { useState } from "react";

export function AIAssistant() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI medical assistant. How can I help you today?",
      sender: "ai",
    },
  ]);
  
  const handleSend = () => {
    if (message.trim() === "") return;
    
    // Add user message
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      text: message,
      sender: "user",
    }]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "I can help analyze patient data or suggest treatments. Could you provide more details?",
        sender: "ai",
      }]);
    }, 1000);
    
    setMessage("");
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center mb-4">
        <div className="bg-purple-100 p-2 rounded-lg mr-3">
          <Sparkles className="h-5 w-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold">AI Medical Assistant</h2>
      </div>
      
      <div className="h-64 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${msg.sender === "user" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-100 text-gray-800"}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about patient data or treatment options..."
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg flex items-center justify-center"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}