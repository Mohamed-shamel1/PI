import { Request, Response } from 'express';
import * as orderService from './service.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { successResponse } from '../../utils/responseHandler.js';
import { getIO } from '../../utils/socket.js';

export const checkout = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.checkout(req.user!.id, req.body);
  return successResponse({
    res,
    statusCode: 201,
    message: 'Order placed successfully',
    data: { order },
  });
});

export const processOnlinePayment = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.processOnlinePaymentService(req.params.id, req.user!.id);
  return successResponse({
    res,
    message: 'Payment completed successfully (Mock)',
    data: { order },
  });
});

export const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await orderService.getMyOrders(req.user!.id);
  return successResponse({
    res,
    message: 'Orders fetched successfully',
    results: orders.length,
    data: { orders },
  });
});

export const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.getOrderById(
    req.params.id,
    req.user!.id,
    req.user!.role === 'ADMIN'
  );
  return successResponse({
    res,
    message: 'Order details fetched',
    data: { order },
  });
});

export const getAllOrdersAdmin = catchAsync(async (req: Request, res: Response) => {
  const orders = await orderService.getAllOrdersAdmin();
  return successResponse({
    res,
    message: 'All orders fetched for admin',
    results: orders.length,
    data: { orders },
  });
});

export const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const status = req.body.status;
  const order = await orderService.updateOrderStatus(req.params.id, status);

  // Emit real-time update to the specific user
  getIO().to(`user_${order.userId}`).emit('order_status_updated', {
    orderId: order.id,
    status: status,
  });

  return successResponse({
    res,
    message: 'Order status updated successfully',
    data: { order },
  });
});
