import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    sponsorId: {
      type: String,
      default: 'NEXIS-TOP',
    },
    rank: {
      type: String,
      enum: ['Member', 'Silver', 'Gold', 'Platinum', 'Diamond'],
      default: 'Gold',
    },
    walletBalance: {
      type: Number,
      default: 4850.00,
    },
    totalEarnings: {
      type: Number,
      default: 12450.00,
    },
    downlineCount: {
      type: Number,
      default: 28,
    },
    personalVolume: {
      type: Number,
      default: 1200,
    },
    groupVolume: {
      type: Number,
      default: 45800,
    },
    avatar: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'pending'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
