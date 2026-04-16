const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// store a copy of the problem object plus submission metadata
const problemSchema = new mongoose.Schema({
    problem: {
        type: Object,
        required: true
    },
    language: {
        type: String,
        default: ''
    },
    submittedOn: {
        type: Date,
        default: Date.now
    },
    totalTestCases: {
        type: Number,
        default: 0
    },
    testCasesPassed: {
        type: Number,
        default: 0
    },
    isSolved: {
        type: Boolean,
        default: false
    },
    solvedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false }); // prevent separate _id for subdocuments



    const userSchema = new mongoose.Schema({
   
    name: {
        type: String,
        required: true,

        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    userDescription: {
        type: String,
        default: "I am a coder"
    },
    designation: {
        type: String,
        default: "Software Engineer"
    },
    location: {
        type: String,
        default: "India"
    },

    // 🔥 Fixed structure
    problemsSolved: {
        type: [problemSchema],
        default: []
    },

    heatmapData: {
        type: Map,
        of: Number,
        default: {}
    }

}, { timestamps: true });


// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});


// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('User', userSchema);