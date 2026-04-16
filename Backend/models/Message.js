const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        index: true // Index for faster queries within a room
    },
    sender: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
