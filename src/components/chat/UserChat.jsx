import React, { useState, useEffect } from "react";
import { Send, Search } from "lucide-react";
import axios from "axios";
import { baseURL } from "../service/baseURL";
import { io } from "socket.io-client";
import {useAuth} from '../../context/AuthContext'
import { useParams } from "react-router-dom";

const UserChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [socket, setSocket] = useState(null);
  const {userId} = useAuth();
  const {doctorId} = useParams();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`${baseURL}/doctor/getDoctorById/${doctorId}`);
        
        if (response.data.doctor) {
          const doctor = response.data.doctor;
          setDoctors([doctor]);

          if (doctorId && doctor) {
            setActiveChat(doctor);
          }
        } else {
          console.error("Invalid doctor data:", response.data);
          setDoctors([]);
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
        setDoctors([]);
      }
    };
    
    fetchDoctor();
  }, [doctorId]);

  useEffect(() => {
    if (activeChat) {
      const newSocket = io("http:
      console.log("WebSocket connection started");

      newSocket.emit("startChat", { userId: userId });

      newSocket.on("receiveMessage", (message) => {

        const formattedMessage = {
          text: message.message || message.text,
          sender: message.senderId === userId ? "user" : "doctor",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        
        setMessages((prevMessages) => [...prevMessages, formattedMessage]);
      });

      setSocket(newSocket);

      const fetchChatHistory = async () => {
        try {
          const chatId = activeChat._id || activeChat.id;
          const response = await axios.get(`${baseURL}/chat/history/${userId}/${chatId}`);

          const formattedHistory = response.data.map(msg => ({
            text: msg.message || msg.text,
            sender: msg.senderId === userId ? "user" : "doctor",
            time: new Date(msg.timestamp || msg.createdAt || Date.now())
              .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }));
          
          setMessages(formattedHistory);
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      };

      fetchChatHistory();

      return () => newSocket.disconnect();
    }
  }, [activeChat, userId]);

  const sendMessage = () => {
    if (!input.trim() || !activeChat || !socket) return;

    const message = {
      senderId: userId,
      receiverId: activeChat._id || activeChat.id,
      message: input,
    };
    console.log("Message being sent:", message);

    socket.emit("sendMessage", message);

    setMessages([
      ...messages,
      { text: input, sender: "user", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setInput("");
  };

  const filteredDoctors = doctors.filter((doctor) => 
    doctor.name && doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100 p-4 max-w-6xl mx-auto shadow-lg rounded-lg overflow-hidden">
      {}
      <div className="w-1/3 bg-white shadow-md rounded-lg overflow-hidden mr-4 flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search size={16} className="text-gray-500 absolute left-3 top-3" />
            <input
              type="text"
              className="w-full pl-10 p-2 rounded-lg border border-gray-300"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {}
        <div className="overflow-y-auto flex-grow p-3">
          <h2 className="text-sm font-semibold mb-3 text-gray-500 px-2">DOCTORS</h2>
          <ul className="space-y-2">
            {filteredDoctors.map((doctor, index) => (
              <li
                key={doctor._id || doctor.id || index}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  activeChat?._id === doctor._id || activeChat?.id === doctor.id 
                    ? "bg-blue-100" 
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  console.log("Setting active doctor:", doctor);
                  setActiveChat(doctor);
                }}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full mr-3">
                    {doctor.name && doctor.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{doctor.name}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {}
      <div className="flex flex-col flex-grow rounded-lg overflow-hidden bg-white shadow-md">
        <div className="bg-blue-600 text-white p-3 flex items-center shadow-sm">
          {activeChat ? (
            <h2 className="font-semibold">Chat with Dr. {activeChat.name}</h2>
          ) : (
            <h2 className="font-semibold">Select a doctor to start chatting</h2>
          )}
        </div>

        {}
        <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              {msg.sender !== "user" && (
                <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full mr-2 mb-1">
                  {activeChat?.name?.charAt(0).toUpperCase() || "D"}
                </div>
              )}
              <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                <p className="break-words">{msg.text}</p>
                <span className="text-xs block text-right mt-1">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        {}
        <div className="p-3 bg-white border-t">
          <div className="flex items-center">
            <input
              type="text"
              className="flex-grow p-3 rounded-full border border-gray-300"
              placeholder={activeChat ? "Type a message..." : "Select a doctor to start chatting"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={!activeChat}
            />
            <button
              onClick={sendMessage}
              className="ml-2 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300"
              disabled={!input.trim() || !activeChat}
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