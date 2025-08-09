const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Google OAuth success
// @route   GET /api/auth/google/success
// @access  Public
const googleSuccess = async (req, res) => {
  try {
    if (req.user) {
      const token = generateToken(req.user._id);
      
      // Set token as HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Redirect to frontend with success
      res.redirect(`${process.env.CLIENT_URL}/dashboard?auth=success`);
    } else {
      res.redirect(`${process.env.CLIENT_URL}/login?auth=failed`);
    }
  } catch (error) {
    console.error('Google success error:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?auth=error`);
  }
};

// @desc    Google OAuth failure
// @route   GET /api/auth/google/failure
// @access  Public
const googleFailure = (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/login?auth=failed`);
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
  try {
    // Clear token cookie
    res.clearCookie('token');
    
    // Logout from passport session
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout error' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('redeemedVouchers.voucherId', 'title category pointsCost');
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      points: user.points,
      avatar: user.avatar
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user stats
// @route   GET /api/auth/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const stats = {
      totalPoints: user.points,
      totalRedemptions: user.redeemedVouchers.length,
      totalPointsSpent: user.redeemedVouchers.reduce((total, voucher) => total + voucher.pointsUsed, 0),
      recentRedemptions: user.redeemedVouchers
        .sort((a, b) => new Date(b.redeemedAt) - new Date(a.redeemedAt))
        .slice(0, 5)
    };

    res.json(stats);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login with email and password
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const emailRaw = (req.body?.email || '');
  const passwordRaw = (req.body?.password || '');
  const email = emailRaw.toLowerCase().trim();
  const password = passwordRaw.trim();
  try {
    console.log('[AUTH] Login attempt for:', email);
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      console.warn('[AUTH] User not found or no password set:', email);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    if (!user.isActive) {
      console.warn('[AUTH] Inactive account login attempt:', email);
      return res.status(403).json({ message: 'Account is inactive.' });
    }
    const isMatch = await user.comparePassword(password);
    console.log('[AUTH] Password match:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        avatar: user.avatar
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMe,
  googleSuccess,
  googleFailure,
  logout,
  getProfile,
  updateProfile,
  getUserStats,
  loginUser
};
