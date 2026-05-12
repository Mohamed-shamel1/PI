import { z } from 'zod';

const categoryNameSchema = z.object({
  en: z.string().min(1, 'English name is required'),
  ar: z.string().min(1, 'Arabic name is required'),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: categoryNameSchema,
    isActive: z.boolean().optional(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: categoryNameSchema.optional(),
    isActive: z.boolean().optional(),
  }),
});
