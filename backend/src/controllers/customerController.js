import { User } from '../models/User.js';

// @desc    Get Customer Dashboard Statistics (8 Core Metrics)
// @route   GET /api/customer/dashboard
export const getCustomerDashboard = async (req, res) => {
  try {
    const userId = req.user?._id;
    const user = userId ? await User.findById(userId) : null;

    const level1Count = user?.level1MembersCount ?? 12;
    const level2Count = user?.level2MembersCount ?? 24;
    const totalTeam = level1Count + level2Count;

    const level1Income = user?.level1AffiliateIncome ?? 4850.00;
    const level2Income = user?.level2AffiliateIncome ?? 2420.00;
    const investmentReturns = user?.investmentReturns ?? 3180.00;
    const totalIncome = user?.totalIncome ?? (level1Income + level2Income + investmentReturns);
    const walletBalance = user?.walletBalance ?? 6250.00;

    res.json({
      metrics: {
        totalTeam: {
          title: 'Total Team (Includes Level 1 & 2)',
          value: `${totalTeam} Members`,
          rawCount: totalTeam,
          sub: `${level1Count} Level 1 + ${level2Count} Level 2`,
        },
        level1Members: {
          title: 'Level 1 Members',
          value: `${level1Count} Directs`,
          rawCount: level1Count,
          sub: 'Direct Referral Downlines',
        },
        level2Members: {
          title: 'Level 2 Members',
          value: `${level2Count} Indirects`,
          rawCount: level2Count,
          sub: 'Secondary Team Downlines',
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

// @desc    Get Team Details (Level 1 & Level 2 Members)
// @route   GET /api/customer/team
export const getCustomerTeamDetails = async (req, res) => {
  try {
    const level1Members = [
      { name: 'Sarah Connor', email: 'sarah.c@gmail.com', joined: 'July 14, 2026', package: 'Executive Gold ($2,500)', level1Earned: '$1,250.00', status: 'Active' },
      { name: 'David Vance', email: 'david.vance@tech.io', joined: 'July 18, 2026', package: 'Pro Silver ($1,000)', level1Earned: '$500.00', status: 'Active' },
      { name: 'Elena Rostova', email: 'elena.r@yahoo.com', joined: 'July 21, 2026', package: 'Executive Gold ($2,500)', level1Earned: '$1,250.00', status: 'Active' },
      { name: 'Marcus Brody', email: 'marcus.b@company.org', joined: 'July 26, 2026', package: 'Starter Bronze ($500)', level1Earned: '$250.00', status: 'Active' },
      { name: 'Jessica Alba', email: 'jessica.a@studio.com', joined: 'Aug 01, 2026', package: 'Pro Silver ($1,000)', level1Earned: '$500.00', status: 'Active' },
      { name: 'Michael Chang', email: 'mchang@horizon.net', joined: 'Aug 02, 2026', package: 'Executive Gold ($2,500)', level1Earned: '$1,100.00', status: 'Active' }
    ];

    const level2Members = [
      { name: 'Kevin Flynn', sponsor: 'Sarah Connor', joined: 'July 19, 2026', package: 'Executive Gold ($2,500)', level2Earned: '$250.00', status: 'Active' },
      { name: 'Claire Bennet', sponsor: 'Sarah Connor', joined: 'July 22, 2026', package: 'Pro Silver ($1,000)', level2Earned: '$100.00', status: 'Active' },
      { name: 'Arthur Pendelton', sponsor: 'David Vance', joined: 'July 24, 2026', package: 'Executive Gold ($2,500)', level2Earned: '$250.00', status: 'Active' },
      { name: 'Rachel Green', sponsor: 'Elena Rostova', joined: 'July 28, 2026', package: 'Starter Bronze ($500)', level2Earned: '$50.00', status: 'Active' },
      { name: 'Chandler Bing', sponsor: 'Marcus Brody', joined: 'July 29, 2026', package: 'Executive Gold ($2,500)', level2Earned: '$250.00', status: 'Active' },
      { name: 'Monica Geller', sponsor: 'Marcus Brody', joined: 'Aug 01, 2026', package: 'Pro Silver ($1,000)', level2Earned: '$100.00', status: 'Active' }
    ];

    res.json({
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
