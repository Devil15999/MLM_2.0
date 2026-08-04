import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (MLM Distributor)
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, sponsorId, aadhaarNumber, aadhaarPhoto, panPhoto, transactionPhoto, selectedPackage } = req.body;

    if (!name || !email || !password || !aadhaarNumber || !selectedPackage || !aadhaarPhoto || !transactionPhoto) {
      return res.status(400).json({ message: 'Please provide all required fields (Name, Email, Password, Aadhaar Number, Package, Aadhaar Photo, Transaction Photo)' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Distributor already registered with this email' });
    }

    // Verify Sponsor ID exists in database
    const reqSponsorId = (sponsorId || 'SP-1001').trim();
    let sponsor = await User.findOne({
      $or: [{ sponsorId: reqSponsorId }, { _id: reqSponsorId.match(/^[0-9a-fA-F]{24}$/) ? reqSponsorId : null }, { email: reqSponsorId.toLowerCase() }]
    }).catch(() => null);

    if (!sponsor && reqSponsorId !== 'MASTER-HEAD' && reqSponsorId !== 'NEXIS-TOP') {
      return res.status(400).json({ message: `Invalid Sponsor ID '${reqSponsorId}'. Sponsor code does not exist in network database.` });
    }

    // Generate unique Sponsor ID for the new user
    let userOwnSponsorId = `SP-${Math.floor(1000 + Math.random() * 9000)}`;
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 50) {
      const existing = await User.findOne({ sponsorId: userOwnSponsorId });
      if (!existing) {
        isUnique = true;
      } else {
        userOwnSponsorId = `SP-${Math.floor(1000 + Math.random() * 9000)}`;
        attempts++;
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      sponsorId: userOwnSponsorId,
      role: 'customer',
      rank: 'Member',
      accountStatus: 'Pending Admin Approval',
      aadhaarNumber,
      aadhaarPhoto,
      panPhoto,
      transactionPhoto,
      selectedPackage,
      walletBalance: 0,
      totalEarnings: 0,
      downlineCount: 0,
      personalVolume: 0,
      groupVolume: 0,
    });

    // Create a Joining Request Approval
    const { Approval } = await import('../models/Approval.js');

    await Approval.create({
      type: 'Joining Request',
      userId: user._id,
      sponsorId: sponsor ? sponsor._id : null,
      sponsorName: sponsor ? sponsor.name : 'System Admin',
      enrolledMemberName: user.name,
      enrolledMemberEmail: user.email,
      packageName: selectedPackage,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully. Please wait for Admin approval to login.',
      _id: user._id,
      name: user.name,
      email: user.email,
      sponsorId: user.sponsorId,
      accountStatus: user.accountStatus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password, requiredRole } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email credentials' });
    }

    if (requiredRole && user.role !== requiredRole) {
      return res.status(403).json({
        message: `Access denied. Account role is '${user.role}', but '${requiredRole}' portal access is required.`,
      });
    }

    if (user.accountStatus === 'Pending Admin Approval') {
      return res.status(403).json({
        message: 'Your account is pending Admin approval. You will be able to log in once the Admin approves your downline enrollment.',
      });
    }

    if (user.accountStatus === 'Rejected') {
      return res.status(403).json({
        message: 'Your enrollment request was rejected by the Admin. Access denied.',
      });
    }

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      sponsorId: user.sponsorId,
      rank: user.rank,
      walletBalance: typeof user.walletBalance === 'number' ? user.walletBalance : (user.email === 'alex@nexismlm.com' ? 6250.00 : 0),
      totalEarnings: typeof user.totalEarnings === 'number' ? user.totalEarnings : (user.email === 'alex@nexismlm.com' ? 10450.00 : 0),
      downlineCount: typeof user.downlineCount === 'number' ? user.downlineCount : (user.email === 'alex@nexismlm.com' ? 36 : 0),
      personalVolume: user.personalVolume ?? 0,
      groupVolume: user.groupVolume ?? 0,
      level1MembersCount: typeof user.level1MembersCount === 'number' ? user.level1MembersCount : (user.email === 'alex@nexismlm.com' ? 12 : 0),
      level2MembersCount: typeof user.level2MembersCount === 'number' ? user.level2MembersCount : (user.email === 'alex@nexismlm.com' ? 24 : 0),
      level1AffiliateIncome: typeof user.level1AffiliateIncome === 'number' ? user.level1AffiliateIncome : (user.email === 'alex@nexismlm.com' ? 4850.00 : 0),
      level2AffiliateIncome: typeof user.level2AffiliateIncome === 'number' ? user.level2AffiliateIncome : (user.email === 'alex@nexismlm.com' ? 2420.00 : 0),
      investmentReturns: typeof user.investmentReturns === 'number' ? user.investmentReturns : (user.email === 'alex@nexismlm.com' ? 3180.00 : 0),
      totalIncome: typeof user.totalIncome === 'number' ? user.totalIncome : (user.email === 'alex@nexismlm.com' ? 10450.00 : 0),
      phone: user.phone,
      address: user.address,
      city: user.city,
      country: user.country,
      kycStatus: user.kycStatus,
      kycData: user.kycData,
      token: generateToken(user._id, user.role),
    };

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  res.json(req.user);
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed initial Admin & MLM Distributors
// @route   POST /api/auth/seed
export const seedAccounts = async (req, res) => {
  try {
    // Clear existing to refresh with MLM accounts
    await User.deleteMany({});

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@nexismlm.com',
      password: 'Admin@123456',
      role: 'admin',
      sponsorId: 'MASTER-HEAD',
      rank: 'Diamond',
      walletBalance: 85200.00,
      totalEarnings: 340000.00,
      downlineCount: 450,
      personalVolume: 5000,
      groupVolume: 1250000,
    });

    const alex = await User.create({
      name: 'Alex Rivera',
      email: 'alex@nexismlm.com',
      password: 'User@123456',
      role: 'customer',
      sponsorId: 'SP-1001',
      rank: 'Gold',
      walletBalance: 4850.00,
      totalEarnings: 18450.00,
      downlineCount: 32,
      personalVolume: 1400,
      groupVolume: 48500,
    });

    const sarah = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@nexismlm.com',
      password: 'User@123456',
      role: 'customer',
      sponsorId: 'SP-1002',
      rank: 'Platinum',
      walletBalance: 12400.00,
      totalEarnings: 64200.00,
      downlineCount: 88,
      personalVolume: 2800,
      groupVolume: 180000,
    });

    const david = await User.create({
      name: 'David Vance',
      email: 'david@nexismlm.com',
      password: 'User@123456',
      role: 'customer',
      sponsorId: 'SP-1003',
      rank: 'Silver',
      walletBalance: 1420.00,
      totalEarnings: 4200.00,
      downlineCount: 12,
      personalVolume: 800,
      groupVolume: 15400,
    });

    res.json({
      message: 'Nexis MLM Demo Distributors seeded successfully!',
      accounts: {
        admin: { email: 'admin@nexismlm.com', password: 'Admin@123456', role: 'admin' },
        customer: { email: 'alex@nexismlm.com', password: 'User@123456', role: 'customer' },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
