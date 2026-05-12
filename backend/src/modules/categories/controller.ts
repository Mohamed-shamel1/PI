import { Request, Response } from 'express';
import * as categoryService from './service.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { successResponse } from '../../utils/responseHandler.js';

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  return successResponse({
    res,
    statusCode: 201,
    message: 'Category created successfully',
    data: { category },
  });
});

export const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  return successResponse({
    res,
    message: 'Categories fetched successfully',
    results: categories.length,
    data: { categories },
  });
});

export const getAllCategoriesAdmin = catchAsync(async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategoriesAdmin();
  return successResponse({
    res,
    message: 'All categories fetched for admin',
    results: categories.length,
    data: { categories },
  });
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.updateCategory(req.params.id as string, req.body);
  return successResponse({
    res,
    message: 'Category updated successfully',
    data: { category },
  });
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(req.params.id as string);
  return successResponse({
    res,
    message: 'Category deleted successfully (soft delete)',
  });
});
