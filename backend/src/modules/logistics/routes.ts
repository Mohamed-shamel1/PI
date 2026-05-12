import { Router } from 'express';
import * as zoneController from './controller.js';

const router = Router();

router.get('/', zoneController.getZones);

export default router;
