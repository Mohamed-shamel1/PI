import { Router } from 'express';
import * as orderController from './controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { updateStatusSchema } from './validation.js';

const router = Router();

router.use(protect, requireRole('ADMIN'));

router.get('/', orderController.getAllOrdersAdmin);
router.put('/:id/status', validate(updateStatusSchema), orderController.updateOrderStatus);

export default router;
