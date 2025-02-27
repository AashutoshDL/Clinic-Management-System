import React, { useState, useRef, useEffect } from "react";
import { Send, Search, UserPlus, Trash2 } from "lucide-react";

const UserChat = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you?", sender: "bot", time: "10:00 AM", recipient: null },
  ]);
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([
    { name: "Alice", status: "active" },
    { name: "Bob", status: "inactive" },
    { name: "Charlie", status: "active" },
    { name: "David", status: "active" },
    { name: "Eve", status: "inactive" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageRequests, setmessageRequests] = useState([
    { name: "Frank" },
    { name: "Grace" }
  ]);
  const [activeChat, setActiveChat] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (recipient) => {
    if (input.trim() === "") return;

    const newMessage = {
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      recipient: recipient,
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAcceptRequest = (user) => {
    setmessageRequests(messageRequests.filter(req => req.name !== user.name));
    setUsers([...users, user]);
  };

  const handleDeleteRequest = (user) => {
    setmessageRequests(messageRequests.filter(req => req.name !== user.name));
  };

  const startChat = (user) => {
    setActiveChat(user.name);
  };

  const filteredMessages = messages.filter(msg => {
    if (msg.recipient === null) return msg.sender === 'bot';
    return (msg.sender === "user" && msg.recipient === activeChat) ||
           (msg.sender !== "user" && msg.recipient === activeChat) ||
           (msg.sender !== "user" && msg.recipient === null);
  });

  return (
    <div className="flex h-screen bg-gray-100 p-4 max-w-5xl mx-auto shadow-lg rounded-lg overflow-hidden">
      {/* Message Request Section (Moved to the left) */}
      <div className="w-1/4 bg-white shadow-md rounded-lg p-4 overflow-y-auto mr-4">
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          Message Requests <UserPlus className="ml-2" />
        </h2>
        <ul>
          {messageRequests.map((request, index) => (
            <li key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-200">
              <span>{request.name}</span>
              <div>
                <button onClick={() => handleAcceptRequest(request)} className="text-green-500 hover:text-green-700 mr-2">Accept</button>
                <button onClick={() => handleDeleteRequest(request)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col flex-grow w-2/4">
        <div className="bg-blue-500 text-white p-4 rounded-t-lg shadow-md flex items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-500 font-bold mr-3">
            U
          </div>
          <h2 className="text-lg font-semibold">User Chat</h2>
        </div>
        <div className="flex-grow overflow-y-auto p-4 space-y-2 bg-white rounded-b-lg shadow relative">
          {filteredMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender !== "user" && (
                <div className="w-10 h-10 bg-gray-400 text-white flex items-center justify-center rounded-full mr-2">
                  B
                </div>
              )}
              <div
                className={`p-3 rounded-lg shadow-md text-white max-w-[70%] ${msg.sender === "user" ? "bg-blue-500" : "bg-gray-500"}`}
              >
                <p className="break-words">{msg.text}</p>
                <span className="text-xs opacity-70 block text-right">{msg.time}</span>
              </div>
              {msg.sender === "user" && (
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full ml-2">
                  U
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center p-2 bg-white mt-2 rounded-lg shadow-md">
          <input
            type="text"
            className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(activeChat)}
          />
          <button onClick={() => sendMessage(activeChat)} className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300" disabled={input.trim() === ""}>
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* User Section */}
      <div className="w-1/4 bg-white shadow-md rounded-lg p-4 ml-4 overflow-y-auto">
        <div className="flex items-center mb-3">
          <Search size={20} className="text-gray-500 mr-2" />
          <input
            type="text"
            className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <h2 className="text-lg font-semibold mb-3">Users</h2>
        <ul className="space-y-2">
          {filteredUsers.map((user, index) => (
            <li
              key={index}
              className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer"
              onClick={() => startChat(user)}
            >
              <div className={`w-10 h-10 ${user.status === "active" ? "bg-green-500" : "bg-gray-400"} text-white flex items-center justify-center rounded-full mr-2`}>
                {user.name.charAt(0)}
              </div>
              <span>{user.name}</span>
              <span className={`ml-2 text-sm ${user.status === "active" ? "text-green-500" : "text-gray-500"}`}>
                {user.status === "active" ? "Active" : "Offline"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserChat;