// Map to keep track of online users
// Key: userId (String), Value: Set of socketIds (to handle multiple connections from same user)
const onlineUsers = new Map();

const addUser = (userId, socketId) => {
    if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socketId);
};

const removeUser = (userId, socketId) => {
    if (onlineUsers.has(userId)) {
        const userSockets = onlineUsers.get(userId);
        userSockets.delete(socketId);

        // If user has no more open sockets, remove them from map
        if (userSockets.size === 0) {
            onlineUsers.delete(userId);
        }
    }
};

const getOnlineUsers = () => {
    return Array.from(onlineUsers.keys());
};

const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
};

module.exports = {
    addUser,
    removeUser,
    getOnlineUsers,
    isUserOnline,
    onlineUsers
};
