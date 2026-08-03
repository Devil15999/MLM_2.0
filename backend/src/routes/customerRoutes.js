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

// Public / Demo accessible or Token protected endpoints
router.get('/dashboard', getCustomerDashboard);
router.get('/notifications', getCustomerNotifications);
router.put('/profile', protect, updateCustomerProfile);
router.post('/kyc', updateCustomerKYC);
router.get('/packages', getCustomerPackages);
router.post('/packages/activate', activateUserPackage);
router.get('/team', getCustomerTeamDetails);
router.post('/team/enroll', enrollDownlineMember);
router.post('/wallet/withdraw', requestWalletWithdrawal);

export default router;
