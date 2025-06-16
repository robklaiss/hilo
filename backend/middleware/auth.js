const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } 
  // Set token from cookie
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from the token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 401));
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

// Check if 2FA is required for the user
exports.require2FA = async (req, res, next) => {
  // Skip 2FA check if not enabled for the user
  if (!req.user.is2FAEnabled) {
    return next();
  }

  // Check for 2FA token in headers or body
  const twoFAToken = 
    req.headers['x-2fa-token'] || 
    (req.body && req.body.twoFAToken);

  if (!twoFAToken) {
    return next(
      new ErrorResponse('2FA token is required', 403, '2FA_REQUIRED')
    );
  }

  try {
    // Verify the 2FA token
    const isVerified = req.user.verify2FAToken(twoFAToken);
    
    if (!isVerified) {
      return next(new ErrorResponse('Invalid 2FA token', 401));
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('Invalid 2FA token', 401));
  }
};

// Middleware to check if 2FA is set up for the user
exports.check2FAStatus = (req, res, next) => {
  if (req.user.is2FAEnabled) {
    return res.status(200).json({
      success: true,
      is2FAEnabled: true
    });
  }
  next();
};
