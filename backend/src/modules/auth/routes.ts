import { Router } from 'express';
import * as authController from './controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from './validation.js';
import { authLimiter } from '../../middlewares/rateLimit.middleware.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { upload } from '../../utils/upload.js';

const router = Router();

// Public
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);

// Protected
router.use(protect); // All routes below this line require authentication

router.post('/logout', authController.logout);
router.get('/me', authController.getMe);
router.get('/profile', authController.getProfile);
router.patch('/profile', authController.updateProfile);
router.patch('/updateMe', upload.single('avatar'), authController.updateMe);
router.patch('/change-password', authController.changePassword);

export default router;
