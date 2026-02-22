import React, { useState, useEffect, useRef } from 'react';
import useChat from '../../hooks/useChat';
import { X, Send } from 'lucide-react'; // Make sure lucide-react is installed

/**
 * ChatBox Component
 * 
 * @param {Object} props
 * @param {number} props.currentUserId - The logged in user's ID
 * @param {Object} props.peer - The user object they are chatting with { id, name, avatar }
 * @param {number} props.sessionId - The ID of the session
 * @param {Function} props.onClose - Function to close the chat modal
 */
const ChatBox = ({ currentUserId, peer, sessionId, onClose }) => {
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);

    // 1. Initialize our custom WebSocket hook
    const { messages, sendMessage, isConnected } = useChat(currentUserId, peer.id, sessionId);

    // 2. Auto-scroll to the bottom when a new message arrives
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 3. Handle sending a message
    const handleSend = (e) => {
        e.preventDefault();
        if (inputValue.trim() === "") return;

        // Pass the text to our hook to send via WebSocket
        sendMessage(inputValue);

        // Clear the input field
        setInputValue("");
    };

    if (!peer) return null;

    return (
        <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50 overflow-hidden h-[500px]">
            {/* Header */}
            <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-300 flex items-center justify-center text-indigo-800 font-bold overflow-hidden">
                        {peer.avatar ? (
                            <img src={peer.avatar} alt={peer.name} className="w-full h-full object-cover" />
                        ) : (
                            peer.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">{peer.name}</h3>
                        <p className="text-xs text-indigo-200">
                            {isConnected ? "Live Chat" : "Connecting..."}
                        </p>
                    </div>
                </div>
                <button onClick={onClose} className="text-indigo-200 hover:text-white transition">
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col space-y-3 relative">
                {!isConnected && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
                        <span className="text-sm text-gray-500 loading-pulse">Connecting to server...</span>
                    </div>
                )}

                {messages.length === 0 ? (
                    <div className="m-auto text-center text-gray-400 text-sm">
                        <p>No messages yet.</p>
                        <p>Say hi to start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderId === currentUserId;

                        // Formatting the timestamp to make it readable
                        const timeString = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                        return (
                            <div key={msg.id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                        }`}
                                >
                                    <p>{msg.content}</p>
                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                                        {timeString}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                {/* Invisible div to target for auto-scrolling */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-200">
                <form onSubmit={handleSend} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message..."
                        disabled={!isConnected}
                        className="flex-1 bg-gray-100 text-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!isConnected || inputValue.trim() === ""}
                        className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex-shrink-0"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatBox;
