const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Slider = require('../models/Slider');
const { cloudinary } = require('../middleware/upload');

// Load env vars
dotenv.config({ path: '../.env' });

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample slider data
const sampleSliders = [
  {
    title: 'Welcome to Hilo',
    subtitle: 'Discover Amazing Content',
    description: 'Explore our collection of premium content and services',
    buttonText: 'Get Started',
    buttonLink: '/get-started',
    order: 1,
    isActive: true,
    image: {
      public_id: 'hilo/sliders/welcome-slider',
      url: 'https://res.cloudinary.com/demo/image/upload/v1620000000/hilo/sliders/welcome-slider.jpg',
    },
    thumbnail: {
      public_id: 'hilo/sliders/thumbnails/welcome-slider-thumb',
      url: 'https://res.cloudinary.com/demo/image/upload/c_thumb,w_300,h_200,hilo/sliders/welcome-slider.jpg',
    },
  },
  {
    title: 'Premium Features',
    subtitle: 'Unlock the Full Experience',
    description: 'Upgrade to access all premium features and content',
    buttonText: 'Upgrade Now',
    buttonLink: '/pricing',
    order: 2,
    isActive: true,
    image: {
      public_id: 'hilo/sliders/premium-slider',
      url: 'https://res.cloudinary.com/demo/image/upload/v1620000000/hilo/sliders/premium-slider.jpg',
    },
    thumbnail: {
      public_id: 'hilo/sliders/thumbnails/premium-slider-thumb',
      url: 'https://res.cloudinary.com/demo/image/upload/c_thumb,w_300,h_200,hilo/sliders/premium-slider.jpg',
    },
  },
  {
    title: 'Join Our Community',
    subtitle: 'Connect With Like-Minded People',
    description: 'Become part of our growing community today',
    buttonText: 'Join Now',
    buttonLink: '/register',
    order: 3,
    isActive: true,
    image: {
      public_id: 'hilo/sliders/community-slider',
      url: 'https://res.cloudinary.com/demo/image/upload/v1620000000/hilo/sliders/community-slider.jpg',
    },
    thumbnail: {
      public_id: 'hilo/sliders/thumbnails/community-slider-thumb',
      url: 'https://res.cloudinary.com/demo/image/upload/c_thumb,w_300,h_200,hilo/sliders/community-slider.jpg',
    },
  },
];

// Import sample sliders into DB
const importData = async () => {
  try {
    // Clear existing sliders
    await Slider.deleteMany();
    console.log('Data destroyed...');

    // Insert sample sliders
    await Slider.insertMany(sampleSliders);
    console.log('Data imported!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await Slider.deleteMany();
    console.log('Data destroyed...');
    process.exit();
  } catch (error) {
    console.error('Error deleting data:', error);
    process.exit(1);
  }
};

// Handle command line arguments
if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
