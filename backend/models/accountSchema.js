const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const createAccountSchema = (role) => {
  const schema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: 80,
        match: [/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/, 'Name can contain letters and spaces only'],
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      },
      phone: { type: String, trim: true },
      password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
      role: { type: String, enum: [role], default: role },
      avatar: {
        url: { type: String, default: '' },
        publicId: { type: String, default: '' },
      },
      isVerified: { type: Boolean, default: role !== 'contractor' },
      verificationStatus: {
        type: String,
        enum: role === 'contractor'
          ? ['pending', 'verified', 'rejected']
          : ['not_applicable'],
        default: role === 'contractor' ? 'pending' : 'not_applicable',
      },
      isBlocked: { type: Boolean, default: false },
      blockReason: { type: String, default: '' },
      resetPasswordToken: String,
      resetPasswordExpire: Date,
      lastLoginAt: Date,
    },
    { timestamps: true }
  );

  schema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

  schema.methods.matchPassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
  };

  schema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    return resetToken;
  };

  return schema;
};

module.exports = createAccountSchema;