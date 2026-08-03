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

    res.json({
      success: true,
      message: `Approved downline commission of $${approval.commissionAmount.toFixed(2)} and credited to ${approval.sponsorName}'s wallet!`,
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

    res.json({
      success: true,
      message: `Rejected commission request for ${approval.enrolledMemberName}.`,
      approval,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
