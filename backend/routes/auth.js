const express = require('express');
const passport = require('passport');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getMe,
  googleSuccess,
  googleFailure,
  logout,
  getProfile,
  updateProfile,
  getUserStats,
  loginUser
} = require('../controllers/authController');

// @route   GET /api/auth/google
// @desc    Start Google OAuth
// @access  Public
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/google/failure' }),
  googleSuccess
);

// @route   GET /api/auth/google/success
// @desc    Google OAuth success
// @access  Public
router.get('/google/success', googleSuccess);

// @route   GET /api/auth/google/failure
// @desc    Google OAuth failure
// @access  Public
router.get('/google/failure', googleFailure);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticateToken, getMe);

// @route   GET /api/auth/profile
// @desc    Get user profile with redemption history
// @access  Private
router.get('/profile', authenticateToken, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, updateProfile);

// @route   GET /api/auth/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', authenticateToken, getUserStats);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticateToken, logout);

// @route   POST /api/auth/login
// @desc    Login with email and password
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/auth/check
// @desc    Check if user is authenticated (via JWT cookie or Authorization header)
// @access  Public (but uses auth middleware)
router.get('/check', authenticateToken, (req, res) => {
  // If authenticateToken passed, req.user is set
  return res.json({
    isAuthenticated: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      points: req.user.points,
      avatar: req.user.avatar
    }
  });
});

module.exports = router;
