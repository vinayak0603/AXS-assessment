import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'peerjs';
import CallInterface from '../components/CallInterface';
import Chat from '../components/Chat';
import JoinScreen from '../components/JoinScreen';

const Video = ({ stream, muted = false, label, isLocal = false }) => {
    const ref = useRef();
    useEffect(() => {
        if (ref.current && stream) {
            ref.current.srcObject = stream;
            ref.current.onloadedmetadata = () => {
                ref.current.play().catch(e => console.error("Error playing video:", e));
            };
        }
    }, [stream]);
    return (
        <div className="relative bg-black rounded-xl overflow-hidden aspect-video shadow-lg border border-gray-800">
            <video
                ref={ref}
                muted={muted}
                className={`w-full h-full object-cover ${isLocal ? 'scale-x-[-1]' : ''}`} // Mirror local video
                autoPlay
                playsInline
            />
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium">
                {label} {isLocal && '(You)'}
            </div>
        </div>
    );
};

const Room = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // State for local user identity
    // Ensure we only set user if they have a name (i.e. joined via JoinScreen or passed correctly)
    const [user, setUser] = useState(location.state?.name ? location.state : null); // { name, role }

    const [streams, setStreams] = useState([]);
    const [peersData, setPeersData] = useState({}); // { userId: { name, role } }
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [error, setError] = useState('');

    const peersRef = useRef({});
    const socketRef = useRef();
    const myStreamRef = useRef();
    const myPeerRef = useRef();

    // Helper to format name based on role
    const formatName = (name, role) => {
        return role === 'Agent' ? `${name} (Agent)` : name;
    };

    // Helper to ensure unique streams
    const addStream = (id, stream, muted, userName) => {
        setStreams(prev => {
            if (prev.some(s => s.id === id)) return prev;
            return [...prev, { id, stream, muted, userName }];
        });
    };

    const handleJoin = (userData) => {
        setUser(userData);
    };

    useEffect(() => {
        if (!user) return; // Wait for user to join via JoinScreen

        const hostname = window.location.hostname;
        // 1. Setup Socket
        const socket = io(`http://${hostname}:5000`);
        socketRef.current = socket;

        // 2. Setup Peer
        const myPeer = new Peer(undefined, {
            host: hostname,
            port: 5000,
            path: '/peerjs'
        });
        myPeerRef.current = myPeer;

        myPeer.on('open', id => {
            // Emit join-room with user metadata
            socket.emit('join-room', roomId, id, user);
        });

        // Handle Room Full
        socket.on('room-full', () => {
            alert('Room is full! You cannot join this meeting.');
            navigate('/');
        });

        // Handle Meeting Ended (when other user leaves)
        socket.on('meeting-ended', () => {
            alert('The other user has left the meeting. The call will now end.');
            navigate('/');
        });

        // Handle existing users (received upon joining)
        socket.on('all-users', (users) => {
            const data = {};
            users.forEach(u => {
                data[u.id] = { name: u.name, role: u.role };
            });
            setPeersData(prev => ({ ...prev, ...data }));
        });

        // 3. Get Media
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            myStreamRef.current = stream;
            addStream('me', stream, true, formatName(user.name, user.role));

            // Answer incoming calls
            myPeer.on('call', call => {
                call.answer(stream);
                call.on('stream', userVideoStream => {
                    // We might not have the name yet, but it will update via state later or we check peersData
                    const peerId = call.peer;
                    // We rely on peersData to get the name, render will pick it up
                    addStream(peerId, userVideoStream, false, 'User');
                });
            });

            // User Connected -> Call them
            socket.on('user-connected', (userId, userData) => {
                // Store their metadata
                setPeersData(prev => ({ ...prev, [userId]: userData }));

                connectToNewUser(userId, stream, myPeer);
            });
        });

        // Cleanup disconnected users
        socket.on('user-disconnected', userId => {
            if (peersRef.current[userId]) peersRef.current[userId].close();
            setStreams(prev => prev.filter(s => s.id !== userId));
            setPeersData(prev => {
                const newOne = { ...prev };
                delete newOne[userId];
                return newOne;
            });
            delete peersRef.current[userId];
        });

        return () => {
            socket.disconnect();
            myPeer.destroy();
            if (myStreamRef.current) {
                myStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [roomId, user, navigate]); // Depend on 'user' so this runs after join

    function connectToNewUser(userId, stream, myPeer) {
        // Optimization: wrap in timeout to allow peer to be ready
        setTimeout(() => {
            const call = myPeer.call(userId, stream);
            if (!call) return;

            call.on('stream', userVideoStream => {
                addStream(userId, userVideoStream, false, 'User');
            });

            call.on('close', () => {
                setStreams(prev => prev.filter(s => s.id !== userId));
            });

            peersRef.current[userId] = call;
        }, 1000);
    }

    const toggleAudio = () => {
        if (myStreamRef.current) {
            const audioTrack = myStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    const toggleVideo = () => {
        if (myStreamRef.current) {
            const videoTrack = myStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
            }
        }
    };

    const leaveCall = () => {
        if (socketRef.current) {
            socketRef.current.emit('leave-room');
        }
        navigate('/');
    };

    if (!user) {
        return <JoinScreen onJoin={handleJoin} error={error} />;
    }

    return (
        <CallInterface
            leaveCall={leaveCall}
            toggleAudio={toggleAudio}
            isMuted={isMuted}
            toggleVideo={toggleVideo}
            isVideoOff={isVideoOff}
            roomName={roomId}
            ChatComponent={
                <Chat
                    socket={socketRef.current}
                    room={roomId}
                    name={formatName(user.name, user.role)}
                />
            }
        >
            <div id="video-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {streams.map((s) => {
                    let displayName = s.userName;
                    // If it's a remote user, try to find their name in peersData
                    if (s.id !== 'me' && peersData[s.id]) {
                        displayName = formatName(peersData[s.id].name, peersData[s.id].role);
                    } else if (s.id === 'me') {
                        displayName = formatName(user.name, user.role);
                    }

                    return (
                        <Video
                            key={s.id}
                            stream={s.stream}
                            muted={s.muted}
                            label={displayName}
                            isLocal={s.id === 'me'}
                        />
                    );
                })}
            </div>
        </CallInterface>
    );
};

export default Room;
