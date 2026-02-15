import React, { useEffect, useRef, useState } from 'react';
import { Button, Input } from './ui';

const Chat = ({ socket, room, name }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (data) => {
            // Deduplicate: If I sent it, I already added it manually.
            if (data.sender === name) return;
            setMessages((prev) => [...prev, data]);
        };

        socket.on('receive-message', handleReceiveMessage);

        return () => {
            socket.off('receive-message', handleReceiveMessage);
        };
    }, [socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && room) {
            const msgData = {
                message,
                sender: name,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            socket.emit('send-message', { ...msgData, to: room });
            setMessages((prev) => [...prev, msgData]);
            setMessage('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-4 bg-gray-50 border-b border-gray-100">
                <h3 className="font-semibold text-gray-700">Live Transcript</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex flex-col ${msg.sender === name ? 'items-end' : 'items-start'}`}
                    >
                        <div
                            className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${msg.sender === name
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                }`}
                        >
                            <p className="text-sm">{msg.message}</p>
                        </div>
                        <span className="text-xs text-gray-400 mt-1 px-1">
                            {msg.sender === name ? 'You' : msg.sender} • {msg.time}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-2">
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                    />
                    <Button type="submit" variant="primary" className="rounded-lg">
                        Send
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Chat;
