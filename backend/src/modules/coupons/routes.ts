import { Router } from 'express';
import * as couponController from './controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { validateCouponSchema } from './validation.js';

const router = Router();

router.get('/validate/:code', validate(validateCouponSchema), couponController.validateCoupon);

export default router;
