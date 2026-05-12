import { z } from 'zod';

const localizedSchema = z.object({
  en: z.string().min(1, 'English text is required'),
  ar: z.string().min(1, 'Arabic text is required'),
});

export const createProductSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid('Invalid category ID'),
    name: localizedSchema,
    description: localizedSchema.optional(),
    price: z.number().positive('Price must be a positive number'),
    imageUrl: z.string().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid('Invalid category ID').optional(),
    name: localizedSchema.optional(),
    description: localizedSchema.optional(),
    price: z.number().positive('Price must be a positive number').optional(),
    imageUrl: z.string().optional(),
    isAvailable: z.boolean().optional(),
  }),
});

export const addProductOptionSchema = z.object({
  body: z.object({
    name: localizedSchema,
    choices: z.array(z.object({
      en: z.string(),
      ar: z.string(),
      extraPrice: z.number().default(0),
    })),
    required: z.boolean().default(false),
  }),
});
