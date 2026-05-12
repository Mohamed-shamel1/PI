import prisma from '../../prisma/client.js';
import { AppError } from '../../utils/AppError.js';

export const createCategory = async (data: any) => {
  return await prisma.category.create({ data });
};

export const getAllCategories = async () => {
  return await prisma.category.findMany({
    where: { isActive: true },
  });
};

export const getAllCategoriesAdmin = async () => {
  return await prisma.category.findMany();
};

export const updateCategory = async (id: string, data: any) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new AppError('Category not found', 404);

  return await prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new AppError('Category not found', 404);

  // Soft delete by setting isActive: false
  return await prisma.category.update({
    where: { id },
    data: { isActive: false },
  });
};
