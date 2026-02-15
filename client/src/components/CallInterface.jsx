import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui';

const CallInterface = ({
    leaveCall,
    toggleAudio,
    isMuted,
    toggleVideo,
    isVideoOff,
    children, // The Video Grid
    ChatComponent, // The Chat Component
    roomName
}) => {
    const [isLeaving, setIsLeaving] = useState(false);
    const [timeLeft, setTimeLeft] = useState(3);
    const timerRef = useRef(null);
    const [showChatMobile, setShowChatMobile] = useState(false);

    const handleLeaveClick = () => {
        setIsLeaving(true);
        setTimeLeft(3);

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setIsLeaving(false); // Reset state just in case
                    leaveCall(); // Trigger actual leave
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleUndoLeave = () => {
        clearInterval(timerRef.current);
        setIsLeaving(false);
        setTimeLeft(3);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    return (
        <div className="flex flex-col h-screen bg-gray-900 overflow-hidden">
            {/* Header/Top Bar */}
            <div className="bg-gray-800 p-4 shadow-md flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <h1 className="text-white font-semibold text-lg">Room: {roomName}</h1>
                </div>
                <div className="md:hidden">
                    <Button
                        variant="ghost"
                        onClick={() => setShowChatMobile(!showChatMobile)}
                        className="text-white"
                    >
                        {showChatMobile ? 'Show Video' : 'Show Chat'}
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Undo Overlay */}
                {isLeaving && (
                    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
                        <div className="bg-white p-6 rounded-2xl shadow-2xl text-center max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-300">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Ending Meeting...</h3>
                            <div className="text-4xl font-black text-red-500 mb-4">{timeLeft}</div>
                            <p className="text-gray-500 mb-6 text-sm">You are leaving the call.</p>
                            <button
                                onClick={handleUndoLeave}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <span>↩️</span> Undo
                            </button>
                        </div>
                    </div>
                )}

                {/* Left Panel: Video Grid */}
                <div className={`flex-1 flex flex-col relative ${showChatMobile ? 'hidden md:flex' : 'flex'}`}>
                    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                        {children}
                    </div>

                    {/* Controls Bar (Floating) */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-gray-800/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-2xl z-20">
                        <button
                            onClick={toggleAudio}
                            className={`p-4 rounded-full transition-all duration-200 ${isMuted ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? '🔇' : '🎤'}
                        </button>
                        <button
                            onClick={toggleVideo}
                            className={`p-4 rounded-full transition-all duration-200 ${isVideoOff ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                            title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
                        >
                            {isVideoOff ? '📷' : '📹'}
                        </button>
                        <button
                            onClick={handleLeaveClick}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/30 hover:scale-105"
                        >
                            End Call
                        </button>
                    </div>
                </div>

                {/* Right Panel: Chat */}
                <div className={`w-full md:w-80 lg:w-96 bg-white border-l border-gray-100 shadow-xl z-20 flex-col ${showChatMobile ? 'flex' : 'hidden md:flex'}`}>
                    {ChatComponent}
                </div>
            </div>
        </div>
    );
};

export default CallInterface;
