import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { sendChatMessage } from '../services/socketService';

const Chat = () => {
  const [message, setMessage] = useState('');
  const { messages } = useSelector((state) => state.chat);
  const { name } = useSelector((state) => state.user);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendChatMessage({ sender: name, message });
      setMessage('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-96">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Chat</h2>
      <div className="flex-grow overflow-y-auto mb-4 pr-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-4 ${msg.sender === name ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${msg.sender === name ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              <div className="text-sm font-bold">{msg.sender}</div>
              <div>{msg.message}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage}>
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;