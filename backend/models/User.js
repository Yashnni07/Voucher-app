const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  points: {
    type: Number,
    default: 50000 // Default points for new users
  },
  redeemedVouchers: [{
    voucherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voucher'
    },
    redeemedAt: {
      type: Date,
      default: Date.now
    },
    pointsUsed: {
      type: Number,
      required: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving (if using local auth)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user can redeem a voucher
userSchema.methods.canRedeemVoucher = function(voucherCost) {
  return this.points >= voucherCost;
};

// Method to redeem voucher
userSchema.methods.redeemVoucher = function(voucherId, pointsUsed) {
  if (this.points >= pointsUsed) {
    this.points -= pointsUsed;
    this.redeemedVouchers.push({
      voucherId,
      pointsUsed,
      redeemedAt: new Date()
    });
    return true;
  }
  return false;
};

module.exports = mongoose.model('User', userSchema);
