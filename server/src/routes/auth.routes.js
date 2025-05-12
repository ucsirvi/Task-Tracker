const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    const { name, email, password, country } = req.body;

    if (!name || !email || !password || !country) {
      console.log('Missing fields:', { name, email, country });
      return res.status(400).json({ 
        message: 'All fields are required',
        details: { name, email, country }
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({
      name,
      email,
      password,
      country,
      theme: 'light',
      projectCount: 0
    });

    console.log('Creating new user:', { name, email, country });
    await user.save();
    console.log('User created successfully');

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        theme: user.theme,
        projectCount: user.projectCount
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Email already exists',
        error: error.message 
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        error: Object.values(error.errors).map(e => e.message)
      });
    }

    res.status(500).json({ 
      message: 'Failed to create account',
      error: error.message 
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('Comparing passwords...');
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');

    if (!isMatch) {
      console.log('Password does not match for user:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Login successful for user:', email);
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        theme: user.theme,
        projectCount: user.projectCount
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        theme: user.theme,
        projectCount: user.projectCount
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/theme', auth, async (req, res) => {
  try {
    const { theme } = req.body;
    
    if (!theme || !['light', 'dark'].includes(theme)) {
      return res.status(400).json({ message: 'Invalid theme value' });
    }

    req.user.theme = theme;
    await req.user.save();

    res.json({ theme: req.user.theme });
  } catch (error) {
    console.error('Error updating theme:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 