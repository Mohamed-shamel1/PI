import { Router } from 'express';
import * as zoneController from './controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { zoneSchema } from './validation.js';

const router = Router();

router.route('/')
  .get(zoneController.getZones)
  .post(validate(zoneSchema), zoneController.createZone);

router.route('/:id')
  .patch(validate(zoneSchema), zoneController.updateZone)
  .delete(zoneController.deleteZone);

export default router;
