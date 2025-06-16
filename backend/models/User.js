const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    is2FAEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return require('jsonwebtoken').sign(
    { id: this._id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = require('crypto').randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Generate 2FA secret
userSchema.methods.generate2FASecret = async function () {
  const speakeasy = require('speakeasy');
  const secret = speakeasy.generateSecret({
    name: `Hilo CMS:${this.email}`,
    issuer: 'Hilo CMS',
  });
  
  // Save the secret to the user document
  this.twoFactorSecret = secret.base32;
  this.is2FAEnabled = false; // Will be set to true after verification
  this.markModified('twoFactorSecret'); // Explicitly mark as modified

  try {
    // Save the user with the new secret
    await this.save({ validateBeforeSave: false });
    console.log(`User ${this.email} post-save in generate2FASecret. Secret is ${this.twoFactorSecret ? 'present' : 'MISSING'}.`); // Added log
    
    return {
      secret: this.twoFactorSecret,
      otpauthUrl: secret.otpauth_url,
      base32: secret.base32
    };
  } catch (error) {
    console.error(`Error saving 2FA secret for user ${this.email}:`, error);
    throw new Error('Failed to save 2FA secret');
  }
};

// Verify 2FA token
userSchema.methods.verify2FAToken = function (token) {
  return require('speakeasy').totp.verify({
    secret: this.twoFactorSecret,
    encoding: 'base32',
    token: token,
    window: 1
  });
};

// Generate QR code for 2FA setup
userSchema.methods.get2FAQRCode = async function () {
  const qrcode = require('qrcode');
  
  if (!this.twoFactorSecret) {
    throw new Error('2FA secret not generated');
  }
  
  const otpauthUrl = `otpauth://totp/Hilo%20CMS:${this.email}?secret=${this.twoFactorSecret}&issuer=Hilo%20CMS`;
  
  try {
    const imageUrl = await qrcode.toDataURL(otpauthUrl);
    return {
      qrCodeUrl: imageUrl,
      secret: this.twoFactorSecret
    };
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw new Error('Error generating QR code');
  }
};

module.exports = mongoose.model('User', userSchema);
