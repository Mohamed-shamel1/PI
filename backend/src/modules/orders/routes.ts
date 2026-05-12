import { Router } from 'express';
import * as orderController from './controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { checkoutSchema } from './validation.js';

const router = Router();

router.use(protect);

router.post('/', validate(checkoutSchema), orderController.checkout);
router.post('/checkout', validate(checkoutSchema), orderController.checkout);
router.post('/:id/pay', orderController.processOnlinePayment);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

export default router;
