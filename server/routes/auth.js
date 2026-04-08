const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 🔥 FIX: map name → username
        user = new User({
            name: name,
            email,
            password
        });

        await user.save();

        const payload = { id: user._id, username: user.name };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({
            token,
            user: { id: user._id, username: user.name, email: user.email }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { id: user._id, username: user.name };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: { id: user._id, username: user.name, email: user.email }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;