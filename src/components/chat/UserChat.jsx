import React, { useState, useEffect, useRef } from "react";
import { Send, Search } from "lucide-react";
import axios from "axios";
import { baseURL } from "../service/baseURL";

const UserChat = () => {
  const [messages, setMessages] = useState([
  ]);

  const [input, setInput] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [ws, setWs] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch doctors data on component mount
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${baseURL}/doctor/getAllDoctors`); // Replace with your API endpoint
        // Check if the response data is an array before setting it
        if (Array.isArray(response.data.doctors)) {
          setDoctors(response.data.doctors);
        } else {
          console.error("Doctors response is not an array", response.data);
          setDoctors([]); // Default to empty array if it's not an array
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        setDoctors([]); // Default to empty array in case of error
      }
    };
  
    fetchDoctors();
  }, []);
  

  useEffect(() => {
    // WebSocket connection when chat is active
    if (activeChat) {
      const socket = new WebSocket(`ws://localhost:3001/socket/${activeChat}`);
      
      socket.onopen = () => {
        console.log('WebSocket connection established');
      };

      socket.onmessage = (event) => {
        const receivedMessage = JSON.parse(event.data);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: receivedMessage.text,
            sender: "doctor",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            recipient: activeChat,
          },
        ]);
      };

      setWs(socket); // Save WebSocket reference to state

      return () => {
        socket.close();
      };
    }
  }, [activeChat]);

  const sendMessage = (recipient) => {
    if (input.trim() === "" || !activeChat || !ws) return;

    const message = {
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      recipient: recipient,
      recipientId: activeChat,
    };

    // Send message via WebSocket
    ws.send(JSON.stringify(message));

    // Add message to the state for the UI
    setMessages([...messages, message]);
    setInput(""); // Reset input field
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startChat = (doctor) => {
    setActiveChat(doctor.id); // Use the doctor's ID to establish a chat with them
  };

  return (
    <div className="flex h-screen bg-gray-100 p-4 max-w-6xl mx-auto shadow-lg rounded-lg overflow-hidden">
      {/* Doctor List Sidebar */}
      <div className="w-1/3 bg-white shadow-md rounded-lg overflow-hidden mr-4 flex flex-col">
        {/* Doctor Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search size={16} className="text-gray-500 absolute left-3 top-3" />
            <input
              type="text"
              className="w-full pl-10 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Doctor List */}
        <div className="overflow-y-auto flex-grow p-3">
          <h2 className="text-sm font-semibold mb-3 text-gray-500 px-2">DOCTORS</h2>
          <ul className="space-y-2">
            {filteredDoctors.map((doctor) => (
              <li
                key={doctor.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  activeChat === doctor.id ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
                onClick={() => startChat(doctor)}
              >
                <div className="relative">
                  <div
                    className={`w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full mr-3`}
                  >
                    {doctor.name.charAt(0)}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{doctor.name}</span>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col flex-grow rounded-lg overflow-hidden bg-white shadow-md">
        {/* Chat Header */}
        <div className="bg-blue-600 text-white p-3 flex items-center shadow-sm">
          {activeChat ? (
            <div>
              <h2 className="font-semibold">{activeChat}</h2>
              <p className="text-xs text-blue-200">Online</p>
            </div>
          ) : (
            <h2 className="font-semibold">Select a conversation</h2>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender !== "user" && (
                <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full mr-2 mb-1">
                  {msg.sender.charAt(0)}
                </div>
              )}

              <div
                className={`p-3 rounded-lg max-w-xs lg:max-w-md ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                <p className="break-words">{msg.text}</p>
                <span
                  className={`text-xs block text-right mt-1 ${
                    msg.sender === "user" ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-3 bg-white border-t">
          <div className="flex items-center">
            <input
              type="text"
              className="flex-grow p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder={activeChat ? "Type a message..." : "Select a doctor to start chatting"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(activeChat)}
              disabled={!activeChat}
            />
            <button
              onClick={() => sendMessage(activeChat)}
              className="ml-2 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={input.trim() === "" || !activeChat}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserChat;
