const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

// Log environment variables for debugging
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '***' : 'Not set');

// Make sure MONGODB_URI is set
if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  connectTimeoutMS: 30000, // Increase connection timeout to 30 seconds
  maxPoolSize: 10, // Maintain up to 10 socket connections
  retryWrites: true,
  w: 'majority'
});

// Sample admin user
const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'password123',
  role: 'admin',
  is2FAEnabled: false, // 2FA will be set up during first login
};

// Import admin user into DB
const importData = async () => {
  try {
    // Clear existing users
    await User.deleteMany();
    console.log('User data destroyed...');

    // Create admin user
    await User.create(adminUser);
    console.log('Admin user created!');
    console.log('Email: admin@example.com');
    console.log('Password: password123');
    console.log('\nIMPORTANT: Change this password after first login!');
    
    process.exit();
  } catch (error) {
    console.error('Error importing user data:', error);
    process.exit(1);
  }
};

// Delete all user data from DB
const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log('User data destroyed...');
    process.exit();
  } catch (error) {
    console.error('Error deleting user data:', error);
    process.exit(1);
  }
};

// Handle command line arguments
if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
