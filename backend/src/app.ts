import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import { apiLimiter } from './middlewares/rateLimit.middleware.js';
import { AppError } from './utils/AppError.js';
import authRoutes from './modules/auth/routes.js';
import categoryRoutes from './modules/categories/routes.js';
import categoryAdminRoutes from './modules/categories/admin.routes.js';
import productRoutes from './modules/products/routes.js';
import productAdminRoutes from './modules/products/admin.routes.js';
import cartRoutes from './modules/cart/routes.js';
import orderRoutes from './modules/orders/routes.js';
import orderAdminRoutes from './modules/orders/admin.routes.js';
import adminRoutes from './modules/admin/routes.js';
import couponRoutes from './modules/coupons/routes.js';

import logisticsAdminRoutes from './modules/logistics/admin.routes.js';
import addressRoutes from './modules/addresses/routes.js';
import couponAdminRoutes from './modules/coupons/admin.routes.js';

import logisticsRoutes from './modules/logistics/routes.js';

import cookieParser from 'cookie-parser';
import { protect, restrictTo } from './middlewares/auth.middleware.js';

const app: Application = express();

// 1) GLOBAL MIDDLEWARES
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000", "https://your-frontend.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', apiLimiter);
app.use(morgan('dev'));

// Static Files
app.use('/uploads', express.static('public/uploads'));

// 2) ROUTES
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/logistics', logisticsRoutes);
app.use('/api/v1/addresses', protect, addressRoutes);

// ADMIN ROUTES (Guarded)
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/admin/categories', protect, restrictTo('ADMIN'), categoryAdminRoutes);
app.use('/api/v1/admin/products', protect, restrictTo('ADMIN'), productAdminRoutes);
app.use('/api/v1/admin/orders', protect, restrictTo('ADMIN'), orderAdminRoutes);
app.use('/api/v1/admin/logistics', protect, restrictTo('ADMIN'), logisticsAdminRoutes);
app.use('/api/v1/admin/coupons', protect, restrictTo('ADMIN'), couponAdminRoutes);





app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Food Ordering API is running',
  });
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Food Ordering API',
  });
});

// 3) UNHANDLED ROUTES
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 4) GLOBAL ERROR HANDLING MIDDLEWAR
app.use(globalErrorHandler);

export default app;
