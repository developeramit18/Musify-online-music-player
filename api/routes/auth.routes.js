import express from 'express';
import { checkLogin, forgotPassword, resetPassword, signin, signout, signup } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/logout',signout);
router.post('/reset-password/:token',resetPassword);
router.post('/forgot-password',forgotPassword);
router.get('/verify-token',verifyToken, checkLogin)

export default router;