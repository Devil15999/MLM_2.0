import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import authRoutes from '../routes/authRoutes.js';
import customerRoutes from '../routes/customerRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);

async function runVerification() {
  console.log('=== STARTING BISHWAJITH SYSTEM VERIFICATION ===\n');
  await mongoose.connect(process.env.MONGODB_URI);

  const server = app.listen(5151);
  const baseUrl = 'http://localhost:5151';

  try {
    // 1. TEST LOGIN
    console.log('1. Testing Login as Bishwajith...');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'bishwajith@gmail.com',
        password: 'Bishwajith@123'
      })
    });

    const user = await loginRes.json();
    if (loginRes.status !== 200 || !user.token) {
      console.error(' Login failed:', loginRes.status, user);
      process.exit(1);
    }

    const token = user.token;
    console.log(` Login SUCCESS! Token received.`);
    console.log(`   User: ${user.name} | Role: ${user.role} | Rank: ${user.rank}`);
    console.log(`   Wallet Balance: ₹${user.walletBalance.toLocaleString('en-IN')}`);
    console.log(`   Level 1 Income: ₹${user.level1AffiliateIncome.toLocaleString('en-IN')}`);
    console.log(`   Level 2 Income: ₹${user.level2AffiliateIncome.toLocaleString('en-IN')}`);
    console.log(`   Investment Returns (Daily ROI): ₹${user.investmentReturns.toLocaleString('en-IN')}`);
    console.log(`   Total Lifetime Income: ₹${user.totalIncome.toLocaleString('en-IN')}`);
    console.log(`   Restricted Status: isActionRestricted = ${user.isActionRestricted}`);

    // 2. TEST CUSTOMER DASHBOARD ENDPOINT
    console.log('\n2. Testing GET /api/customer/dashboard...');
    const dashRes = await fetch(`${baseUrl}/api/customer/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const dashData = await dashRes.json();

    console.log(` Dashboard Status: ${dashRes.status}`);
    console.log(`   Total Network Team: ${dashData.metrics.totalTeam.value}`);
    console.log(`   Level 1 Members: ${dashData.metrics.level1Members.value}`);
    console.log(`   Level 2 Members: ${dashData.metrics.level2Members.value}`);
    console.log(`   Level 1 Bonus: ${dashData.metrics.level1AffiliateIncome.value}`);
    console.log(`   Level 2 Bonus: ${dashData.metrics.level2AffiliateIncome.value}`);
    console.log(`   Investment Returns: ${dashData.metrics.investmentReturns.value}`);
    console.log(`   Wallet: ${dashData.metrics.wallet.value}`);

    // 3. TEST TEAM DETAILS ENDPOINT
    console.log('\n3. Testing GET /api/customer/team...');
    const teamRes = await fetch(`${baseUrl}/api/customer/team`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const teamData = await teamRes.json();

    console.log(` Team Endpoint Status: ${teamRes.status}`);
    console.log(`   Level 1 Members Count: ${teamData.level1MembersCount}`);
    console.log(`   Level 2 Members Count: ${teamData.level2MembersCount}`);
    console.log(`   Level 3 Members Count: ${teamData.level3MembersCount}`);
    console.log(`   Total Team Count: ${teamData.totalTeamCount}`);
    console.log(`   Sample L1 Member: ${teamData.level1Members[0].name} (${teamData.level1Members[0].selectedPackage})`);
    console.log(`   Sample L2 Member: ${teamData.level2Members[0].name} (${teamData.level2Members[0].selectedPackage})`);
    console.log(`   Sample L3 Member: ${teamData.level3Members[0].name} (${teamData.level3Members[0].selectedPackage})`);

    // 4. TEST NOTIFICATIONS (APPROVALS)
    console.log('\n4. Testing GET /api/customer/notifications...');
    const notifRes = await fetch(`${baseUrl}/api/customer/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const notifData = await notifRes.json();

    console.log(` Notifications Status: ${notifRes.status} | Count: ${notifData.count}`);

    // 5. TEST RESTRICTIONS (ACTIONS MUST BE REJECTED WITH 403)
    console.log('\n5. Testing Action Restrictions for Bishwajith...');

    // 5a. Attempt Withdrawal
    const withdrawRes = await fetch(`${baseUrl}/api/customer/wallet/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ amount: 1000, method: 'Bank Transfer' })
    });
    const withdrawData = await withdrawRes.json();
    console.log(`   Withdrawal Attempt -> Status: ${withdrawRes.status} (Expected: 403)`);
    console.log(`   Response Message: "${withdrawData.message}"`);

    // 5b. Attempt Enroll Downline
    const enrollRes = await fetch(`${baseUrl}/api/customer/team/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        memberName: 'Test Member',
        phone: '9999999999',
        memberEmail: 'testmember@gmail.com',
        aadhaarNumber: '298765432109',
        packageName: 'Starter Package (₹10,000)',
        aadhaarPhoto: 'dummy',
        transactionPhoto: 'dummy'
      })
    });
    const enrollData = await enrollRes.json();
    console.log(`   Enroll Downline Attempt -> Status: ${enrollRes.status} (Expected: 403)`);
    console.log(`   Response Message: "${enrollData.message}"`);

    // 5c. Attempt Profile Update
    const profileRes = await fetch(`${baseUrl}/api/customer/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: 'Hacked Name' })
    });
    const profileData = await profileRes.json();
    console.log(`   Profile Update Attempt -> Status: ${profileRes.status} (Expected: 403)`);
    console.log(`   Response Message: "${profileData.message}"`);

    // 5d. Attempt KYC Update
    const kycRes = await fetch(`${baseUrl}/api/customer/kyc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ panNumber: 'XYZ1234' })
    });
    const kycData = await kycRes.json();
    console.log(`   KYC Update Attempt -> Status: ${kycRes.status} (Expected: 403)`);
    console.log(`   Response Message: "${kycData.message}"`);

    // 5e. Attempt Package Activation
    const pkgRes = await fetch(`${baseUrl}/api/customer/packages/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ packageName: 'Starter Package' })
    });
    const pkgData = await pkgRes.json();
    console.log(`   Package Upgrade Attempt -> Status: ${pkgRes.status} (Expected: 403)`);
    console.log(`   Response Message: "${pkgData.message}"`);

    // 5f. Attempt Password Change
    const pwdRes = await fetch(`${baseUrl}/api/auth/set-permanent-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId: user._id, newPassword: 'NewPassword@123', confirmPassword: 'NewPassword@123' })
    });
    const pwdData = await pwdRes.json();
    console.log(`   Password Change Attempt -> Status: ${pwdRes.status} (Expected: 403)`);
    console.log(`   Response Message: "${pwdData.message}"`);

    // Assertions check
    const allRestrictionsBlocked = (
      withdrawRes.status === 403 &&
      enrollRes.status === 403 &&
      profileRes.status === 403 &&
      kycRes.status === 403 &&
      pkgRes.status === 403 &&
      pwdRes.status === 403
    );

    console.log('\n=============================================');
    if (allRestrictionsBlocked && teamData.level1MembersCount === 49 && teamData.level2MembersCount === 14) {
      console.log(' ALL 6 VERIFICATION CHECKS PASSED PERFECTLY!');
    } else {
      console.error(' SOME VERIFICATION CHECKS FAILED!');
      process.exit(1);
    }
    console.log('=============================================\n');
  } finally {
    server.close();
    await mongoose.disconnect();
  }
  process.exit(0);
}

runVerification().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
