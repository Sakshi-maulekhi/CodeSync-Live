const Message = require('../models/Message');
const { addUser, removeUser, isUserOnline } = require('./onlineUsers');

const roomUsersCount = new Map();
const roomAdminMap = new Map();
const roomQuestionMap = new Map();
const roomModeMap = new Map();

const socketHandler = (io) => {
    io.on('connection', (socket) => {

        console.log(`User connected: ${socket.id}`);

        // Join Room
        socket.on('joinRoom', async (data) => {
            const roomId = typeof data === 'string' ? data : data.roomId;
            const username =
                typeof data === 'string'
                    ? `User-${socket.id.slice(0, 5)}`
                    : data.username;

            const mode =
                typeof data === 'string'
                    ? 'GSMode'
                    : data.mode || 'GSMode';

            // Leave previous rooms
            Array.from(socket.rooms).forEach(room => {
                if (room !== socket.id) socket.leave(room);
            });

            socket.join(roomId);
            socket.displayName = username; // attach to socket

            console.log(`User ${username} joined room: ${roomId}`);

            roomModeMap.set(roomId, mode);

            if (roomUsersCount.has(roomId)) {
                if (!roomUsersCount.get(roomId).includes(username)) {
                    roomUsersCount.set(roomId, [
                        ...roomUsersCount.get(roomId),
                        username
                    ]);
                }
            } else {
                roomUsersCount.set(roomId, [username]);
                roomAdminMap.set(roomId, username);
            }

            io.to(roomId).emit("roomAdmin", roomAdminMap.get(roomId));
            io.to(roomId).emit("userCount", roomUsersCount.get(roomId));

            try {
                const previousMessages = await Message.find({ roomId })
                    .sort({ createdAt: 1 })
                    .limit(50);

                socket.emit('messageHistory', previousMessages);
            } catch (error) {
                console.error('Error loading previous messages:', error);
                socket.emit('error', 'Could not load message history');
            }
        });

        // New Chat Message
        socket.on('sendMessage', async (data) => {
            try {
                const { roomId, text } = data;

                if (!roomId || !text) {
                    return socket.emit('error', 'Room ID and text required');
                }

                const newMessage = new Message({
                    roomId,
                    sender: {
                        id: socket.id,
                        name: socket.displayName || "Anonymous"
                    },
                    text
                });

                await newMessage.save();

                io.to(roomId).emit('newMessage', newMessage);
            } catch (error) {
                console.error('Error saving message:', error);
                socket.emit('error', 'Could not send message');
            }
        });

        socket.on("selectedQuestion", (data) => {
            const { room, questionId } = data;
            roomQuestionMap.set(room, questionId);
            const roomMode = roomModeMap.get(room) ?? "GSMode";
            io.to(room).emit("questionSelected", { questionId, roomMode });
        });

        socket.on("sendMessageToRoom", (data) => {
            const { room, message, to } = data;
            io.to(room).emit("message", { to, message });
        });

        socket.on("changeLanguage", (data) => {
            const { room, language, username } = data;
            io.to(room).emit("language", { username, language });
        });

        socket.on('disconnectUser', (data) => {
            const { room, displayName } = data;
            if (roomUsersCount.has(room)) {
                const updated = roomUsersCount
                    .get(room)
                    .filter(name => name !== displayName);

                roomUsersCount.set(room, updated);
                io.to(room).emit("userCount", updated);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.displayName || socket.id}`);
        });

    });
};

module.exports = socketHandler;