import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Approval } from '../models/Approval.js';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://devbiz2025_db_user:1QCT5kCpAAJ9QVTk@cluster0.fjgzzqo.mongodb.net/pentest_db?retryWrites=true&w=majority&appName=Cluster0';

const resetDatabase = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('[MongoDB Atlas] Connected for database cleanup...');

    // 1. Clear all Approvals
    const approvalDeleteResult = await Approval.deleteMany({});
    console.log(`[Clean Database] Deleted ${approvalDeleteResult.deletedCount} approval records.`);

    // 2. Delete all users except admin@nexismlm.com and fresh@nexismlm.com
    const userDeleteResult = await User.deleteMany({
      email: { $nin: ['admin@nexismlm.com', 'fresh@nexismlm.com'] }
    });
    console.log(`[Clean Database] Deleted ${userDeleteResult.deletedCount} test user records.`);

    // 3. Reset fresh@nexismlm.com metrics to exact 0
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
      console.log('[Clean Database] Reset fresh@nexismlm.com user stats to 0.');
    } else {
      console.log('[Clean Database] fresh@nexismlm.com user will be recreated on server start.');
    }

    // 4. Ensure admin@nexismlm.com exists
    let adminUser = await User.findOne({ email: 'admin@nexismlm.com' });
    if (adminUser) {
      console.log('[Clean Database] Preserved admin@nexismlm.com account.');
    }

    console.log('[SUCCESS] Database reset complete! Only Admin and Fresh User remain.');
    process.exit(0);
  } catch (err) {
    console.error('[Database Reset Error]:', err.message);
    process.exit(1);
  }
};

resetDatabase();
