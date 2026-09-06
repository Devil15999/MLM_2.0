import express from 'express';
import {
  getPendingApprovals,
  approveCommissionRequest,
  rejectCommissionRequest,
  resetDatabaseEndpoint,
  updateDailyRoi,
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/approvals', getPendingApprovals);
router.post('/approvals/:id/approve', approveCommissionRequest);
router.post('/approvals/:id/reject', rejectCommissionRequest);
router.post('/reset-database', resetDatabaseEndpoint);
router.post('/roi/update', updateDailyRoi);

export default router;

