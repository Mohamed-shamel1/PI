import { z } from 'zod';

export const zoneSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Zone name must be at least 2 characters'),
    deliveryFee: z.number().min(0, 'Delivery fee cannot be negative'),
    isActive: z.boolean().optional(),
  }),
});
