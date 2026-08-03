import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Approval } from '../models/Approval.js';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://devbiz2025_db_user:1QCT5kCpAAJ9QVTk@cluster0.fjgzzqo.mongodb.net/pentest_db?retryWrites=true&w=majority&appName=Cluster0';

const clearDatabaseData = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('[MongoDB Atlas] Connected for database cleanup...');

    // 1. Clear all Approval records
    const approvalDeleteResult = await Approval.deleteMany({});
    console.log(`[Clean Database] Cleared ${approvalDeleteResult.deletedCount} approval records.`);

    // 2. Reset user income/wallet stats so income data updates dynamically when new users are added
    const userUpdateResult = await User.updateMany(
      { email: { $ne: 'admin@nexismlm.com' } },
      {
        $set: {
          walletBalance: 0.00,
          totalEarnings: 0.00,
          level1MembersCount: 0,
          level2MembersCount: 0,
          level1AffiliateIncome: 0.00,
          level2AffiliateIncome: 0.00,
          investmentReturns: 0.00,
          totalIncome: 0.00,
        }
      }
    );
    console.log(`[Clean Database] Preserved all user accounts (${userUpdateResult.matchedCount} users). Reset income counters so they update dynamically as new users are added.`);

    console.log('[SUCCESS] Database cleared successfully! Users preserved, income data reset to update on new user additions.');
    process.exit(0);
  } catch (err) {
    console.error('[Database Cleanup Error]:', err.message);
    process.exit(1);
  }
};

clearDatabaseData();
