import { User } from '../models/User.js';
import { Approval } from '../models/Approval.js';
import bcrypt from 'bcryptjs';

// @desc    Get Customer Dashboard Statistics (8 Core Metrics - 2 Nodes, 2 Max Levels)
// @route   GET /api/customer/dashboard
export const getCustomerDashboard = async (req, res) => {
  try {
    const userId = req.user?._id;
    const user = userId ? await User.findById(userId) : null;

    const isAlex = user?.email === 'alex@nexismlm.com';
    const level1Count = user ? (user.level1MembersCount || 0) : (isAlex ? 2 : 0);
    const level2Count = user ? (user.level2MembersCount || 0) : (isAlex ? 4 : 0);
    const totalTeam = level1Count + level2Count;

    const level1Income = user ? (user.level1AffiliateIncome || 0) : (isAlex ? 4850.00 : 0);
    const level2Income = user ? (user.level2AffiliateIncome || 0) : (isAlex ? 2420.00 : 0);
    const investmentReturns = user ? (user.investmentReturns || 0) : (isAlex ? 3180.00 : 0);
    const totalIncome = user ? (user.totalIncome || 0) : (isAlex ? 10450.00 : 0);
    const walletBalance = user ? (user.walletBalance || 0) : (isAlex ? 6250.00 : 0);

    res.json({
      metrics: {
        totalTeam: {
          title: 'Total Team (Includes Level 1 & 2)',
          value: `${totalTeam} Members`,
          rawCount: totalTeam,
          sub: `${level1Count} Level 1 (Max 2) + ${level2Count} Level 2 (Max 4)`,
        },
        level1Members: {
          title: 'Level 1 Members',
          value: `${level1Count} Nodes (Max 2)`,
          rawCount: level1Count,
          sub: 'Direct Child Nodes (Left & Right Leg)',
        },
        level2Members: {
          title: 'Level 2 Members',
          value: `${level2Count} Nodes (Max 4)`,
          rawCount: level2Count,
          sub: 'Secondary Downline Nodes (Max Level 2)',
        },
        level1AffiliateIncome: {
          title: 'Level 1 Affiliate Income',
          value: `$${level1Income.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          rawAmount: level1Income,
          sub: 'Direct Referral Bonus',
        },
        level2AffiliateIncome: {
          title: 'Level 2 Affiliate Income',
          value: `$${level2Income.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          rawAmount: level2Income,
          sub: 'Indirect Override Bonus',
        },
        investmentReturns: {
          title: 'Investment Returns',
          value: `$${investmentReturns.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          rawAmount: investmentReturns,
          sub: 'Package Passive Yield ROI',
        },
        totalIncome: {
          title: 'Total Income',
          value: `$${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          rawAmount: totalIncome,
          sub: 'Cumulative Lifetime Earnings',
        },
        wallet: {
          title: 'Wallet',
          value: `$${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          rawAmount: walletBalance,
          sub: 'Available Withdrawable Balance',
        },
      },
      userSummary: {
        name: user?.name || 'Alex Rivera',
        rank: user?.rank || 'Gold Executive',
        sponsorId: user?.sponsorId || 'SP-1001',
        maxLevels: 2,
        maxDirectNodes: 2,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Distributor Profile
// @route   PUT /api/customer/profile
export const updateCustomerProfile = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User authorization required' });
    }

    const { name, phone, address, city, country } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Distributor not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (city) user.city = city;
    if (country) user.country = country;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        country: user.country,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update KYC Information
// @route   POST /api/customer/kyc
export const updateCustomerKYC = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { documentType, documentNumber, bankName, accountNumber, ifscCode, upiId } = req.body;

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.kycStatus = 'Under Review';
        user.kycData = {
          documentType: documentType || user.kycData?.documentType,
          documentNumber: documentNumber || user.kycData?.documentNumber,
          bankName: bankName || user.kycData?.bankName,
          accountNumber: accountNumber || user.kycData?.accountNumber,
          ifscCode: ifscCode || user.kycData?.ifscCode,
          upiId: upiId || user.kycData?.upiId,
        };
        await user.save();
      }
    }

    res.json({
      success: true,
      message: 'KYC documents submitted successfully. Verification status set to Under Review.',
      kycStatus: 'Under Review',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Product Investment Packages
// @route   GET /api/customer/packages
export const getCustomerPackages = async (req, res) => {
  try {
    const packages = [
      { id: 'pkg-1', name: 'Bronze Starter', price: '$500', dailyRoi: '0.8%', duration: '200 Days', level1Comm: '10%', level2Comm: '5%', totalReturn: '$800', status: 'Available' },
      { id: 'pkg-2', name: 'Silver Pro', price: '$1,000', dailyRoi: '1.0%', duration: '200 Days', level1Comm: '12%', level2Comm: '6%', totalReturn: '$2,000', status: 'Active Package' },
      { id: 'pkg-3', name: 'Gold Executive', price: '$2,500', dailyRoi: '1.25%', duration: '200 Days', level1Comm: '15%', level2Comm: '8%', totalReturn: '$6,250', status: 'Active Package' },
      { id: 'pkg-4', name: 'Diamond VIP', price: '$5,000', dailyRoi: '1.5%', duration: '200 Days', level1Comm: '18%', level2Comm: '10%', totalReturn: '$15,000', status: 'Available' }
    ];

    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Team Details (Level 1: 2 Nodes, Level 2: 4 Nodes, Max 2 Levels)
// @route   GET /api/customer/team
export const getCustomerTeamDetails = async (req, res) => {
  try {
    const userId = req.user?._id;
    let downlines = [];
    if (userId) {
      downlines = await User.find({ sponsorId: userId });
    }

    const level1Members = downlines.filter(u => u.legPreference?.includes('Left') || u.legPreference?.includes('Right'));
    const level2Members = downlines.filter(u => u.legPreference?.includes('L2'));

    res.json({
      maxLevels: 2,
      maxLevel1Nodes: 2,
      level1MembersCount: level1Members.length,
      level2MembersCount: level2Members.length,
      totalTeamCount: level1Members.length + level2Members.length,
      level1Members,
      level2Members,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit Wallet Withdrawal Request
// @route   POST /api/customer/wallet/withdraw
export const requestWalletWithdrawal = async (req, res) => {
  try {
    const { amount, method } = req.body;
    if (!amount || Number(amount) < 50) {
      return res.status(400).json({ message: 'Minimum withdrawal amount is $50' });
    }

    res.json({
      success: true,
      message: `Withdrawal request of $${Number(amount).toFixed(2)} via ${method || 'Bank Account'} submitted successfully!`,
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll a New Member into a Tree Node Slot
// @route   POST /api/customer/team/enroll
export const enrollDownlineMember = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { memberName, memberEmail, position, packageName } = req.body;

    if (!memberName || !position || !packageName) {
      return res.status(400).json({ message: 'Please provide member name, leg position, and package.' });
    }

    const emailToUse = memberEmail || `${memberName.toLowerCase().replace(/\s+/g, '.')}@example.com`;

    // 1. Generate Dynamic One-Time Password (OTP)
    const dynamicOtp = `Nexis#${Math.floor(1000 + Math.random() * 9000)}`;

    // 2. Create or Update User Account in DB for the enrolled downline
    let newEnrolledUser = await User.findOne({ email: emailToUse });
    if (!newEnrolledUser) {
      newEnrolledUser = await User.create({
        name: memberName,
        email: emailToUse,
        password: dynamicOtp,
        isOneTimePassword: true,
        sponsorId: req.user?.sponsorId || 'SP-2000',
        rank: packageName.includes('Gold') ? 'Gold' : (packageName.includes('Silver') ? 'Silver' : 'Member'),
        selectedPackage: packageName,
        legPreference: position.includes('Left') ? 'Left Leg' : 'Right Leg',
        walletBalance: 0.00,
        totalEarnings: 0.00,
        downlineCount: 0,
        level1MembersCount: 0,
        level2MembersCount: 0,
        level1AffiliateIncome: 0.00,
        level2AffiliateIncome: 0.00,
        investmentReturns: 0.00,
        totalIncome: 0.00,
      });
    } else {
      newEnrolledUser.password = dynamicOtp;
      newEnrolledUser.isOneTimePassword = true;
      await newEnrolledUser.save();
    }

    // 3. Determine package commission amount
    const packagePrices = {
      'Bronze Starter ($500)': 500,
      'Silver Pro ($1,000)': 1000,
      'Gold Executive ($2,500)': 2500,
      'Diamond VIP ($5,000)': 5000,
    };
    const price = packagePrices[packageName] || 1000;
    const isLevel1 = position.includes('Node 1') || position === 'Left Leg' || position === 'Right Leg' || !position.includes('L2');
    const commRate = isLevel1 ? 0.10 : 0.05;
    const commAmount = price * commRate;

    // 4. Update sponsor's tree count (wallet remains pending until Admin Approval)
    let sponsorUser = null;
    if (userId) {
      sponsorUser = await User.findById(userId);
      if (sponsorUser) {
        if (isLevel1) {
          sponsorUser.level1MembersCount = (sponsorUser.level1MembersCount || 0) + 1;
        } else {
          sponsorUser.level2MembersCount = (sponsorUser.level2MembersCount || 0) + 1;
        }
        sponsorUser.downlineCount = (sponsorUser.level1MembersCount || 0) + (sponsorUser.level2MembersCount || 0);
        await sponsorUser.save();
      }
    }

    // 5. Create Pending Commission Approval Record for Admin Panel
    const approval = await Approval.create({
      type: 'Enrolled Downline Commission',
      sponsorId: userId || sponsorUser?._id || newEnrolledUser._id,
      sponsorName: sponsorUser?.name || 'Sponsor',
      enrolledMemberName: memberName,
      enrolledMemberEmail: emailToUse,
      position,
      packageName,
      commissionAmount: commAmount,
      status: 'Pending',
    });

    res.json({
      success: true,
      message: `Successfully enrolled ${memberName} into ${position}. Commission of $${commAmount.toFixed(2)} sent to Admin Panel for approval!`,
      dynamicOtp,
      approvalId: approval._id,
      approvalStatus: 'Pending Admin Approval',
      commissionPending: `$${commAmount.toFixed(2)}`,
      newNode: {
        name: memberName,
        email: emailToUse,
        position,
        package: packageName,
        status: 'Active',
        joined: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      },
      updatedStats: sponsorUser ? {
        level1MembersCount: sponsorUser.level1MembersCount,
        level2MembersCount: sponsorUser.level2MembersCount,
        totalTeamCount: sponsorUser.downlineCount,
        walletBalance: sponsorUser.walletBalance
      } : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Activate Product Package for User
// @route   POST /api/customer/packages/activate
export const activateUserPackage = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { packageName } = req.body;

    if (!packageName) {
      return res.status(400).json({ message: 'Package name is required.' });
    }

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.selectedPackage = packageName;
        if (packageName.includes('Gold')) user.rank = 'Gold';
        else if (packageName.includes('Silver')) user.rank = 'Silver';
        else if (packageName.includes('Diamond')) user.rank = 'Diamond';
        else user.rank = 'Member';
        await user.save();
      }
    }

    res.json({
      success: true,
      message: `Package ${packageName} activated successfully!`,
      selectedPackage: packageName,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Customer Commission Notifications & Approval Activity
// @route   GET /api/customer/notifications
export const getCustomerNotifications = async (req, res) => {
  try {
    const userId = req.user?._id;
    let query = {};

    if (userId) {
      query.sponsorId = userId;
    }

    let notifications = await Approval.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
