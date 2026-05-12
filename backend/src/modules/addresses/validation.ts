import { z } from 'zod';

export const addressSchema = z.object({
  body: z.object({
    zoneId: z.string().uuid('Invalid zone selection'),
    street: z.string().min(5, 'Street address must be at least 5 characters'),
    city: z.string().min(2, 'City must be at least 2 characters'),
    buildingNumber: z.string().optional().nullable(),
    isDefault: z.boolean().optional(),
  }),
});
