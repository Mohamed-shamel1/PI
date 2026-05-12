import { Request, Response } from 'express';
import * as cartService from './service.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { successResponse } from '../../utils/responseHandler.js';

export const getCart = catchAsync(async (req: Request, res: Response) => {
  const cart = await cartService.getCart(req.user!.id);
  return successResponse({
    res,
    message: 'Cart fetched successfully',
    data: { cart },
  });
});

export const addItemToCart = catchAsync(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  const item = await cartService.addItemToCart(req.user!.id, productId, quantity);
  return successResponse({
    res,
    statusCode: 201,
    message: 'Item added to cart',
    data: { item },
  });
});

export const removeItemFromCart = catchAsync(async (req: Request, res: Response) => {
  await cartService.removeItemFromCart(req.user!.id, req.params.productId as string );
  return successResponse({
    res,
    message: 'Item removed from cart',
  });
});

export const clearCart = catchAsync(async (req: Request, res: Response) => {
  await cartService.clearCart(req.user!.id);
  return successResponse({
    res,
    message: 'Cart cleared successfully',
  });
});
