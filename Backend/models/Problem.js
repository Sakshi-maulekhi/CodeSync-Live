const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    title: String,
    description: String,
    input: String,
    output: String,
    runInput: String,
    runOutput: String,
    submitInput: String,
    submitOutput: String,
    difficulty: String,
    video: String,
    tags: [String],
    explanation: String
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
