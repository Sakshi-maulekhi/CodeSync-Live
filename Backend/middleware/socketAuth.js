const jwt = require('jsonwebtoken');

const socketAuth = (socket, next) => {
    try {
        // Extract token from handshake auth or query
        const token = socket.handshake.auth.token || socket.handshake.query.token;

        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user data to socket instance for later use
        socket.user = decoded;
        next();
    } catch (error) {
        next(new Error('Authentication error: Invalid token'));
    }
};

module.exports = socketAuth;
