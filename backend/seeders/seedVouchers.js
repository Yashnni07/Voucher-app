const mongoose = require('mongoose');
const Voucher = require('../models/Voucher');
const User = require('../models/User');
require('dotenv').config();

const sampleVouchers = [
  {
    title: "McDonald's Big Mac Meal",
    description: "Enjoy a classic Big Mac meal with fries and drink",
    category: "food",
    pointsCost: 2500,
    originalPrice: 12.99,
    discountPercentage: 20,
    brand: "McDonald's",
    totalLimit: 100,
    userLimit: 2,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    terms: "Valid at participating McDonald's locations. Cannot be combined with other offers.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop" // Big Mac meal photo
  },
  {
    title: "Nike Air Max Sneakers",
    description: "Stylish and comfortable Nike Air Max sneakers",
    category: "clothing",
    pointsCost: 15000,
    originalPrice: 120.00,
    discountPercentage: 25,
    brand: "Nike",
    totalLimit: 50,
    userLimit: 1,
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    terms: "Available in selected sizes and colors. Exchange policy applies.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop" // Nike-style sneakers photo
  },
  {
    title: "Steam Gift Card $25",
    description: "Add $25 to your Steam wallet for games and content",
    category: "game",
    pointsCost: 5000,
    originalPrice: 25.00,
    discountPercentage: 0,
    brand: "Steam",
    totalLimit: 200,
    userLimit: 3,
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    terms: "Digital delivery. Code will be sent to your email within 24 hours.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop" // Gaming setup photo
  },
  {
    title: "Starbucks Coffee Voucher",
    description: "Free grande-sized drink of your choice",
    category: "food",
    pointsCost: 1500,
    originalPrice: 5.95,
    discountPercentage: 100,
    brand: "Starbucks",
    totalLimit: 150,
    userLimit: 1,
    expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    terms: "Valid at participating Starbucks locations. Excludes premium drinks.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop" // Coffee drink photo
  },
  {
    title: "H&M Fashion Voucher",
    description: "$20 off your next purchase at H&M",
    category: "clothing",
    pointsCost: 4000,
    originalPrice: 20.00,
    discountPercentage: 0,
    brand: "H&M",
    totalLimit: 80,
    userLimit: 2,
    expiryDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000), // 75 days from now
    terms: "Minimum purchase of $50 required. Valid in-store and online.",
    image: "https://images.unsplash.com/photo-1521334884684-d80222895322?q=80&w=1200&auto=format&fit=crop" // Fashion/clothing photo
  },
  {
    title: "PlayStation Store Gift Card",
    description: "$10 PlayStation Store credit",
    category: "game",
    pointsCost: 2000,
    originalPrice: 10.00,
    discountPercentage: 0,
    brand: "PlayStation",
    totalLimit: 120,
    userLimit: 5,
    expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days from now
    terms: "Valid for PlayStation Network purchases. Code delivered digitally.",
    image: "https://images.unsplash.com/photo-1585079542156-2755d9fd7bae?q=80&w=1200&auto=format&fit=crop" // PlayStation controller photo
  }
];

const seedVouchers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Ensure admin user exists with a known password
    let adminUser = await User.findOne({ email: 'admin@voucherapp.com' });
    if (!adminUser) {
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@voucherapp.com',
        password: 'admin123', // Default admin password
        role: 'admin',
        points: 100000,
        isActive: true
      });
      await adminUser.save();
      console.log('Admin user created');
    } else {
      // Set/override password to ensure predictable credentials for local login
      adminUser.password = 'admin123';
      await adminUser.save();
      console.log('Admin user password updated');
    }

    // Clear existing vouchers
    await Voucher.deleteMany({});
    console.log('Existing vouchers cleared');

    // Add createdBy field to sample vouchers
    const vouchersWithCreator = sampleVouchers.map(voucher => ({
      ...voucher,
      remainingLimit: voucher.totalLimit,
      createdBy: adminUser._id
    }));

    // Insert sample vouchers
    await Voucher.insertMany(vouchersWithCreator);
    console.log(`${sampleVouchers.length} sample vouchers created`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedVouchers();
}

module.exports = seedVouchers;
