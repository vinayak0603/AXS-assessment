import React, { useState } from 'react';
import { Button, Input } from './ui';

const JoinScreen = ({ onJoin, error }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('Customer');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onJoin({ name, role });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all hover:scale-[1.01]">
                <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Voice Chat</h1>
                <p className="text-center text-gray-500 mb-8">Connect with an agent instantly</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name..."
                            className="bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole('Customer')}
                                className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2
                  ${role === 'Customer'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-blue-200 text-gray-600'
                                    }`}
                            >
                                <span className="text-2xl">👤</span>
                                <span className="font-semibold">Customer</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('Agent')}
                                className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2
                  ${role === 'Agent'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-blue-200 text-gray-600'
                                    }`}
                            >
                                <span className="text-2xl">🎧</span>
                                <span className="font-semibold">Agent</span>
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
                            {error}
                        </div>
                    )}
                    <Button type="submit" className="w-full text-lg py-3 rounded-xl">
                        Join Platform
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default JoinScreen;
