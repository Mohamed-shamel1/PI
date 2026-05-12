import { Request, Response } from 'express';
import * as productService from './service.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { successResponse } from '../../utils/responseHandler.js';

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    req.body.imageUrl = `/uploads/products/${req.file.filename}`;
  }
  const product = await productService.createProduct(req.body);
  return successResponse({
    res,
    statusCode: 201,
    message: 'Product created successfully',
    data: { product },
  });
});

export const addProductOption = catchAsync(async (req: Request, res: Response) => {
  const option = await productService.addProductOption(req.params.id as string, req.body);
  return successResponse({
    res,
    statusCode: 201,
    message: 'Product option added successfully',
    data: { option },
  });
});

export const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const products = await productService.getAllProducts();
  return successResponse({
    res,
    message: 'Products fetched successfully',
    results: products.length,
    data: { products },
  });
});

export const getProductById = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params.id as string);
  return successResponse({
    res,
    message: 'Product fetched successfully',
    data: { product },
  });
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    req.body.imageUrl = `/uploads/products/${req.file.filename}`;
  }
  const product = await productService.updateProduct(req.params.id as string, req.body);
  return successResponse({
    res,
    message: 'Product updated successfully',
    data: { product },
  });
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  await productService.deleteProduct(req.params.id as string);
  return successResponse({
    res,
    message: 'Product deleted successfully (soft delete)',
  });
});

export const getAllProductsAdmin = catchAsync(async (req: Request, res: Response) => {
  const products = await productService.getAllProductsAdmin();
  return successResponse({
    res,
    message: 'All products fetched for admin',
    results: products.length,
    data: { products },
  });
});

