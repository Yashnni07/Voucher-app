const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const {
  getVouchers,
  getVoucher,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  redeemVoucher,
  getCategories,
  getVoucherAnalytics
} = require('../controllers/voucherController');

// @route   GET /api/vouchers
// @desc    Get all vouchers with filters
// @access  Public
router.get('/', optionalAuth, getVouchers);

// @route   GET /api/vouchers/categories
// @desc    Get all voucher categories
// @access  Public
router.get('/categories', getCategories);

// @route   GET /api/vouchers/analytics
// @desc    Get voucher analytics (Admin only)
// @access  Private (Admin)
router.get('/analytics', authenticateToken, requireAdmin, getVoucherAnalytics);

// @route   GET /api/vouchers/:id
// @desc    Get single voucher by ID
// @access  Public
router.get('/:id', optionalAuth, getVoucher);

// @route   POST /api/vouchers
// @desc    Create new voucher (Admin only)
// @access  Private (Admin)
router.post('/', authenticateToken, requireAdmin, createVoucher);

// @route   PUT /api/vouchers/:id
// @desc    Update voucher (Admin only)
// @access  Private (Admin)
router.put('/:id', authenticateToken, requireAdmin, updateVoucher);

// @route   DELETE /api/vouchers/:id
// @desc    Delete voucher (Admin only)
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, deleteVoucher);

// @route   POST /api/vouchers/:id/redeem
// @desc    Redeem a voucher
// @access  Private
router.post('/:id/redeem', authenticateToken, redeemVoucher);

module.exports = router;
