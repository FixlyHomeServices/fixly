import React, { useState } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [options, setOptions] = useState([
    "Select a service",
    "Ask about refund policy",
    "How to book a service?",
    "Contact support",
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);

    if (!hasGreeted) {
      setMessages([
        { sender: "bot", text: "Hi! Welcome to Fixly. 😊 How can I help you today?" }
      ]);
      setHasGreeted(true);
    }
  };

  const sendMessage = async (message) => {
    if (!message.trim()) return; // Prevent empty messages

    setMessages((prev) => [...prev, { sender: "user", text: message }]);
    setInput(""); // Clear input field

    const response = await fetch("http://localhost:5001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);

    if (data.options.length > 0) {
      setOptions(data.options);
    } else {
      setOptions([]);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage(input);
    }
  };

  return (
    <div>
      {/* Chatbot Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        💬 Chat
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-16 right-5 w-80 bg-white border border-gray-300 shadow-xl rounded-lg">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between">
            <span>Fixly Chat</span>
            <button onClick={toggleChat} className="text-lg">✖</button>
          </div>

          {/* Messages */}
          <div className="p-3 h-64 overflow-y-auto flex flex-col space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-gray-900 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Options */}
          <div className="p-3 border-t">
            {options.length > 0 &&
              options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(option)}
                  className="block w-full text-left p-2 mb-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
                >
                  {option}
                </button>
              ))}
          </div>

          {/* Input Field */}
          <div className="p-3 border-t flex">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown} // Listen for Enter key
              className="flex-1 px-2 py-1 border rounded-md focus:outline-none"
            />
            <button
              onClick={() => sendMessage(input)}
              className="ml-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
