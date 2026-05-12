import { Router } from 'express';
import * as cartController from './controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { addItemSchema, removeItemSchema } from './validation.js';

const router = Router();

router.use(protect);

router.get('/', cartController.getCart);
router.post('/add', validate(addItemSchema), cartController.addItemToCart);
router.delete('/remove/:productId', validate(removeItemSchema), cartController.removeItemFromCart);
router.delete('/clear', cartController.clearCart);

export default router;
