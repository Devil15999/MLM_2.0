import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://devbiz2025_db_user:1QCT5kCpAAJ9QVTk@cluster0.fjgzzqo.mongodb.net/pentest_db?retryWrites=true&w=majority&appName=Cluster0';

// Import Mongoose Models
import { User } from '../models/User.js';
import { Approval } from '../models/Approval.js';

// Realistic Indian Names Dataset
const firstNames = [
  'Aarav', 'Vihaan', 'Aditya', 'Reyansh', 'Arjun', 'Sai', 'Muhammad', 'Rohan', 'Krishna', 'Ishaan',
  'Dhruv', 'Kabir', 'Ananya', 'Diya', 'Aadhya', 'Saanvi', 'Pari', 'Anushka', 'Khushi', 'Navya',
  'Riya', 'Avani', 'Myra', 'Ira', 'Manish', 'Karan', 'Sunil', 'Deepak', 'Suresh', 'Ramesh',
  'Pooja', 'Neha', 'Sneha', 'Meera', 'Kavita', 'Sanjay', 'Vikram', 'Alok', 'Vivek', 'Nikhil',
  'Tanvi', 'Shreya', 'Simran', 'Komal', 'Rashmi', 'Pranav', 'Harsh', 'Mohit', 'Gaurav', 'Tarun',
  'Shubham', 'Abhishek', 'Akash', 'Rahul', 'Varun', 'Swati', 'Preeti', 'Divya', 'Bhavna', 'Geeta',
  'Ritu', 'Anita', 'Sunita', 'Rekha', 'Deepa', 'Sonal', 'Kalyani', 'Nandini', 'Vandana', 'Shruti'
];

const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Patel', 'Singh', 'Kumar', 'Joshi', 'Mehta', 'Nair', 'Rao',
  'Reddy', 'Mishra', 'Pandey', 'Chopra', 'Malhotra', 'Bhatia', 'Saxena', 'Deshmukh', 'Kulkarni', 'Iyer',
  'Chatterjee', 'Banerjee', 'Mukherjee', 'Dutta', 'Das', 'Roy', 'Ghosh', 'Sen', 'Bose', 'Chakraborty',
  'Agarwal', 'Bansal', 'Garg', 'Mittal', 'Goel', 'Jindal', 'Singhal', 'Kansal', 'Tayal', 'Aggarwal'
];

function generateAadhaar(index) {
  const base = 210000000000 + index * 137;
  return String(base);
}

function generatePhone(index) {
  const base = 9811000000 + index * 23;
  return String(base);
}

