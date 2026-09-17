import express from 'express';
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  resendCode,
  verifyEmail
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.post('/verify-email', verifyEmail);
router.post('/resend-code', resendCode);

export default router;
