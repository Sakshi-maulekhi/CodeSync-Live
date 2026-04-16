require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

// Import routes and middleware
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problems');
const userRoutes = require('./routes/users');
const codeRoutes = require('./routes/code');
const socketAuth = require('./middleware/socketAuth');
const socketHandler = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000 // Keep timeout short to fail fast if MongoDB isn't running
})
    .then(() => console.log('MongoDB connected successfully to', process.env.MONGODB_URI))
    .catch((err) => {
        console.error('MongoDB connection error. Please ensure MongoDB is running.');
        console.error(err);
    });

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/problems', problemRoutes);

// Basic old root
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Socket.io Integration
// Apply authentication middleware to sockets
// io.use(socketAuth);

// Initialize socket event handlers
socketHandler(io);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


