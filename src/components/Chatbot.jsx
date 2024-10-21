import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from 'react-markdown'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY); 

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: "user", text: "Hello! How can I assist you today?" }, 
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async (userMessage) => {
    
    const chatHistory = messages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({ history: chatHistory });

    
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: userMessage },
    ]);

    try {
      
      const result = await chat.sendMessage(userMessage);
      const modelResponse = result.response.text();

      
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "model", text: modelResponse },
      ]);
    } catch (error) {
      console.error("Error sending message:", error); 
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput(""); 
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-xl">
        <div className="bg-white shadow-lg rounded-lg p-6 h-96 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-green-200 self-end text-right"
                  : "bg-blue-200 self-start"
              }`}
              
            >
              <Markdown>{message.text}</Markdown>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex mt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)} 
            className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
