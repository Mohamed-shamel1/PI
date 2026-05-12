import { z } from 'zod';

export const couponSchema = z.object({
  body: z.object({
    code: z.string().min(3, 'Coupon code must be at least 3 characters').toUpperCase(),
    discountType: z.enum(['PERCENTAGE', 'FIXED']),
    discountValue: z.number().min(0, 'Discount value cannot be negative'),
    expiryDate: z.string().datetime('Invalid expiry date format'),
    usageLimit: z.number().int().min(1, 'Usage limit must be at least 1').nullable().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const validateCouponSchema = z.object({
  params: z.object({
    code: z.string().min(1, 'Coupon code is required'),
  }),
});
