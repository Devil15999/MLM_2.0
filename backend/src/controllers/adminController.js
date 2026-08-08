import { User } from '../models/User.js';
import { Approval } from '../models/Approval.js';

// @desc    Get All Pending Admin Approvals (Commission & Network requests)
// @route   GET /api/admin/approvals
export const getPendingApprovals = async (req, res) => {
  try {
    const approvals = await Approval.find().populate('userId').sort({ createdAt: -1 });
    res.json({ success: true, count: approvals.length, approvals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve Commission / Registration Request
// @route   POST /api/admin/approvals/:id/approve
export const approveCommissionRequest = async (req, res) => {
  try {
    const approval = await Approval.findById(req.params.id);
    if (!approval) {
      return res.status(404).json({ message: 'Approval request not found.' });
    }

    if (approval.status === 'Approved') {
      return res.status(400).json({ message: 'Request is already approved.' });
    }

    approval.status = 'Approved';
    approval.actionDate = new Date();
    await approval.save();

    // 1. Find Level 1 Sponsor
    let sponsorUser = null;
    if (approval.sponsorId) {
      sponsorUser = await User.findById(approval.sponsorId).catch(() => null);
      if (!sponsorUser) {
        sponsorUser = await User.findOne({
          $or: [
            { sponsorId: approval.sponsorId },
            { email: approval.sponsorId }
          ]
        }).catch(() => null);
      }
    }
    if (!sponsorUser && approval.sponsorName) {
      sponsorUser = await User.findOne({
        $or: [
          { name: approval.sponsorName },
          { email: approval.sponsorName }
        ]
      }).catch(() => null);
    }
    if (!sponsorUser) {
      sponsorUser = await User.findOne({
        $or: [
          { email: 'dev2@gmail.com' },
          { sponsorId: 'SP-dev2-3997' },
          { role: 'admin' }
        ]
      });
    }

    // 2. Activate Enrolled User and Set Parent Sponsor References
    let enrolledUser = null;
    if (approval.userId) {
      enrolledUser = await User.findById(approval.userId).catch(() => null);
    }
    if (!enrolledUser && (approval.enrolledMemberEmail || approval.enrolledMemberName)) {
      enrolledUser = await User.findOne({
        $or: [
          { email: approval.enrolledMemberEmail },
          { name: approval.enrolledMemberName }
        ]
      }).catch(() => null);
    }

    if (enrolledUser) {
      enrolledUser.accountStatus = 'Approved';
      if (sponsorUser) {
        enrolledUser.parentSponsorId = sponsorUser._id;
        enrolledUser.parentSponsorCode = sponsorUser.sponsorId;
        enrolledUser.parentSponsorEmail = sponsorUser.email;
      }
      await enrolledUser.save();
    }

    // 3. Calculate Level 1 Commission (10% of Enrolled Member's Package)
    const packagePrices = {
      'Starter Package (₹10,000)': 10000,
      'Premium Package (₹20,000)': 20000,
      'Elite Package (₹30,000)': 30000,
      'Starter Package': 10000,
      'Premium Package': 20000,
      'Elite Package': 30000,
    };

    let packagePrice = packagePrices[approval.packageName] || 10000;
    if (!packagePrices[approval.packageName] && approval.packageName) {
      if (approval.packageName.includes('30,000') || approval.packageName.toLowerCase().includes('elite')) packagePrice = 30000;
      else if (approval.packageName.includes('20,000') || approval.packageName.toLowerCase().includes('premium')) packagePrice = 20000;
      else packagePrice = 10000;
    }

    const l1Commission = approval.commissionAmount || (packagePrice * 0.10); // Direct 10% of Package for Level 1 sponsor
    const l2Commission = 500; // Flat ₹500 Override for Level 2 sponsor (irrespective of package)

    if (sponsorUser) {
      // Credit Direct Level 1 Sponsor (10% of package)
      sponsorUser.level1AffiliateIncome = (sponsorUser.level1AffiliateIncome || 0) + l1Commission;
      sponsorUser.walletBalance = (sponsorUser.walletBalance || 0) + l1Commission;
      sponsorUser.totalIncome = (sponsorUser.totalIncome || 0) + l1Commission;
      sponsorUser.totalEarnings = (sponsorUser.totalEarnings || 0) + l1Commission;
      sponsorUser.level1MembersCount = (sponsorUser.level1MembersCount || 0) + 1;
      sponsorUser.downlineCount = (sponsorUser.level1MembersCount || 0) + (sponsorUser.level2MembersCount || 0);
      await sponsorUser.save();

      // 4. Credit Indirect Level 2 Sponsor (Flat ₹500 override bonus)
      let l2Sponsor = null;
      if (sponsorUser.parentSponsorId) {
        l2Sponsor = await User.findById(sponsorUser.parentSponsorId).catch(() => null);
      }
      if (!l2Sponsor && sponsorUser.parentSponsorCode) {
        l2Sponsor = await User.findOne({
          $or: [
            { sponsorId: sponsorUser.parentSponsorCode },
            { email: sponsorUser.parentSponsorEmail }
          ]
        }).catch(() => null);
      }

      if (l2Sponsor) {
        l2Sponsor.level2AffiliateIncome = (l2Sponsor.level2AffiliateIncome || 0) + l2Commission;
        l2Sponsor.walletBalance = (l2Sponsor.walletBalance || 0) + l2Commission;
        l2Sponsor.totalIncome = (l2Sponsor.totalIncome || 0) + l2Commission;
        l2Sponsor.totalEarnings = (l2Sponsor.totalEarnings || 0) + l2Commission;
        l2Sponsor.level2MembersCount = (l2Sponsor.level2MembersCount || 0) + 1;
        l2Sponsor.downlineCount = (l2Sponsor.level1MembersCount || 0) + (l2Sponsor.level2MembersCount || 0);
        await l2Sponsor.save();
      }
      // Note: Level 3+ sponsors (Great-Grandparent Upline and beyond) receive NOTHING (₹0). Max levels is 2.
    }

    res.json({
      success: true,
      message: `Approved enrollment for ${approval.enrolledMemberName}. Credited ₹${l1Commission} (10%) to Direct L1 sponsor and ₹${l2Commission} to Indirect L2 sponsor.`,
      approval,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject Commission Request
// @route   POST /api/admin/approvals/:id/reject
export const rejectCommissionRequest = async (req, res) => {
  try {
    const approval = await Approval.findById(req.params.id);
    if (!approval) {
      return res.status(404).json({ message: 'Approval request not found.' });
    }

    approval.status = 'Rejected';
    approval.actionDate = new Date();
    await approval.save();

    if (approval.enrolledMemberEmail || approval.enrolledMemberName) {
      let enrolledUser = await User.findOne({
        $or: [
          { email: approval.enrolledMemberEmail },
          { name: approval.enrolledMemberName }
        ]
      });
      if (enrolledUser) {
        enrolledUser.accountStatus = 'Rejected';
        await enrolledUser.save();
      }
    }

    res.json({
      success: true,
      message: `Rejected commission request for ${approval.enrolledMemberName}.`,
      approval,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Database (Clear all users and approvals except Admin and Fresh User)
// @route   POST /api/admin/reset-database
export const resetDatabaseEndpoint = async (req, res) => {
  try {
    const approvalDeleteResult = await Approval.deleteMany({});
    const userDeleteResult = await User.deleteMany({
      email: { $nin: ['admin@nexismlm.com', 'fresh@nexismlm.com'] }
    });

    let freshUser = await User.findOne({ email: 'fresh@nexismlm.com' });
    if (freshUser) {
      freshUser.rank = 'Member';
      freshUser.selectedPackage = 'None';
      freshUser.walletBalance = 0.00;
      freshUser.totalEarnings = 0.00;
      freshUser.downlineCount = 0;
      freshUser.level1MembersCount = 0;
      freshUser.level2MembersCount = 0;
      freshUser.level1AffiliateIncome = 0.00;
      freshUser.level2AffiliateIncome = 0.00;
      freshUser.investmentReturns = 0.00;
      freshUser.totalIncome = 0.00;
      await freshUser.save();
    }

    res.json({
      success: true,
      message: 'Database reset successfully. Only Admin and Fresh User remain.',
      deletedApprovals: approvalDeleteResult.deletedCount,
      deletedTestUsers: userDeleteResult.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
