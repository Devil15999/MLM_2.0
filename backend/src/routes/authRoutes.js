import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  seedAccounts,
} from '../controllers/authController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/users', protect, requireAdmin, getUsers);
router.post('/seed', seedAccounts);

export default router;
