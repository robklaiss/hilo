const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  verify2FA,
  setup2FA,
  verify2FASetup,
  disable2FA,
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// 2FA verification for login (special case - doesn't require full auth)
router.post('/verify-2fa', verify2FA);

// Protected routes (require auth)
router.use(protect);

// 2FA management routes (require auth)
router.post('/2fa/setup', setup2FA);
router.post('/2fa/verify', verify2FASetup);
router.delete('/2fa/disable', disable2FA);

// User routes
router.get('/me', getMe);

module.exports = router;
