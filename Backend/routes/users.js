const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/users/profile/:username
// @desc    Get user profile by username (like GET /api/getUserProfile/:username in Old Firebase route)
// @access  Public
router.get('/profile/:username', async (req, res) => {
    console.log("Requested username:", req.params.username);
    try {
        const allUsers = await User.find();
    console.log("ALL USERS IN CONNECTED DB:", allUsers.map(u => u.name));

        // lean() returns a plain JS object instead of a mongoose document
        const user = await User.findOne({
  name: { $regex: `^${req.params.username}$`, $options: 'i' }
})
            .select('-password')
            .lean();
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // ensure heatmapData (Map) is converted to an object for the client
        if (user.heatmapData && !(user.heatmapData instanceof Object)) {
            // mongoose lean will normally convert Map to an object but just in case
            user.heatmapData = Object.fromEntries(user.heatmapData);
        }
        res.json(user);
    } catch (error) {
        console.error("Error getting user profile:", error);
        res.status(500).json({ error: 'Server error' });
    }
});
// @route   PUT /api/users/profile/:username
// @desc    Update user profile
// @access  Public (or protected if you add auth later)
router.put('/profile/:username', async (req, res) => {
  try {
    const { role, location, about, profilePhoto } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { name: req.params.username },
      {
        designation: role,
        location: location,
        userDescription: about,
        profilePhoto: profilePhoto
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
