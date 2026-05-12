import { z } from 'zod';

export const addItemSchema = z.object({
  body: z.object({
    productId: z.string().uuid('Invalid product ID'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  }),
});

export const removeItemSchema = z.object({
  params: z.object({
    productId: z.string().uuid('Invalid product ID'),
  }),
});
