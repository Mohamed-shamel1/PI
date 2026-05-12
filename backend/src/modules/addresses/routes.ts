import { Router } from 'express';
import * as addressController from './controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { addressSchema } from './validation.js';

const router = Router();

router.route('/')
  .get(addressController.getMyAddresses)
  .post(validate(addressSchema), addressController.createAddress);

router.route('/:id')
  .delete(addressController.deleteAddress);

export default router;
