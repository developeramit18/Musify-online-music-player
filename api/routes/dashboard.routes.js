import express from 'express';
import { verifyToken } from '../utils/verifyToken.js';
import { dashboard, deleteUser, getUsers, updateUserRole } from '../controllers/dashboard.controller.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';

const router = express.Router();

router.get('/',verifyToken, verifyAdmin, dashboard)
router.get('/users',verifyToken, verifyAdmin, getUsers);
router.delete('/users/:userId',verifyToken, verifyAdmin, deleteUser);
router.put('/user/update-role/:id', verifyToken, verifyAdmin, updateUserRole);

export default router;