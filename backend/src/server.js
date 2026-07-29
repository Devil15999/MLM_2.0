import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import { User } from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

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
        walletBalance: 4850.00,
        totalEarnings: 18450.00,
        downlineCount: 32,
      });
      console.log('[Seed] Nexis Distributor created (alex@nexismlm.com / User@123456)');
    }
  } catch (err) {
    console.error('[Seed Error]:', err.message);
  }
};

// Start Server with Port Fallback
const startServer = async () => {
  await connectDB();
  await autoSeedUsers();
  
  const server = app.listen(PORT, () => {
    console.log(`[Nexis MLM Backend] Server running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const ALT_PORT = Number(PORT) + 1;
      console.log(`[Nexis MLM Backend] Port ${PORT} busy, starting on http://localhost:${ALT_PORT}`);
      app.listen(ALT_PORT, () => {
        console.log(`[Nexis MLM Backend] Server running on http://localhost:${ALT_PORT}`);
      });
    }
  });
};

startServer();
