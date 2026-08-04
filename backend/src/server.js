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

// Ensure System Admin account exists
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
        walletBalance: 0.00,
        totalEarnings: 0.00,
        downlineCount: 0,
      });
      console.log('[Seed] Nexis Admin created (admin@nexismlm.com / Admin@123456)');
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
