import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Send, ShieldAlert } from 'lucide-react';

const Chat = () => {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Initialize socket
        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
        const newSocket = io(socketUrl);
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (socket && matchId) {
            socket.emit('join_match', matchId);

            socket.on('receive_message', (msg) => {
                setMessages((prev) => [...prev, msg]);
            });

            socket.on('alert_message', (alertData) => {
                // Toast or simple alert logic for GuardianShield feedback
                alert(`GuardianShield ${alertData.type.toUpperCase()}: ${alertData.message}`);
            });
        }

        return () => {
            if (socket) {
                socket.off('receive_message');
                socket.off('alert_message');
            }
        };
    }, [socket, matchId]);

    useEffect(() => {
        fetchMessages();
    }, [matchId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`/chat/${matchId}/messages`);
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        socket.emit('send_message', {
            matchId,
            senderId: user._id,
            content: newMessage
        });

        setNewMessage('');
    };

    return (
        <div className="min-h-screen bg-[#0a0f1c] flex flex-col text-white">
            {/* Header */}
            <div className="bg-gray-900 border-b border-gray-800 p-4 flex items-center gap-4 sticky top-0 z-10">
                <button onClick={() => navigate('/home')} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h2 className="font-bold text-lg">Chat</h2>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Protected by GuardianShield
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMine = msg.senderId === user._id;
                    return (
                        <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-3 rounded-2xl ${isMine ? 'bg-primary-600 rounded-br-none' : 'bg-gray-800 rounded-bl-none'}`}>
                                <p className="text-sm">{msg.content}</p>
                                <span className="text-[10px] text-gray-300/60 mt-1 block">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-gray-900 border-t border-gray-800 p-4">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition"
                    />
                    <button
                        type="submit"
                        className="w-12 h-12 bg-primary-600 hover:bg-primary-500 rounded-full flex items-center justify-center transition shadow-lg shadow-primary-500/20"
                    >
                        <Send className="w-5 h-5 ml-1" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
