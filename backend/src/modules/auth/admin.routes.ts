import { Router } from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();

// Placeholder for admin-specific auth routes (e.g. user management)
router.use(protect, requireRole('ADMIN'));

router.get('/users', (req, res) => {
  res.json({ message: 'Admin access confirmed' });
});

export default router;
