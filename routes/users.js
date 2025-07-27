const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users (patients) - open to all
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 