async function seed() {
  try {
    console.log('--- Connecting to MongoDB ---');
    await mongoose.connect(MONGODB_URI);
    console.log(' Connected to MongoDB successfully.');

    // Find Head Admin Node to serve as Bishwajith parent sponsor
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('Creating Top-Level System Admin...');
      const adminPass = await bcrypt.hash('Admin@123456', 10);
      admin = await User.create({
        name: 'System Admin',
        email: 'admin@example.com',
        password: adminPass,
        role: 'admin',
        sponsorId: 'NEXIS-TOP',
        phone: '+919876543210',
        rank: 'Diamond',
        accountStatus: 'Approved',
        status: 'active',
        kycStatus: 'Verified'
      });
    }

    console.log(`Using Parent Sponsor for Bishwajith: ${admin.name} (${admin.sponsorId || admin.email})`);

    // Clean up any existing records for Bishwajith and downline network
    const oldBishwa = await User.findOne({ email: 'bishwajith@gmail.com' });
    if (oldBishwa) {
      console.log('Cleaning up previous Bishwajith and downlines...');
      // Find all downline IDs recursively
      const l1 = await User.find({ parentSponsorId: oldBishwa._id });
      const l1Ids = l1.map(u => u._id);
      const l2 = await User.find({ parentSponsorId: { $in: l1Ids } });
      const l2Ids = l2.map(u => u._id);
      const l3 = await User.find({ parentSponsorId: { $in: l2Ids } });
      const l3Ids = l3.map(u => u._id);

      const allDownlineIds = [...l1Ids, ...l2Ids, ...l3Ids];
      await User.deleteMany({ _id: { $in: [...allDownlineIds, oldBishwa._id] } });
      await Approval.deleteMany({
        $or: [
          { sponsorId: oldBishwa._id },
          { userId: oldBishwa._id },
          { enrolledMemberEmail: 'bishwajith@gmail.com' },
          { enrolledMemberName: 'Bishwajith' },
          { sponsorName: 'Bishwajith' }
        ]
      });
      console.log(`Cleaned ${allDownlineIds.length + 1} previous users and associated approvals.`);
    }

    // 1. CREATE USER BISHWAJITH
    // Created date: 7th June 2026
    const bishwaCreatedDate = new Date('2026-06-07T09:00:00.000Z');
    const passwordHash = await bcrypt.hash('Bishwajith@123', 10);

    // Totals in Rupees:
    // Level 1: 35x3k + 7x2k + 7x1k = 126k (₹1,26,000)
    // Level 2: 14x500 = 7k (₹7,000)
    // Level 3: 7 members = ₹0 (No referral income)
    // Daily ROI: 20% average per month from 7th June 2026 to 18th Sept 2026 (103 days = ₹20,600)
    // Total Income & Wallet = 126k + 7k + 20.6k = ₹1,53,600.00
    const bishwajith = await User.create({
      name: 'Bishwajith',
      email: 'bishwajith@gmail.com',
      password: passwordHash,
      phone: '9845123456',
      sponsorId: '9845123456',
      parentSponsorId: admin._id,
      parentSponsorCode: admin.sponsorId || 'NEXIS-TOP',
      parentSponsorEmail: admin.email,
      role: 'customer',
      rank: 'Platinum',
      selectedPackage: 'Elite Package (₹30,000)',
      legPreference: 'Direct Level 1',
      isOneTimePassword: false,
      status: 'active',
      accountStatus: 'Approved',
      kycStatus: 'Verified',
      isActionRestricted: true, // Dummy account restriction guard
      walletBalance: 153600.00,
      totalIncome: 153600.00,
      totalEarnings: 153600.00,
      level1AffiliateIncome: 126000.00,
      level2AffiliateIncome: 7000.00,
      investmentReturns: 20600.00,
      downlineCount: 63,
      level1MembersCount: 49,
      level2MembersCount: 14,
      level3MembersCount: 7,
      personalVolume: 30000,
      groupVolume: 1470000,
      address: '42 Richmond Road, Ashok Nagar',
      city: 'Bengaluru',
      country: 'India',
      aadhaarNumber: '456789012345',
      aadhaarPhoto: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01LjY0NjQ1IDIuNjQ2NDVDNS44NDE3MSAyLjQ1MTE4IDYuMTU4MjkgMi40NTExOCA2LjM1MzU1IDIuNjQ2NDVMMTEuMzUzNiA3LjY0NjQ1QzExLjU0ODggNy44NDE3MSAxMS41NDg4IDguMTU4MjkgMTEuMzUzNiA4LjM1MzU1TDYuMzUzNTUgMTMuMzUzNkM2LjE1ODI5IDEzLjU0ODggNS44NDE3MSAxMy41NDg4IDUuNjQ2NDUgMTMuMzUzNkM1LjQ1MTE4IDEzLjE1ODMgNS40NTExOCAxMi44NDE3IDUuNjQ2NDUgMTIuNjQ2NEwxMC4yOTI5IDhMNS42NDY0NSAzLjM1MzU1QzUuNDUxMTggMy4xNTgyOSA1LjQ1MTE4IDIuODQxNzEgNS42NDY0NSAyLjY0NjQ1WiIgZmlsbD0iIzZFNzE3NyIvPgo8L3N2Zz4K',
      panPhoto: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01LjY0NjQ1IDIuNjQ2NDVDNS44NDE3MSAyLjQ1MTE4IDYuMTU4MjkgMi40NTExOCA2LjM1MzU1IDIuNjQ2NDVMMTEuMzUzNiA3LjY0NjQ1QzExLjU0ODggNy44NDE3MSAxMS41NDg4IDguMTU4MjkgMTEuMzUzNiA4LjM1MzU1TDYuMzUzNTUgMTMuMzUzNkM2LjE1ODI5IDEzLjU0ODggNS44NDE3MSAxMy41NDg4IDUuNjQ2NDUgMTMuMzUzNkM1LjQ1MTE4IDEzLjE1ODMgNS40NTExOCAxMi44NDE3IDUuNjQ2NDUgMTIuNjQ2NEwxMC4yOTI5IDhMNS42NDY0NSAzLjM1MzU1QzUuNDUxMTggMy4xNTgyOSA1LjQ1MTE4IDIuODQxNzEgNS42NDY0NSAyLjY0NjQ1WiIgZmlsbD0iIzZFNzE3NyIvPgo8L3N2Zz4K',
      transactionPhoto: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01LjY0NjQ1IDIuNjQ2NDVDNS44NDE3MSAyLjQ1MTE4IDYuMTU4MjkgMi40NTExOCA2LjM1MzU1IDIuNjQ2NDVMMTEuMzUzNiA3LjY0NjQ1QzExLjU0ODggNy44NDE3MSAxMS41NDg4IDguMTU4MjkgMTEuMzUzNiA4LjM1MzU1TDYuMzUzNTUgMTMuMzUzNkM2LjE1ODI5IDEzLjU0ODggNS44NDE3MSAxMy41NDg4IDUuNjQ2NDUgMTMuMzUzNkM1LjQ1MTE4IDEzLjE1ODMgNS40NTExOCAxMi44NDE3IDUuNjQ2NDUgMTIuNjQ2NEwxMC4yOTI5IDhMNS42NDY0NSAzLjM1MzU1QzUuNDUxMTggMy4xNTgyOSA1LjQ1MTE4IDIuODQxNzEgNS42NDY0NSAyLjY0NjQ1WiIgZmlsbD0iIzZFNzE3NyIvPgo8L3N2Zz4K',
      kycData: {
        documentType: 'Aadhaar Card / Govt ID',
        documentNumber: '4567-8901-2345',
        bankName: 'HDFC Bank Ltd',
        accountNumber: '•••• •••• 8821',
        ifscCode: 'HDFC0001234',
        upiId: 'bishwajith@okhdfcbank',
        panNumber: 'ABCDE1234F'
      },
      createdAt: bishwaCreatedDate,
      updatedAt: new Date('2026-09-18T12:00:00.000Z')
    });

    // Also create Bishwajith Joining Approval record
    await Approval.create({
      type: 'Joining Request',
      sponsorId: admin._id,
      userId: bishwajith._id,
      sponsorName: admin.name,
      enrolledMemberName: 'Bishwajith',
      enrolledMemberEmail: 'bishwajith@gmail.com',
      packageName: 'Elite Package (₹30,000)',
      status: 'Approved',
      actionDate: bishwaCreatedDate,
      createdAt: bishwaCreatedDate
    });

    console.log(` Created User Bishwajith (_id: ${bishwajith._id})`);

    // 2. CREATE 49 LEVEL 1 DOWNLINE MEMBERS
    // 35 members on Elite Package (₹30,000) -> 3k commission each = 105k
    // 7 members on Premium Package (₹20,000) -> 2k commission each = 14k
    // 7 members on Starter Package (₹10,000) -> 1k commission each = 7k
    // Total L1 Commission = 126k (₹1,26,000)
    console.log('Generating 49 Level 1 downline members...');
    const l1Members = [];
    const defaultMemberPass = await bcrypt.hash('Member@123', 10);

    // Distribution array: 35 Elite, 7 Premium, 7 Starter
    const l1Packages = [
      ...Array(35).fill({ name: 'Elite Package (₹30,000)', price: 30000, comm: 3000, rank: 'Platinum' }),
      ...Array(7).fill({ name: 'Premium Package (₹20,000)', price: 20000, comm: 2000, rank: 'Premium' }),
      ...Array(7).fill({ name: 'Starter Package (₹10,000)', price: 10000, comm: 1000, rank: 'Starter' })
    ];

    let nameIndex = 0;
    for (let i = 0; i < 49; i++) {
      const pkg = l1Packages[i];
      const fn = firstNames[nameIndex % firstNames.length];
      const ln = lastNames[(nameIndex * 3) % lastNames.length];
      nameIndex++;

      const memberName = `${fn} ${ln}`;
      const memberPhone = generatePhone(100 + i);
      const memberEmail = `${fn.toLowerCase()}.${ln.toLowerCase()}${100 + i}@gmail.com`;
      const memberAadhaar = generateAadhaar(100 + i);

      // Join date spaced naturally between June 8, 2026 and August 15, 2026
      const dayOffset = Math.floor(1 + (i * 1.4));
      const memberJoinedDate = new Date(bishwaCreatedDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);

      const l1User = await User.create({
        name: memberName,
        email: memberEmail,
        password: defaultMemberPass,
        phone: memberPhone,
        sponsorId: memberPhone,
        parentSponsorId: bishwajith._id,
        parentSponsorCode: bishwajith.sponsorId,
        parentSponsorEmail: bishwajith.email,
        role: 'customer',
        rank: pkg.rank,
        selectedPackage: pkg.name,
        legPreference: i % 2 === 0 ? 'Left Leg (Direct L1)' : 'Right Leg (Direct L1)',
        accountStatus: 'Approved',
        status: 'active',
        kycStatus: 'Verified',
        walletBalance: 0,
        totalIncome: 0,
        totalEarnings: 0,
        level1AffiliateIncome: 0,
        level2AffiliateIncome: 0,
        investmentReturns: 0,
        personalVolume: pkg.price,
        groupVolume: 0,
        aadhaarNumber: memberAadhaar,
        createdAt: memberJoinedDate,
        updatedAt: memberJoinedDate
      });

      l1Members.push(l1User);

      // Create Approved Commission Approval Record for Bishwajith's notification audit log
      await Approval.create({
        type: 'Enrolled Downline Commission',
        userId: l1User._id,
        sponsorId: bishwajith._id,
        sponsorName: 'Bishwajith',
        enrolledMemberName: memberName,
        enrolledMemberEmail: memberEmail,
        position: l1User.legPreference,
        packageName: pkg.name,
        commissionAmount: pkg.comm,
        amount: pkg.comm,
        status: 'Approved',
        actionDate: memberJoinedDate,
        createdAt: memberJoinedDate
      });
    }

    console.log(` Created 49 Level 1 members with ₹1,26,000 total direct commissions.`);

    // 3. CREATE 14 LEVEL 2 DOWNLINE MEMBERS
    // Enrolled by Level 1 members -> flat ₹500 override commission to Bishwajith
    // 14 x ₹500 = ₹7,000 (7k)
    console.log('Generating 14 Level 2 downline members...');
    const l2Members = [];

    for (let i = 0; i < 14; i++) {
      const parentL1 = l1Members[i % 7]; // Spaced across first 7 Level 1 members
      const fn = firstNames[(nameIndex + 17) % firstNames.length];
      const ln = lastNames[(nameIndex * 5 + 3) % lastNames.length];
      nameIndex++;

      const memberName = `${fn} ${ln}`;
      const memberPhone = generatePhone(500 + i);
      const memberEmail = `${fn.toLowerCase()}.${ln.toLowerCase()}${500 + i}@gmail.com`;
      const memberAadhaar = generateAadhaar(500 + i);

      // Join date spaced between July 15, 2026 and August 28, 2026
      const dayOffset = 38 + Math.floor(i * 2.8);
      const memberJoinedDate = new Date(bishwaCreatedDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);

      const pkgName = i % 2 === 0 ? 'Premium Package (₹20,000)' : 'Starter Package (₹10,000)';
      const pkgPrice = i % 2 === 0 ? 20000 : 10000;

      const l2User = await User.create({
        name: memberName,
        email: memberEmail,
        password: defaultMemberPass,
        phone: memberPhone,
        sponsorId: memberPhone,
        parentSponsorId: parentL1._id,
        parentSponsorCode: parentL1.sponsorId,
        parentSponsorEmail: parentL1.email,
        role: 'customer',
        rank: 'Starter',
        selectedPackage: pkgName,
        legPreference: 'Level 2 Secondary Node',
        accountStatus: 'Approved',
        status: 'active',
        kycStatus: 'Verified',
        walletBalance: 0,
        totalIncome: 0,
        personalVolume: pkgPrice,
        groupVolume: 0,
        aadhaarNumber: memberAadhaar,
        createdAt: memberJoinedDate,
        updatedAt: memberJoinedDate
      });

      l2Members.push(l2User);

      // Create Level 2 Override Commission Approval Record for Bishwajith (₹500)
      await Approval.create({
        type: 'Enrolled Downline Commission',
        userId: l2User._id,
        sponsorId: bishwajith._id,
        sponsorName: 'Bishwajith',
        enrolledMemberName: memberName,
        enrolledMemberEmail: memberEmail,
        position: `Level 2 Override (${parentL1.name})`,
        packageName: pkgName,
        commissionAmount: 500,
        amount: 500,
        status: 'Approved',
        actionDate: memberJoinedDate,
        createdAt: memberJoinedDate
      });
    }

    console.log(` Created 14 Level 2 members with ₹7,000 total override commissions.`);

    // 4. CREATE 7 LEVEL 3 DOWNLINE MEMBERS
    // "7 3rd level - No referral income" (₹0)
    console.log('Generating 7 Level 3 downline members (₹0 referral income)...');
    const l3Members = [];

    for (let i = 0; i < 7; i++) {
      const parentL2 = l2Members[i % l2Members.length];
      const fn = firstNames[(nameIndex + 31) % firstNames.length];
      const ln = lastNames[(nameIndex * 7 + 9) % lastNames.length];
      nameIndex++;

      const memberName = `${fn} ${ln}`;
      const memberPhone = generatePhone(800 + i);
      const memberEmail = `${fn.toLowerCase()}.${ln.toLowerCase()}${800 + i}@gmail.com`;
      const memberAadhaar = generateAadhaar(800 + i);

      // Join date spaced in August - September 2026
      const dayOffset = 65 + (i * 3);
      const memberJoinedDate = new Date(bishwaCreatedDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);

      const l3User = await User.create({
        name: memberName,
        email: memberEmail,
        password: defaultMemberPass,
        phone: memberPhone,
        sponsorId: memberPhone,
        parentSponsorId: parentL2._id,
        parentSponsorCode: parentL2.sponsorId,
        parentSponsorEmail: parentL2.email,
        role: 'customer',
        rank: 'Member',
        selectedPackage: 'Starter Package (₹10,000)',
        legPreference: 'Level 3 Downline Node',
        accountStatus: 'Approved',
        status: 'active',
        kycStatus: 'Verified',
        walletBalance: 0,
        totalIncome: 0,
        personalVolume: 10000,
        groupVolume: 0,
        aadhaarNumber: memberAadhaar,
        createdAt: memberJoinedDate,
        updatedAt: memberJoinedDate
      });

      l3Members.push(l3User);
    }

    console.log(` Created 7 Level 3 members (₹0 referral commission).`);

    // 5. CREATE DAILY ROI PAYOUT LOGS IN APPROVALS
    // Started 7th June 2026, 20% monthly average = ₹200/day for 103 days = ₹20,600 total
    console.log('Creating Daily ROI Payout audit logs in Approvals collection...');
    const roiBatches = [
      {
        month: 'June 2026',
        days: 23,
        amount: 4600,
        date: new Date('2026-06-30T18:00:00.000Z'),
        label: 'Daily ROI Yield (June 7 - June 30: 23 days @ ₹200/day)'
      },
      {
        month: 'July 2026',
        days: 31,
        amount: 6200,
        date: new Date('2026-07-31T18:00:00.000Z'),
        label: 'Daily ROI Yield (July 1 - July 31: 31 days @ ₹200/day ~20.6%)'
      },
      {
        month: 'August 2026',
        days: 31,
        amount: 6200,
        date: new Date('2026-08-31T18:00:00.000Z'),
        label: 'Daily ROI Yield (August 1 - August 31: 31 days @ ₹200/day ~20.6%)'
      },
      {
        month: 'September 2026',
        days: 18,
        amount: 3600,
        date: new Date('2026-09-18T12:00:00.000Z'),
        label: 'Daily ROI Yield (September 1 - September 18: 18 days @ ₹200/day)'
      }
    ];

    for (const batch of roiBatches) {
      await Approval.create({
        type: 'Daily ROI Payout',
        userId: bishwajith._id,
        sponsorId: bishwajith._id,
        sponsorName: 'System ROI Engine',
        enrolledMemberName: `Bishwajith (${batch.label})`,
        enrolledMemberEmail: 'bishwajith@gmail.com',
        packageName: 'Elite Package (₹30,000) - Daily ROI Yield',
        position: `${batch.month} Payout (${batch.days} Days)`,
        commissionAmount: batch.amount,
        amount: batch.amount,
        status: 'Approved',
        actionDate: batch.date,
        createdAt: batch.date
      });
    }

    console.log(` Created 4 Daily ROI payout batches totaling ₹20,600.`);

    // 6. VERIFY FINAL DATABASE STATE
    const verifiedBishwa = await User.findById(bishwajith._id);
    const verifiedL1Count = await User.countDocuments({ parentSponsorId: bishwajith._id });
    const verifiedL2Count = await User.countDocuments({ parentSponsorId: { $in: l1Members.map(m => m._id) } });
    const verifiedL3Count = await User.countDocuments({ parentSponsorId: { $in: l2Members.map(m => m._id) } });
    const verifiedApprovalsCount = await Approval.countDocuments({ sponsorId: bishwajith._id });

    console.log('\n=============================================');
    console.log(' SEEDING COMPLETE & VERIFIED SUCCESSFULLY');
    console.log('=============================================');
    console.log(`User: ${verifiedBishwa.name} (${verifiedBishwa.email})`);
    console.log(`Password: Bishwajith@123`);
    console.log(`Sponsor ID: ${verifiedBishwa.sponsorId}`);
    console.log(`Rank: ${verifiedBishwa.rank}`);
    console.log(`Package: ${verifiedBishwa.selectedPackage}`);
    console.log(`Action Restricted: ${verifiedBishwa.isActionRestricted}`);
    console.log(`Level 1 Directs: ${verifiedL1Count} Members`);
    console.log(`Level 2 Indirects: ${verifiedL2Count} Members`);
    console.log(`Level 3 Downlines: ${verifiedL3Count} Members`);
    console.log(`Total Team: ${verifiedL1Count + verifiedL2Count} Members (+ ${verifiedL3Count} Level 3)`);
    console.log(`---------------------------------------------`);
    console.log(`Level 1 Affiliate Income: ₹${verifiedBishwa.level1AffiliateIncome.toLocaleString('en-IN')}`);
    console.log(`Level 2 Affiliate Income: ₹${verifiedBishwa.level2AffiliateIncome.toLocaleString('en-IN')}`);
    console.log(`Daily ROI Yield (from 7 June 2026): ₹${verifiedBishwa.investmentReturns.toLocaleString('en-IN')}`);
    console.log(`Total Income / Lifetime Earnings: ₹${verifiedBishwa.totalIncome.toLocaleString('en-IN')}`);
    console.log(`Wallet Balance: ₹${verifiedBishwa.walletBalance.toLocaleString('en-IN')}`);
    console.log(`Approvals Generated for Bishwajith: ${verifiedApprovalsCount}`);
    console.log('=============================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(' Seeding Error:', err);
    process.exit(1);
  }
}

seed();
