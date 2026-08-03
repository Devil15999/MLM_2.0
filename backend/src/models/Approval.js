import mongoose from 'mongoose';

const approvalSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Enrolled Downline Commission', 'KYC Verification', 'Wallet Withdrawal'],
      default: 'Enrolled Downline Commission',
    },
    sponsorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sponsorName: {
      type: String,
      required: true,
    },
    enrolledMemberName: {
      type: String,
      required: true,
    },
    enrolledMemberEmail: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    packageName: {
      type: String,
      required: true,
    },
    commissionAmount: {
      type: Number,
      required: true,
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
