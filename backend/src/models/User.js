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
      unique: true,
      sparse: true,
      default: function() { return `SP-${Math.floor(1000 + Math.random() * 9000)}`; },
    },
    rank: {
      type: String,
      enum: ['Member', 'Silver', 'Gold', 'Platinum', 'Diamond'],
      default: 'Gold',
    },
    selectedPackage: {
      type: String,
      default: 'None',
    },
    legPreference: {
      type: String,
      default: 'Direct Level 1',
    },
    isOneTimePassword: {
      type: Boolean,
      default: false,
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
    // Customer Portal Metrics & Details (Unilevel Network Model: N Level 1 Nodes, Max 2 Levels)
    maxLevels: {
      type: Number,
      default: 2,
    },
    level1MembersCount: {
      type: Number,
      default: 2,
    },
    level2MembersCount: {
      type: Number,
      default: 4,
    },
    level1AffiliateIncome: {
      type: Number,
      default: 4850.00,
    },
    level2AffiliateIncome: {
      type: Number,
      default: 2420.00,
    },
    investmentReturns: {
      type: Number,
      default: 3180.00,
    },
    totalIncome: {
      type: Number,
      default: 10450.00,
    },
    phone: {
      type: String,
      default: '+1 (555) 234-5678',
    },
    address: {
      type: String,
      default: '742 Evergreen Terrace',
    },
    city: {
      type: String,
      default: 'Springfield',
    },
    country: {
      type: String,
      default: 'United States',
    },
    kycStatus: {
      type: String,
      enum: ['Not Submitted', 'Pending', 'Verified', 'Under Review', 'Rejected'],
      default: 'Verified',
    },
    accountStatus: {
      type: String,
      enum: ['Pending Admin Approval', 'Approved', 'Rejected'],
      default: 'Approved',
    },
    kycData: {
      documentType: { type: String, default: 'Aadhaar Card / Govt ID' },
      documentNumber: { type: String, default: '8942-1049-5821' },
      bankName: { type: String, default: 'Global Chase Bank' },
      accountNumber: { type: String, default: '•••• •••• 4920' },
      ifscCode: { type: String, default: 'CHAS0009182' },
      upiId: { type: String, default: 'alexrivera@upi' },
    },
    aadhaarNumber: {
      type: String,
    },
    aadhaarPhoto: {
      type: String, // Base64
    },
    panPhoto: {
      type: String, // Base64
    },
    transactionPhoto: {
      type: String, // Base64
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
