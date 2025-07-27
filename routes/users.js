const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, admin } = require('../middleware/auth');

// Get all users (patients) - admin only
router.get('/', auth, admin, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 