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

// @desc    Approve Commission Request or Joining Request
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

    let message = 'Request approved.';

    if (approval.type === 'Joining Request') {
      // Find the new user and activate
      let enrolledUser = approval.userId ? await User.findById(approval.userId).catch(() => null) : null;
      if (!enrolledUser && (approval.enrolledMemberEmail || approval.enrolledMemberName)) {
        enrolledUser = await User.findOne({
          $or: [
            { email: approval.enrolledMemberEmail },
            { name: approval.enrolledMemberName }
          ]
        });
      }
      if (enrolledUser) {
        enrolledUser.accountStatus = 'Approved';
        await enrolledUser.save();
      }

      // Calculate commissions based on package
      const packageString = approval.packageName || '';
      let packageAmount = 0;
      if (packageString.includes('10,000')) packageAmount = 10000;
      else if (packageString.includes('20,000')) packageAmount = 20000;
      else if (packageString.includes('30,000')) packageAmount = 30000;

      let level1Commission = packageAmount * 0.10; // 10%
      if (level1Commission === 0 && approval.commissionAmount) {
        level1Commission = approval.commissionAmount;
      }
      const level2Commission = 500; // Flat 500

      // Find Level 1 Sponsor
      let sponsorUser = null;
      if (approval.sponsorId) {
        sponsorUser = await User.findById(approval.sponsorId).catch(() => null);
      }
      if (!sponsorUser && approval.sponsorName) {
        sponsorUser = await User.findOne({ name: approval.sponsorName });
      }
      
      if (sponsorUser) {
        sponsorUser.level1AffiliateIncome = (sponsorUser.level1AffiliateIncome || 0) + level1Commission;
        sponsorUser.walletBalance = (sponsorUser.walletBalance || 0) + level1Commission;
        sponsorUser.totalIncome = (sponsorUser.totalIncome || 0) + level1Commission;
        sponsorUser.totalEarnings = (sponsorUser.totalEarnings || 0) + level1Commission;
        sponsorUser.level1MembersCount = (sponsorUser.level1MembersCount || 0) + 1;
        sponsorUser.downlineCount = (sponsorUser.downlineCount || 0) + 1;
        await sponsorUser.save();

        // Find Level 2 Sponsor
        if (sponsorUser.sponsorId && sponsorUser.sponsorId !== 'NEXIS-TOP') {
          const l2Sponsor = await User.findOne({ 
            $or: [{ sponsorId: sponsorUser.sponsorId }, { _id: sponsorUser.sponsorId }] 
          }).catch(() => null);

          if (l2Sponsor) {
            l2Sponsor.level2AffiliateIncome = (l2Sponsor.level2AffiliateIncome || 0) + level2Commission;
            l2Sponsor.walletBalance = (l2Sponsor.walletBalance || 0) + level2Commission;
            l2Sponsor.totalIncome = (l2Sponsor.totalIncome || 0) + level2Commission;
            l2Sponsor.totalEarnings = (l2Sponsor.totalEarnings || 0) + level2Commission;
            l2Sponsor.level2MembersCount = (l2Sponsor.level2MembersCount || 0) + 1;
            l2Sponsor.downlineCount = (l2Sponsor.downlineCount || 0) + 1;
            await l2Sponsor.save();
          }
        }
      }

      message = `Approved Joining Request for ${approval.enrolledMemberName}. Activated account and credited ₹${level1Commission} to L1 sponsor and ₹${level2Commission} to L2 sponsor.`;

    } else {
      // Legacy Enrolled Downline Commission Logic
      let sponsorUser = null;
      if (approval.sponsorId) {
        sponsorUser = await User.findById(approval.sponsorId).catch(() => null);
      }
      if (!sponsorUser && approval.sponsorName) {
        sponsorUser = await User.findOne({ name: approval.sponsorName });
      }

      if (sponsorUser) {
        const isLevel1 = approval.position && (approval.position.includes('Node 1') || approval.position === 'Left Leg' || approval.position === 'Right Leg' || !approval.position.includes('L2'));
        if (isLevel1) {
          sponsorUser.level1AffiliateIncome = (sponsorUser.level1AffiliateIncome || 0) + (approval.commissionAmount || 0);
        } else {
          sponsorUser.level2AffiliateIncome = (sponsorUser.level2AffiliateIncome || 0) + (approval.commissionAmount || 0);
        }
        sponsorUser.walletBalance = (sponsorUser.walletBalance || 0) + (approval.commissionAmount || 0);
        sponsorUser.totalIncome = (sponsorUser.totalIncome || 0) + (approval.commissionAmount || 0);
        sponsorUser.totalEarnings = (sponsorUser.totalEarnings || 0) + (approval.commissionAmount || 0);
        await sponsorUser.save();
      }

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
      message = `Approved downline commission of ₹${(approval.commissionAmount || 0).toFixed(2)} and activated account for ${approval.enrolledMemberName}!`;
    }

    res.json({
      success: true,
      message,
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
