import { Router } from 'express';
import * as productController from './controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createProductSchema, updateProductSchema, addProductOptionSchema } from './validation.js';
import { upload } from '../../utils/upload.js';

const router = Router();

router.use(protect, requireRole('ADMIN'));

// Middleware to parse multipart form data strings back to objects/numbers
const parseProductBody = (req: any, res: any, next: any) => {
  if (req.body.name && typeof req.body.name === 'string') {
    try { req.body.name = JSON.parse(req.body.name); } catch (e) {}
  }
  if (req.body.description && typeof req.body.description === 'string') {
    try { req.body.description = JSON.parse(req.body.description); } catch (e) {}
  }
  if (req.body.price !== undefined) req.body.price = Number(req.body.price);
  if (req.body.isAvailable !== undefined) req.body.isAvailable = req.body.isAvailable === 'true';
  next();
};

router.get('/', productController.getAllProductsAdmin);
router.post('/', upload.single('image'), parseProductBody, validate(createProductSchema), productController.createProduct);
router.put('/:id', upload.single('image'), parseProductBody, validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/:id/options', validate(addProductOptionSchema), productController.addProductOption);

export default router;
