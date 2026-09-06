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
    const { name, phone, email, password, sponsorId, aadhaarNumber, aadhaarPhoto, panPhoto, transactionPhoto, selectedPackage } = req.body;

    if (!name || !phone || !email || !password || !aadhaarNumber || !selectedPackage || !aadhaarPhoto || !transactionPhoto) {
      return res.status(400).json({ message: 'Please provide all required fields (Name, Phone Number, Email, Password, Aadhaar Number, Package, Aadhaar Photo, Transaction Photo)' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Distributor already registered with this email' });
    }

    const trimmedAadhaar = aadhaarNumber.trim();
    const cleanAadhaar = trimmedAadhaar.replace(/[\s-]/g, '');

    // Validate 12-digit Aadhaar format (must be 12 digits, cannot start with 0 or 1)
    if (!/^[2-9]\d{11}$/.test(cleanAadhaar)) {
      return res.status(400).json({
        message: 'Invalid Aadhaar Number. Must be a valid 12-digit number (e.g. 2345 6789 0123).'
      });
    }

    const aadhaarExists = await User.findOne({
      $or: [
        { aadhaarNumber: trimmedAadhaar },
        { aadhaarNumber: cleanAadhaar }
      ]
    });
    if (aadhaarExists) {
      return res.status(400).json({ message: 'Distributor already registered with this Aadhaar Number' });
    }

    // Verify Sponsor Phone Number if provided, otherwise default to System Admin
    const reqSponsorId = sponsorId ? sponsorId.trim() : '';
    let sponsor = null;

    if (reqSponsorId !== '') {
      sponsor = await User.findOne({
        $or: [
          { phone: reqSponsorId },
          { sponsorId: reqSponsorId },
          { _id: reqSponsorId.match(/^[0-9a-fA-F]{24}$/) ? reqSponsorId : null },
          { email: reqSponsorId.toLowerCase() }
        ]
      }).catch(() => null);

      if (!sponsor && reqSponsorId !== 'MASTER-HEAD' && reqSponsorId !== 'LIFEFUNDAI-TOP') {
        return res.status(400).json({ message: `Invalid Sponsor Phone Number '${reqSponsorId}'. Sponsor phone number does not exist in network database.` });
      }
    }

    // If sponsor is empty or set to master head without explicit user record, default to Top Most Head Admin Node (dev2)
    if (!sponsor) {
      sponsor = await User.findOne({
        $or: [
          { email: 'dev2@gmail.com' },
          { phone: '+919876543210' },
          { sponsorId: 'SP-dev2-3997' },
          { role: 'admin' },
          { sponsorId: 'MASTER-HEAD' }
        ]
      });
    }

    // Use Phone Number as User's own Sponsor ID / Code
    const cleanPhone = phone.trim();
    const userOwnSponsorId = cleanPhone || `SP-${Math.floor(1000 + Math.random() * 9000)}`;

    const user = await User.create({
      name,
      phone: cleanPhone,
      email,
      password,
      sponsorId: userOwnSponsorId,
      parentSponsorId: sponsor ? sponsor._id : null,
      parentSponsorCode: sponsor ? (sponsor.phone || sponsor.sponsorId) : (reqSponsorId || 'Admin'),
      parentSponsorEmail: sponsor ? sponsor.email : 'dev2@gmail.com',
      parentSponsorEmail: sponsor ? sponsor.email : 'dev2@gmail.com',
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
      sponsorName: sponsor ? sponsor.name : 'dev2',
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
    const cleanEmail = String(email || '').toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user) {
      return res.status(401).json({ message: `No account registered with email '${cleanEmail}'.` });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: `Incorrect password / One-Time Password for '${cleanEmail}'. Please check your credentials.` });
    }

    if (requiredRole && user.role !== requiredRole) {
      return res.status(403).json({
        message: `Access denied. Account role is '${user.role}', but '${requiredRole}' portal access is required.`,
      });
    }

    if (user.accountStatus === 'Pending Admin Approval') {
      return res.status(403).json({
        message: `Your account '${cleanEmail}' is pending Admin approval. You will be able to log in once the Admin approves your enrollment.`,
      });
    }

    if (user.accountStatus === 'Rejected') {
      return res.status(403).json({
        message: `Your enrollment request for '${cleanEmail}' was rejected by the Admin. Access denied.`,
      });
    }

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      sponsorId: user.sponsorId,
      rank: user.rank,
      selectedPackage: user.selectedPackage || 'Starter Package (₹10,000)',
      accountStatus: user.accountStatus,
      walletBalance: typeof user.walletBalance === 'number' ? user.walletBalance : (user.email === 'alex@lifefundAI.com' ? 6250.00 : 0),
      totalEarnings: typeof user.totalEarnings === 'number' ? user.totalEarnings : (user.email === 'alex@lifefundAI.com' ? 10450.00 : 0),
      downlineCount: typeof user.downlineCount === 'number' ? user.downlineCount : (user.email === 'alex@lifefundAI.com' ? 36 : 0),
      personalVolume: user.personalVolume ?? 0,
      groupVolume: user.groupVolume ?? 0,
      level1MembersCount: typeof user.level1MembersCount === 'number' ? user.level1MembersCount : (user.email === 'alex@lifefundAI.com' ? 12 : 0),
      level2MembersCount: typeof user.level2MembersCount === 'number' ? user.level2MembersCount : (user.email === 'alex@lifefundAI.com' ? 24 : 0),
      level1AffiliateIncome: typeof user.level1AffiliateIncome === 'number' ? user.level1AffiliateIncome : (user.email === 'alex@lifefundAI.com' ? 4850.00 : 0),
      level2AffiliateIncome: typeof user.level2AffiliateIncome === 'number' ? user.level2AffiliateIncome : (user.email === 'alex@lifefundAI.com' ? 2420.00 : 0),
      investmentReturns: typeof user.investmentReturns === 'number' ? user.investmentReturns : 0,

      totalIncome: typeof user.totalIncome === 'number' ? user.totalIncome : (user.email === 'alex@lifefundAI.com' ? 10450.00 : 0),
      phone: user.phone,
      address: user.address,
      city: user.city,
      country: user.country,
      aadhaarNumber: user.aadhaarNumber,
      aadhaarPhoto: user.aadhaarPhoto,
      panPhoto: user.panPhoto,
      panNumber: user.panNumber,
      kycStatus: user.kycStatus,
      kycData: user.kycData,
      isOneTimePassword: !!user.isOneTimePassword,
      token: generateToken(user._id, user.role),
    };

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set Permanent Password after OTP login
// @route   POST /api/auth/set-permanent-password
// @access  Public / Private
export const setPermanentPassword = async (req, res) => {
  try {
    const { userId, newPassword, confirmPassword } = req.body;
    const targetUserId = req.user?._id || userId;

    if (!targetUserId) {
      return res.status(401).json({ message: 'User identifier missing. Please log in first.' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New permanent password must be at least 6 characters long.' });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirm password do not match.' });
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    // Update to new permanent password & invalidate one-time password
    user.password = newPassword;
    user.isOneTimePassword = false;
    await user.save();

    // Return updated user profile
    const updatedUser = await User.findById(targetUserId).select('-password');
    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Permanent password created successfully! Your temporary OTP has been invalidated.',
      user: {
        ...updatedUser.toObject(),
        isOneTimePassword: false,
        token
      }
    });
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
    await User.deleteMany({});    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@lifefundAI.com',
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
      email: 'alex@lifefundAI.com',
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
      email: 'sarah@lifefundAI.com',
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
      email: 'david@lifefundAI.com',
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
      message: 'lifefundAI Demo Distributors seeded successfully!',
      accounts: {
        admin: { email: 'admin@lifefundAI.com', password: 'Admin@123456', role: 'admin' },
        customer: { email: 'alex@lifefundAI.com', password: 'User@123456', role: 'customer' },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
