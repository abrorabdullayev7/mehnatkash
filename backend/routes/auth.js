// Auth Routes
const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getProfile,
  updateProfile,
  getFavorites,
  updateFavorites,
  googleAuth,
  getGoogleClientId
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/google-client', getGoogleClientId);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/favorites', auth, getFavorites);
router.put('/favorites', auth, updateFavorites);

module.exports = router;
