const Voucher = require('../models/Voucher');
const User = require('../models/User');

// @desc    Get all vouchers (with filters)
// @route   GET /api/vouchers
// @access  Public
const getVouchers = async (req, res) => {
  try {
    const { category, minPoints, maxPoints, page = 1, limit = 12, sort = '-createdAt' } = req.query;
    
    // Build filter object
    const filter = { isActive: true, expiryDate: { $gt: new Date() } };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (minPoints || maxPoints) {
      filter.pointsCost = {};
      if (minPoints) filter.pointsCost.$gte = parseInt(minPoints);
      if (maxPoints) filter.pointsCost.$lte = parseInt(maxPoints);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get vouchers with pagination
    const vouchers = await Voucher.find(filter)
      .populate('createdBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Voucher.countDocuments(filter);
    
    res.json({
      vouchers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get vouchers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single voucher
// @route   GET /api/vouchers/:id
// @access  Public
const getVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    res.json(voucher);
  } catch (error) {
    console.error('Get voucher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new voucher
// @route   POST /api/vouchers
// @access  Private (Admin only)
const createVoucher = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      pointsCost,
      originalPrice,
      discountPercentage,
      image,
      brand,
      totalLimit,
      userLimit,
      expiryDate,
      terms
    } = req.body;

    const voucher = new Voucher({
      title,
      description,
      category,
      pointsCost,
      originalPrice,
      discountPercentage,
      image,
      brand,
      totalLimit,
      remainingLimit: totalLimit,
      userLimit,
      expiryDate,
      terms,
      createdBy: req.user._id
    });

    await voucher.save();
    await voucher.populate('createdBy', 'name email');

    res.status(201).json(voucher);
  } catch (error) {
    console.error('Create voucher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update voucher
// @route   PUT /api/vouchers/:id
// @access  Private (Admin only)
const updateVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        voucher[key] = req.body[key];
      }
    });

    await voucher.save();
    await voucher.populate('createdBy', 'name email');

    res.json(voucher);
  } catch (error) {
    console.error('Update voucher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete voucher
// @route   DELETE /api/vouchers/:id
// @access  Private (Admin only)
const deleteVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    await Voucher.findByIdAndDelete(req.params.id);
    res.json({ message: 'Voucher deleted successfully' });
  } catch (error) {
    console.error('Delete voucher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Redeem voucher
// @route   POST /api/vouchers/:id/redeem
// @access  Private
const redeemVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    const user = await User.findById(req.user._id);
    
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if voucher can be redeemed
    if (!voucher.canRedeem()) {
      return res.status(400).json({ 
        message: 'Voucher is not available for redemption' 
      });
    }

    // Check if user has enough points
    if (!user.canRedeemVoucher(voucher.pointsCost)) {
      return res.status(400).json({ 
        message: 'Insufficient points' 
      });
    }

    // Check if user has already redeemed this voucher (user limit)
    const userRedemptions = user.redeemedVouchers.filter(
      redemption => redemption.voucherId.toString() === voucher._id.toString()
    );

    if (userRedemptions.length >= voucher.userLimit) {
      return res.status(400).json({ 
        message: 'You have already redeemed this voucher the maximum number of times' 
      });
    }

    // Perform redemption
    const redeemSuccess = user.redeemVoucher(voucher._id, voucher.pointsCost);
    const voucherRedeemSuccess = voucher.redeem();

    if (!redeemSuccess || !voucherRedeemSuccess) {
      return res.status(400).json({ 
        message: 'Failed to redeem voucher' 
      });
    }

    // Save both user and voucher
    await user.save();
    await voucher.save();

    res.json({
      message: 'Voucher redeemed successfully',
      remainingPoints: user.points,
      voucherTitle: voucher.title,
      pointsUsed: voucher.pointsCost
    });
  } catch (error) {
    console.error('Redeem voucher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get voucher categories
// @route   GET /api/vouchers/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Voucher.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get voucher analytics (Admin only)
// @route   GET /api/vouchers/analytics
// @access  Private (Admin only)
const getVoucherAnalytics = async (req, res) => {
  try {
    // Top redeemed vouchers
    const topRedeemed = await Voucher.find({ isActive: true })
      .sort({ redemptionCount: -1 })
      .limit(5)
      .select('title redemptionCount category pointsCost');

    // Low redeemed vouchers
    const lowRedeemed = await Voucher.find({ isActive: true, redemptionCount: { $lt: 5 } })
      .sort({ redemptionCount: 1 })
      .limit(5)
      .select('title redemptionCount category pointsCost');

    // Category statistics
    const categoryStats = await Voucher.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          totalVouchers: { $sum: 1 },
          totalRedemptions: { $sum: '$redemptionCount' },
          avgPointsCost: { $avg: '$pointsCost' }
        }
      }
    ]);

    // Recent vouchers
    const recentVouchers = await Voucher.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title category pointsCost redemptionCount createdAt');

    res.json({
      topRedeemed,
      lowRedeemed,
      categoryStats,
      recentVouchers
    });
  } catch (error) {
    console.error('Get voucher analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getVouchers,
  getVoucher,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  redeemVoucher,
  getCategories,
  getVoucherAnalytics
};
