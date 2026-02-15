import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button, Input } from '../components/ui';

const Home = () => {
    const navigate = useNavigate();
    const [joinRoomId, setJoinRoomId] = useState('');

    const createRoom = () => {
        const roomId = uuidv4();
        // Generate a simple 6-digit password
        const password = Math.random().toString(36).slice(-6).toUpperCase();
        // Redirect to room with password in state (so host knows it)
        navigate(`/room/${roomId}`, { state: { password, isHost: true } });
    };

    const joinRoom = (e) => {
        e.preventDefault();
        if (joinRoomId.trim()) {
            navigate(`/room/${joinRoomId}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Secure Video Chat</h1>
                <p className="text-center text-gray-500 mb-8">Create a room or join one securely.</p>

                <div className="space-y-6">
                    {/* Create Room Section */}
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                        <h2 className="font-semibold text-blue-900 mb-2">Start a New Meeting</h2>
                        <Button onClick={createRoom} className="w-full">
                            Create Instant Meeting
                        </Button>
                    </div>

                    <div className="relative flex items-center justify-center">
                        <div className="border-t border-gray-200 w-full"></div>
                        <span className="bg-white px-3 text-sm text-gray-400 absolute">OR</span>
                    </div>

                    {/* Join Room Section */}
                    <form onSubmit={joinRoom}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Join with Code</label>
                        <div className="flex gap-2">
                            <Input
                                value={joinRoomId}
                                onChange={(e) => setJoinRoomId(e.target.value)}
                                placeholder="Enter Room ID"
                                className="flex-1"
                            />
                            <Button type="submit" variant="outline">
                                Join
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Home;
