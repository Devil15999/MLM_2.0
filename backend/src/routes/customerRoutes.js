import express from 'express';
import {
  getCustomerDashboard,
  updateCustomerProfile,
  updateCustomerKYC,
  getCustomerPackages,
  getCustomerTeamDetails,
  requestWalletWithdrawal,
  enrollDownlineMember,
  activateUserPackage,
  getCustomerNotifications,
} from '../controllers/customerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Token protected customer endpoints
router.get('/dashboard', protect, getCustomerDashboard);
router.get('/notifications', protect, getCustomerNotifications);
router.put('/profile', protect, updateCustomerProfile);
router.post('/kyc', protect, updateCustomerKYC);
router.get('/packages', getCustomerPackages);
router.post('/packages/activate', protect, activateUserPackage);
router.get('/team', protect, getCustomerTeamDetails);
router.post('/team/enroll', protect, enrollDownlineMember);
router.post('/wallet/withdraw', protect, requestWalletWithdrawal);

export default router;
