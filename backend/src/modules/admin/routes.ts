import { Router } from 'express';
import * as adminController from './controller.js';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';

const router = Router();

// All routes here are strictly for ADMINS
router.use(protect, restrictTo('ADMIN'));

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/status', adminController.toggleUserStatus);
router.delete('/users/:id', adminController.deleteUser);

export default router;
