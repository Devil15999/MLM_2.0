import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { User } from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Nexis MLM Backend API',
    timestamp: new Date().toISOString(),
  });
});

// Seed initial MLM accounts
const autoSeedUsers = async () => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      await User.create({
        name: 'System Admin',
        email: 'admin@nexismlm.com',
        password: 'Admin@123456',
        role: 'admin',
        sponsorId: 'MASTER-HEAD',
        rank: 'Diamond',
        walletBalance: 85200.00,
        totalEarnings: 340000.00,
        downlineCount: 450,
      });
      console.log('[Seed] Nexis Admin created (admin@nexismlm.com / Admin@123456)');
    }

    const customerCount = await User.countDocuments({ role: 'customer' });
    if (customerCount === 0) {
      await User.create({
        name: 'Alex Rivera',
        email: 'alex@nexismlm.com',
        password: 'User@123456',
        role: 'customer',
        sponsorId: 'SP-1001',
        rank: 'Gold',
        walletBalance: 6250.00,
        totalEarnings: 10450.00,
        downlineCount: 36,
        level1MembersCount: 12,
        level2MembersCount: 24,
        level1AffiliateIncome: 4850.00,
        level2AffiliateIncome: 2420.00,
        investmentReturns: 3180.00,
        totalIncome: 10450.00,
        phone: '+1 (555) 234-5678',
        address: '742 Evergreen Terrace',
        city: 'Springfield',
        country: 'United States',
        kycStatus: 'Verified',
      });
      console.log('[Seed] Nexis Distributor created (alex@nexismlm.com / User@123456)');
    }

    const freshUserCount = await User.countDocuments({ email: 'fresh@nexismlm.com' });
    if (freshUserCount === 0) {
      await User.create({
        name: 'New Distributor (Fresh)',
        email: 'fresh@nexismlm.com',
        password: 'User@123456',
        role: 'customer',
        sponsorId: 'SP-2000',
        rank: 'Member',
        selectedPackage: 'None',
        walletBalance: 0.00,
        totalEarnings: 0.00,
        downlineCount: 0,
        level1MembersCount: 0,
        level2MembersCount: 0,
        level1AffiliateIncome: 0.00,
        level2AffiliateIncome: 0.00,
        investmentReturns: 0.00,
        totalIncome: 0.00,
        phone: '+1 (555) 000-0000',
        address: '100 Clean Slate Way',
        city: 'New City',
        country: 'United States',
        kycStatus: 'Not Submitted',
      });
      console.log('[Seed] Fresh Distributor created (fresh@nexismlm.com / User@123456) with 0 stats');
    }
  } catch (err) {
    console.error('[Seed Error]:', err.message);
  }
};

// Start Server with Port Fallback
const startServer = async () => {
  const HOST = '0.0.0.0';
  const server = app.listen(PORT, HOST, () => {
    console.log(`[Nexis MLM Backend] Server running on http://${HOST}:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const ALT_PORT = Number(PORT) + 1;
      console.log(`[Nexis MLM Backend] Port ${PORT} busy, starting on http://${HOST}:${ALT_PORT}`);
      app.listen(ALT_PORT, HOST, () => {
        console.log(`[Nexis MLM Backend] Server running on http://${HOST}:${ALT_PORT}`);
      });
    }
  });

  // Asynchronously connect DB and seed initial users in background
  connectDB().then(() => autoSeedUsers()).catch((err) => {
    console.error('[Async DB/Seed Error]:', err.message);
  });
};

startServer();
