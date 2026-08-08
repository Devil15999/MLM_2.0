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
          title: 'Total Network Team',
          value: `${totalTeam} Members`,
          rawCount: totalTeam,
          sub: `${level1Count} Direct Level 1 + ${level2Count} Indirect Level 2`,
        },
        level1Members: {
          title: 'Direct Level 1 Members',
          value: `${level1Count} Members (Unlimited)`,
          rawCount: level1Count,
          sub: 'Directly Enrolled Downline Network',
        },
        level2Members: {
          title: 'Indirect Level 2 Members',
          value: `${level2Count} Members`,
          rawCount: level2Count,
          sub: 'Enrolled by your Direct Level 1 Downlines',
        },
        level1AffiliateIncome: {
          title: 'Level 1 Direct Bonus',
          value: `₹${level1Income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          rawAmount: level1Income,
          sub: 'Direct Referral Commission (10%)',
        },
        level2AffiliateIncome: {
          title: 'Level 2 Override Bonus',
          value: `₹${level2Income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          rawAmount: level2Income,
          sub: 'Indirect Override Commission (₹500)',
        },
        investmentReturns: {
          title: 'Investment Returns',
          value: `₹${investmentReturns.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          rawAmount: investmentReturns,
          sub: 'Package Daily ROI Yield',
        },
        totalIncome: {
          title: 'Total Earnings',
          value: `₹${totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          rawAmount: totalIncome,
          sub: 'Cumulative Lifetime Earnings',
        },
        wallet: {
          title: 'Wallet Balance',
          value: `₹${walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          rawAmount: walletBalance,
          sub: 'Available Withdrawable Funds',
        },
      },
      userSummary: {
        name: user?.name || 'Alex Rivera',
        rank: user?.rank || 'Gold Executive',
        sponsorId: user?.sponsorId || 'SP-1001',
        maxLevels: 2,
        maxDirectNodes: 'Unlimited',
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
      {
        id: 'pkg-1',
        name: 'Starter Package',
        price: '₹10,000',
        gst: '₹1,800 (18% GST)',
        processingFee: '₹200 (2% Processing)',
        totalPrice: '₹12,000',
        dailyRoi: '1%',
        level1Comm: '₹1,000 (10%)',
        level2Comm: '₹500',
        maxReturn: '40% (per month)',
        status: 'Available'
      },
      {
        id: 'pkg-2',
        name: 'Premium Package',
        price: '₹20,000',
        gst: '₹3,600 (18% GST)',
        processingFee: '₹400 (2% Processing)',
        totalPrice: '₹24,000',
        dailyRoi: '1%',
        level1Comm: '₹2,000 (10%)',
        level2Comm: '₹500',
        maxReturn: '40% (per month)',
        status: 'Active Package'
      },
      {
        id: 'pkg-3',
        name: 'Elite Package',
        price: '₹30,000',
        gst: '₹5,400 (18% GST)',
        processingFee: '₹600 (2% Processing)',
        totalPrice: '₹36,000',
        dailyRoi: '1%',
        level1Comm: '₹3,000 (10%)',
        level2Comm: '₹500',
        maxReturn: '40% (per month)',
        status: 'Available'
      }
    ];

    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Team Details (Level 1: Direct, Level 2: Indirect)
// @route   GET /api/customer/team
// @desc    Get Team Details (Level 1: Direct, Level 2: Indirect)
// @route   GET /api/customer/team
// @desc    Get Team Details (Level 1: Direct, Level 2: Indirect)
// @route   GET /api/customer/team
export const getCustomerTeamDetails = async (req, res) => {
  try {
    const user = req.user;
    let level1Members = [];
    let level2Members = [];

    if (user) {
      const uId = user._id ? user._id.toString() : null;
      const uSponsorId = user.sponsorId || null;
      const uEmail = user.email || null;
      const uName = user.name || null;

      // 1. Direct Level 1 downlines sponsored by this user
      level1Members = await User.find({
        $or: [
          ...(user._id ? [{ parentSponsorId: user._id }, { parentSponsorId: uId }, { sponsorId: uId }] : []),
          ...(uSponsorId ? [{ parentSponsorCode: uSponsorId }, { sponsorId: uSponsorId }] : []),
          ...(uEmail ? [{ parentSponsorEmail: uEmail }, { sponsorId: uEmail }] : [])
        ]
      }).select('-password');

      // Also check Approvals created by this user as sponsor
      const l1Approvals = await Approval.find({
        $or: [
          ...(uId ? [{ sponsorId: uId }] : []),
          ...(uSponsorId ? [{ sponsorId: uSponsorId }] : []),
          ...(uEmail ? [{ sponsorId: uEmail }] : []),
          ...(uName ? [{ sponsorName: uName }] : [])
        ]
      });

      const l1EmailsFromApprovals = l1Approvals.map(a => a.enrolledMemberEmail).filter(Boolean);
      if (l1EmailsFromApprovals.length > 0) {
        const extraL1Users = await User.find({ email: { $in: l1EmailsFromApprovals } }).select('-password');
        const existingL1Ids = new Set(level1Members.map(m => m._id.toString()));
        for (const extra of extraL1Users) {
          if (!existingL1Ids.has(extra._id.toString())) {
            level1Members.push(extra);
            // Auto-heal missing parentSponsor references
            if (!extra.parentSponsorId && user._id) {
              extra.parentSponsorId = user._id;
              extra.parentSponsorCode = user.sponsorId;
              extra.parentSponsorEmail = user.email;
              await extra.save().catch(() => null);
            }
          }
        }
      }

      // Collect identifiers for all Level 1 members
      const l1ObjectIds = level1Members.map(u => u._id);
      const l1UserStrIds = level1Members.map(u => u._id.toString());
      const l1SponsorCodes = level1Members.map(u => u.sponsorId).filter(Boolean);
      const l1Emails = level1Members.map(u => u.email).filter(Boolean);
      const l1Names = level1Members.map(u => u.name).filter(Boolean);

      const allL1IdMatches = [...l1ObjectIds, ...l1UserStrIds];

      if (allL1IdMatches.length > 0 || l1SponsorCodes.length > 0 || l1Emails.length > 0 || l1Names.length > 0) {
        // 2. Level 2 downlines sponsored by any Level 1 member
        level2Members = await User.find({
          $or: [
            ...(allL1IdMatches.length > 0 ? [{ parentSponsorId: { $in: allL1IdMatches } }, { sponsorId: { $in: allL1IdMatches } }] : []),
            ...(l1SponsorCodes.length > 0 ? [{ parentSponsorCode: { $in: l1SponsorCodes } }, { sponsorId: { $in: l1SponsorCodes } }] : []),
            ...(l1Emails.length > 0 ? [{ parentSponsorEmail: { $in: l1Emails } }, { sponsorId: { $in: l1Emails } }] : [])
          ]
        }).select('-password');

        // Also check Approvals sponsored by any Level 1 member
        const l2Approvals = await Approval.find({
          $or: [
            ...(allL1IdMatches.length > 0 ? [{ sponsorId: { $in: allL1IdMatches } }] : []),
            ...(l1SponsorCodes.length > 0 ? [{ sponsorId: { $in: l1SponsorCodes } }] : []),
            ...(l1Emails.length > 0 ? [{ sponsorId: { $in: l1Emails } }] : []),
            ...(l1Names.length > 0 ? [{ sponsorName: { $in: l1Names } }] : [])
          ]
        });

        const l2EmailsFromApprovals = l2Approvals.map(a => a.enrolledMemberEmail).filter(Boolean);
        if (l2EmailsFromApprovals.length > 0) {
          const extraL2Users = await User.find({ email: { $in: l2EmailsFromApprovals } }).select('-password');
          const existingL2Ids = new Set(level2Members.map(m => m._id.toString()));
          for (const extra of extraL2Users) {
            if (!existingL2Ids.has(extra._id.toString())) {
              level2Members.push(extra);
            }
          }
        }
      }

      // Sync member counts on user document if updated
      if (user.level1MembersCount !== level1Members.length || user.level2MembersCount !== level2Members.length) {
        user.level1MembersCount = level1Members.length;
        user.level2MembersCount = level2Members.length;
        user.downlineCount = level1Members.length + level2Members.length;
        await user.save().catch(() => null);
      }
    }

    res.json({
      maxLevels: 2,
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

    // 2. Generate unique Sponsor ID for the new downline member
    const namePrefix = memberName.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '') || 'user';
    const randCode = Math.floor(1000 + Math.random() * 9000);
    let ownSponsorId = `SP-${namePrefix}-${randCode}`;

    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 30) {
      const existing = await User.findOne({ sponsorId: ownSponsorId });
      if (!existing) {
        isUnique = true;
      } else {
        attempts++;
        ownSponsorId = `SP-${namePrefix}-${randCode + attempts}`;
      }
    }

    // 3. Create or Update User Account in DB for the enrolled downline
    let newEnrolledUser = await User.findOne({ email: emailToUse });
    if (!newEnrolledUser) {
      newEnrolledUser = await User.create({
        name: memberName,
        email: emailToUse,
        password: dynamicOtp,
        isOneTimePassword: true,
        accountStatus: 'Pending Admin Approval',
        sponsorId: ownSponsorId,
        parentSponsorId: req.user?._id,
        parentSponsorCode: req.user?.sponsorId,
        parentSponsorEmail: req.user?.email,
        rank: packageName.includes('Elite') ? 'Platinum' : (packageName.includes('Premium') ? 'Silver' : 'Member'),
        selectedPackage: packageName,
        legPreference: 'Direct Level 1',
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
      newEnrolledUser.accountStatus = 'Pending Admin Approval';
      newEnrolledUser.parentSponsorId = req.user?._id;
      newEnrolledUser.parentSponsorCode = req.user?.sponsorId;
      newEnrolledUser.parentSponsorEmail = req.user?.email;
      await newEnrolledUser.save();
    }

    // 3. Determine package commission amount
    const packagePrices = {
      'Starter Package (₹10,000)': 10000,
      'Premium Package (₹20,000)': 20000,
      'Elite Package (₹30,000)': 30000,
      'Starter Package': 10000,
      'Premium Package': 20000,
      'Elite Package': 30000,
    };
    const price = packagePrices[packageName] || 20000;
    const isLevel1 = position.includes('Node 1') || position === 'Left Leg' || position === 'Right Leg' || !position.includes('L2');
    const level1BonusMap = {
      'Starter Package (₹10,000)': 1000,
      'Premium Package (₹20,000)': 2000,
      'Elite Package (₹30,000)': 3000,
      'Starter Package': 1000,
      'Premium Package': 2000,
      'Elite Package': 3000,
    };
    const commAmount = isLevel1 ? (level1BonusMap[packageName] || (price * 0.10)) : 500;

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

    // 5. Create Pending Downline Enrollment Approval Record for Admin Panel
    const approval = await Approval.create({
      type: 'Enrolled Downline Commission',
      userId: newEnrolledUser._id,
      sponsorId: userId || sponsorUser?._id,
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
        if (packageName.includes('Elite')) user.rank = 'Elite';
        else if (packageName.includes('Premium')) user.rank = 'Premium';
        else if (packageName.includes('Starter')) user.rank = 'Starter';
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
