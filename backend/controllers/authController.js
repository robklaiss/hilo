const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const jwt = require('jsonwebtoken'); // Added missing import

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
  });

  sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  console.log('Login route hit:', req.method, req.url, req.body);
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // If 2FA is enabled, return a flag indicating 2FA is required
  if (user.is2FAEnabled) {
    // Create a temporary token that will be used for 2FA verification
    const tempToken = user.getSignedJwtToken();
    
    return res.status(200).json({
      success: true,
      requires2FA: true,
      tempToken: tempToken,
      message: '2FA verification required'
    });
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Complete 2FA login
// @route   POST /api/v1/auth/verify-2fa
// @access  Public
exports.verify2FA = asyncHandler(async (req, res, next) => {
  console.log('Verify2FA route hit:', req.method, req.url, req.body);
  const { token, tempToken } = req.body;
  
  if (!token || !tempToken) {
    return next(new ErrorResponse('Please provide both 2FA token and temporary token', 400));
  }

  try {
    // Verify the temporary JWT token
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    
    // Get user from the token
    const user = await User.findById(decoded.id).select('+twoFactorSecret');

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (!user.is2FAEnabled) {
      return next(new ErrorResponse('2FA is not enabled for this user', 400));
    }

    // Verify the 2FA token
    const isVerified = user.verify2FAToken(token);
    
    if (!isVerified) {
      return next(new ErrorResponse('Invalid 2FA token', 401));
    }


    // If we get here, 2FA was successful - send back a new JWT with full access
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Error verifying tempToken in verify2FA:', err); // Added detailed error logging
    return next(new ErrorResponse('Invalid or expired verification token', 401));
  }
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Generate 2FA secret
// @route   POST /api/v1/auth/2fa/setup
// @access  Private
exports.setup2FA = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (user.is2FAEnabled) {
    return next(new ErrorResponse('2FA is already enabled', 400));
  }

  try {
    // Generate 2FA secret and save it to the user
    const secret = await user.generate2FASecret();
    
    // Refresh the user document to ensure we have the latest data
    const updatedUser = await User.findById(req.user.id).select('+twoFactorSecret');
    
    if (!updatedUser || !updatedUser.twoFactorSecret) {
      return next(new ErrorResponse('Failed to generate 2FA secret', 500));
    }

    // Generate QR code for the user to scan
    const qrCode = await updatedUser.get2FAQRCode();
    
    res.status(200).json({
      success: true,
      data: {
        qrCodeUrl: qrCode.qrCodeUrl,
        secret: qrCode.secret
      }
    });
  } catch (error) {
    console.error('Error in 2FA setup:', error);
    return next(new ErrorResponse('Failed to set up 2FA', 500));
  }
});

// @desc    Verify 2FA setup
// @route   POST /api/v1/auth/2fa/verify
// @access  Private
exports.verify2FASetup = asyncHandler(async (req, res, next) => {
  console.log('\n=== 2FA Verification Request ===');
  console.log('Request Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  
  try {
    // 1. Check if token is provided
    const { token } = req.body;
    console.log('1. Checking if token is provided...');
    if (!token) {
      throw new ErrorResponse('2FA token is required', 400);
    }
    console.log('✅ Token provided');

    // 2. Check if user is authenticated
    console.log('\n2. Checking authentication...');
    if (!req.user || !req.user.id) {
      console.error('❌ No user in request');
      console.log('Request user object:', req.user);
      throw new ErrorResponse('Authentication required', 401);
    }
    console.log(`✅ User authenticated: ${req.user.id}`);

    // 3. Find the user in database
    console.log('\n3. Looking up user in database...');
    const user = await User.findById(req.user.id).select('+twoFactorSecret');
    if (!user) {
      console.error(`❌ User not found with ID: ${req.user.id}`);
      throw new ErrorResponse('User not found', 404);
    }
    console.log(`✅ User found: ${user.email} (${user._id})`);

    // 4. Check if 2FA is already set up
    console.log('\n4. Checking 2FA setup status...');
    console.log('User 2FA status:', {
      is2FAEnabled: user.is2FAEnabled,
      hasTwoFactorSecret: !!user.twoFactorSecret,
      twoFactorSecretLength: user.twoFactorSecret ? user.twoFactorSecret.length : 0
    });

    if (!user.twoFactorSecret) {
      console.error('❌ No 2FA secret found for user');
      throw new ErrorResponse('2FA is not set up for this user', 400);
    }
    console.log('✅ 2FA secret exists');

    // 5. Verify the 2FA token
    console.log('\n5. Verifying 2FA token...');
    console.log('Token to verify:', token);
    console.log('Using secret:', user.twoFactorSecret ? '******' : 'No secret');
    
    const isVerified = user.verify2FAToken(token);
    console.log('Token verification result:', isVerified);

    if (!isVerified) {
      console.error('❌ Invalid 2FA token');
      throw new ErrorResponse('Invalid 2FA token', 401);
    }
    console.log('✅ 2FA token verified successfully');

    // 6. Enable 2FA for the user
    console.log('\n6. Enabling 2FA for user...');
    user.is2FAEnabled = true;
    await user.save({ validateBeforeSave: false });
    console.log('✅ 2FA enabled successfully');
    console.log('===================================\n');

    res.status(200).json({
      success: true,
      data: { is2FAEnabled: true },
      message: '2FA has been enabled successfully',
    });
  } catch (error) {
    console.error('verify2FASetup - Error:', error);
    next(error);
  }
});

// @desc    Disable 2FA
// @route   DELETE /api/v1/auth/2fa/disable
// @access  Private
exports.disable2FA = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  
  if (!password) {
    return next(new ErrorResponse('Please provide your password', 400));
  }

  const user = await User.findById(req.user.id).select('+password');

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  // Disable 2FA
  user.is2FAEnabled = false;
  user.twoFactorSecret = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: { is2FAEnabled: false }
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      is2FAEnabled: user.is2FAEnabled
    });
};
