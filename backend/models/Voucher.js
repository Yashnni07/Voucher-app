const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['food', 'clothing', 'game', 'electronics', 'travel', 'entertainment', 'other'],
    default: 'other'
  },
  pointsCost: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  image: {
    type: String,
    default: ''
  },
  brand: {
    type: String,
    default: ''
  },
  totalLimit: {
    type: Number,
    required: true,
    min: 1
  },
  remainingLimit: {
    type: Number,
    required: true
  },
  userLimit: {
    type: Number,
    default: 1,
    min: 1
  },
  expiryDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  terms: {
    type: String,
    default: ''
  },
  redemptionCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Virtual for checking if voucher is expired
voucherSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiryDate;
});

// Virtual for checking if voucher is available
voucherSchema.virtual('isAvailable').get(function() {
  return this.isActive && !this.isExpired && this.remainingLimit > 0;
});

// Method to check if voucher can be redeemed
voucherSchema.methods.canRedeem = function() {
  return this.isActive && !this.isExpired && this.remainingLimit > 0;
};

// Method to redeem voucher
voucherSchema.methods.redeem = function() {
  if (this.canRedeem()) {
    this.remainingLimit -= 1;
    this.redemptionCount += 1;
    return true;
  }
  return false;
};

// Index for better query performance
voucherSchema.index({ category: 1, isActive: 1, expiryDate: 1 });
voucherSchema.index({ pointsCost: 1 });
voucherSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Voucher', voucherSchema);
