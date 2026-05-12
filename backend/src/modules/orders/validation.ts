import { z } from 'zod';

export const checkoutSchema = z.object({
  body: z.object({
    addressId: z.string().uuid('Invalid address ID').optional(),
    address: z.object({
      street: z.string().min(1, 'Street is required'),
      city: z.string().min(1, 'City is required'),
    }).optional(),
    paymentMethod: z.enum(['CASH_ON_DELIVERY', 'ONLINE_PAYMENT']),
    notes: z.string().optional(),
    couponCode: z.string().optional(),
    items: z.array(z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
    })).optional(),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'PREPARING', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED']),
  }),
});
