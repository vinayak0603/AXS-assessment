const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const { ExpressPeerServer } = require('peer');

const PORT = 5000;

// PeerServer setup
const peerServer = ExpressPeerServer(server, {
    debug: true,
    path: '/'
});

app.use('/peerjs', peerServer);

// Socket.io setup
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.static('public'));

// Store room users: { roomId: [{ id, name, role }, ...] }
const rooms = {};

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId, userData) => {
        const { name, role } = userData || {};

        // 1. Initialize room if needed
        if (!rooms[roomId]) {
            rooms[roomId] = [];
        }

        // 2. Check Capacity (Max 2)
        const roomUsers = rooms[roomId];
        if (roomUsers.length >= 2) {
            socket.emit('room-full');
            return;
        }

        // 3. Add User
        const newUser = { id: userId, name, role };
        rooms[roomId].push(newUser);

        socket.join(roomId);

        // 4. Notify others in the room
        socket.to(roomId).emit('user-connected', userId, newUser);

        // 5. Send existing users to the new user (so they know names/roles)
        // Filter out self
        const existingUsers = roomUsers.filter(u => u.id !== userId);
        socket.emit('all-users', existingUsers);

        socket.on('send-message', (message) => {
            io.to(roomId).emit('receive-message', message);
        });

        socket.on('leave-room', () => {
            // Same logic as disconnect, but triggered manually
            rooms[roomId] = rooms[roomId].filter(u => u.id !== userId);
            socket.to(roomId).emit('user-disconnected', userId);
            socket.to(roomId).emit('meeting-ended');

            if (rooms[roomId].length === 0) {
                delete rooms[roomId];
            }
        });

        socket.on('disconnect', () => {
            // Remove user from room
            rooms[roomId] = rooms[roomId].filter(u => u.id !== userId);

            // Notify others that the user left AND the meeting is ending
            socket.to(roomId).emit('user-disconnected', userId);
            socket.to(roomId).emit('meeting-ended');

            // Clean up empty rooms
            if (rooms[roomId].length === 0) {
                delete rooms[roomId];
            }
        });
    });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
