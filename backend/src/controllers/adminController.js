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

    // 3. Credit Level 1 Sponsor & Update Metrics
    const commAmount = Number(approval.commissionAmount || 0) || 1000;
    if (sponsorUser) {
      sponsorUser.level1AffiliateIncome = (sponsorUser.level1AffiliateIncome || 0) + commAmount;
      sponsorUser.walletBalance = (sponsorUser.walletBalance || 0) + commAmount;
      sponsorUser.totalIncome = (sponsorUser.totalIncome || 0) + commAmount;
      sponsorUser.totalEarnings = (sponsorUser.totalEarnings || 0) + commAmount;
      sponsorUser.level1MembersCount = (sponsorUser.level1MembersCount || 0) + 1;
      sponsorUser.downlineCount = (sponsorUser.level1MembersCount || 0) + (sponsorUser.level2MembersCount || 0);
      await sponsorUser.save();

      // 4. Find Level 2 Sponsor and Credit Level 2 Metrics
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
        const l2Comm = 500;
        l2Sponsor.level2AffiliateIncome = (l2Sponsor.level2AffiliateIncome || 0) + l2Comm;
        l2Sponsor.walletBalance = (l2Sponsor.walletBalance || 0) + l2Comm;
        l2Sponsor.totalIncome = (l2Sponsor.totalIncome || 0) + l2Comm;
        l2Sponsor.totalEarnings = (l2Sponsor.totalEarnings || 0) + l2Comm;
        l2Sponsor.level2MembersCount = (l2Sponsor.level2MembersCount || 0) + 1;
        l2Sponsor.downlineCount = (l2Sponsor.level1MembersCount || 0) + (l2Sponsor.level2MembersCount || 0);
        await l2Sponsor.save();
      }
    }

    res.json({
      success: true,
      message: `Approved enrollment request for ${approval.enrolledMemberName}. Activated account and updated Level 1 & Level 2 team metrics!`,
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
