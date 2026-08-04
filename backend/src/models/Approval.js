import mongoose from 'mongoose';

const approvalSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Enrolled Downline Commission', 'KYC Verification', 'Wallet Withdrawal', 'Joining Request'],
      default: 'Enrolled Downline Commission',
    },
    sponsorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sponsorName: {
      type: String,
      required: false,
    },
    enrolledMemberName: {
      type: String,
      required: false,
    },
    enrolledMemberEmail: {
      type: String,
      required: false,
    },
    position: {
      type: String,
      required: false,
    },
    packageName: {
      type: String,
      required: false,
    },
    commissionAmount: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    actionDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Approval = mongoose.model('Approval', approvalSchema);
