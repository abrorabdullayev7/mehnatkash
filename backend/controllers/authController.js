// Auth Controller
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'abrorabdullayev862@gmail.com').trim().toLowerCase();

const signup = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;
    const normalizedName = typeof name === 'string' ? name.trim() : '';
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (normalizedName.length < 2) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user - allow role if valid (admin is only for the fixed admin email)
    const allowedRoles = ['user', 'seller'];
    const assignedRole = normalizedEmail === ADMIN_EMAIL
      ? 'admin'
      : (allowedRoles.includes(role) ? role : 'user');

    user = new User({
      name: normalizedName,
      email: normalizedEmail,
      password,
      phone,
      address,
      role: assignedRole
    });

    await user.save();

    // Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    // Validate input
    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, avatar, region, district, addressLine } = req.body;
    const update = {};

    if (name !== undefined) {
      const trimmedName = String(name).trim();
      if (trimmedName.length < 2) {
        return res.status(400).json({ message: 'Name must be at least 2 characters' });
      }
      update.name = trimmedName;
    }

    if (phone !== undefined) {
      const normalizedPhone = String(phone).replace(/\D/g, '');
      if (normalizedPhone && (normalizedPhone.length < 9 || normalizedPhone.length > 12)) {
        return res.status(400).json({ message: 'Phone format is invalid' });
      }
      update.phone = normalizedPhone;
    }
    if (address !== undefined) update.address = String(address).trim();
    if (region !== undefined) update.region = String(region).trim();
    if (district !== undefined) update.district = String(district).trim();
    if (addressLine !== undefined) update.addressLine = String(addressLine).trim();
    if (avatar !== undefined) update.avatar = String(avatar).trim();

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: update },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('favorites');
    res.json({ success: true, favorites: user?.favorites || [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateFavorites = async (req, res) => {
  try {
    const { favorites } = req.body;
    if (!Array.isArray(favorites)) {
      return res.status(400).json({ message: 'favorites must be an array' });
    }

    const normalized = [...new Set(favorites.map((id) => String(id)))];
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { favorites: normalized } },
      { new: true }
    ).select('favorites');

    res.json({ success: true, favorites: user?.favorites || [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify Google ID token, create or find user, return JWT
const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'idToken required' });

    const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = payload.email;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const name = payload.name || payload.email.split('@')[0];
    const picture = payload.picture;

    let user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      user = new User({
        name,
        email: normalizedEmail,
        password: Math.random().toString(36).slice(-8),
        avatar: picture,
        fromGoogle: true,
        role: normalizedEmail === ADMIN_EMAIL ? 'admin' : 'user'
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Google auth error', error);
    res.status(500).json({ message: 'Google auth failed', error: error.message });
  }
};

const getGoogleClientId = (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  if (!clientId) {
    return res.status(500).json({ clientId: null, message: 'Google client ID not configured on server' });
  }
  res.json({ clientId });
};

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
  getFavorites,
  updateFavorites,
  googleAuth,
  getGoogleClientId
};
