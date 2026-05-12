import { Router } from 'express';
import * as couponController from './controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { couponSchema } from './validation.js';

const router = Router();

router.route('/')
  .get(couponController.getCoupons)
  .post(validate(couponSchema), couponController.createCoupon);

router.route('/:id')
  .patch(validate(couponSchema), couponController.updateCoupon)
  .delete(couponController.deleteCoupon);

export default router;
