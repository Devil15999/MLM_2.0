import express from 'express';
import {
  getCustomerDashboard,
  updateCustomerProfile,
  updateCustomerKYC,
  getCustomerPackages,
  getCustomerTeamDetails,
  requestWalletWithdrawal,
} from '../controllers/customerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / Demo accessible or Token protected endpoints
router.get('/dashboard', getCustomerDashboard);
router.put('/profile', protect, updateCustomerProfile);
router.post('/kyc', updateCustomerKYC);
router.get('/packages', getCustomerPackages);
router.get('/team', getCustomerTeamDetails);
router.post('/wallet/withdraw', requestWalletWithdrawal);

export default router;
