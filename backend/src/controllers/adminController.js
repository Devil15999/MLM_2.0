import { User } from '../models/User.js';
import { Approval } from '../models/Approval.js';

// @desc    Get All Pending Admin Approvals (Commission & Network requests)
// @route   GET /api/admin/approvals
export const getPendingApprovals = async (req, res) => {
  try {
    const approvals = await Approval.find().sort({ createdAt: -1 });
    res.json({ success: true, count: approvals.length, approvals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve Commission Request & Credit Sponsor Wallet
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

    // Mark approval status
    approval.status = 'Approved';
    approval.actionDate = new Date();
    await approval.save();

    // Credit Sponsor Wallet
    let sponsorUser = null;
    if (approval.sponsorId) {
      sponsorUser = await User.findById(approval.sponsorId).catch(() => null);
    }
    if (!sponsorUser && approval.sponsorName) {
      sponsorUser = await User.findOne({ name: approval.sponsorName });
    }
    if (!sponsorUser) {
      sponsorUser = await User.findOne({ email: 'fresh@nexismlm.com' });
    }

    if (sponsorUser) {
      const isLevel1 = approval.position.includes('Node 1') || approval.position === 'Left Leg' || approval.position === 'Right Leg' || !approval.position.includes('L2');
      if (isLevel1) {
        sponsorUser.level1AffiliateIncome = (sponsorUser.level1AffiliateIncome || 0) + approval.commissionAmount;
      } else {
        sponsorUser.level2AffiliateIncome = (sponsorUser.level2AffiliateIncome || 0) + approval.commissionAmount;
      }
      sponsorUser.walletBalance = (sponsorUser.walletBalance || 0) + approval.commissionAmount;
      sponsorUser.totalIncome = (sponsorUser.totalIncome || 0) + approval.commissionAmount;
      sponsorUser.totalEarnings = (sponsorUser.totalEarnings || 0) + approval.commissionAmount;
      await sponsorUser.save();
    }

    // Activate Enrolled Member Account Status so they can log in
    if (approval.enrolledMemberEmail || approval.enrolledMemberName) {
      let enrolledUser = await User.findOne({
        $or: [
          { email: approval.enrolledMemberEmail },
          { name: approval.enrolledMemberName }
        ]
      });
      if (enrolledUser) {
        enrolledUser.accountStatus = 'Approved';
        await enrolledUser.save();
      }
    }

    res.json({
      success: true,
      message: `Approved downline commission of $${approval.commissionAmount.toFixed(2)} and activated account for ${approval.enrolledMemberName}!`,
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
